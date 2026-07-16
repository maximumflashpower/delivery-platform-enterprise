import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from '../entities/route.entity';

@Injectable()
export class SurfaceRoutingService {
  private readonly logger = new Logger(SurfaceRoutingService.name);

  constructor(
    @InjectRepository(Route)
    private readonly routeRepo: Repository<Route>,
  ) {}

  async createRoute(data: {
    routeId: string;
    waypoints: Array<{ lat: number; lng: number; order: number }>;
    distanceKm?: number;
    estimatedDurationSeconds?: number;
    optimizationMode?: string;
  }): Promise<Route> {
    const existing = await this.routeRepo.findOne({ where: { routeId: data.routeId } });
    if (existing) throw new BadRequestException(`Route ${data.routeId} already exists`);

    const sortedWaypoints = [...data.waypoints].sort((a, b) => a.order - b.order);
    
    const route = this.routeRepo.create({
      routeId: data.routeId,
      waypoints: sortedWaypoints,
      distanceKm: data.distanceKm,
      estimatedDurationSeconds: data.estimatedDurationSeconds,
      optimizationMode: data.optimizationMode || 'optimal',
    });
    this.logger.log(`Route ${data.routeId} created with ${sortedWaypoints.length} waypoints`);
    return this.routeRepo.save(route);
  }

  async findAllRoutes(where?: Partial<Route>): Promise<Route[]> {
    return this.routeRepo.find({
      where: where || {},
      order: { createdAt: 'DESC' },
    });
  }

  async findRouteById(id: string): Promise<Route> {
    const route = await this.routeRepo.findOne({ where: { id } });
    if (!route) throw new NotFoundException('Route not found');
    return route;
  }

  async findRouteByRouteId(routeId: string): Promise<Route> {
    const route = await this.routeRepo.findOne({ where: { routeId } });
    if (!route) throw new NotFoundException('Route not found');
    return route;
  }

  async findRoutesByOptimizationMode(mode: string): Promise<Route[]> {
    return this.routeRepo.find({
      where: { optimizationMode: mode },
      order: { createdAt: 'DESC' },
    });
  }

  async updateRoute(id: string, data: Partial<Route>): Promise<Route> {
    const route = await this.findRouteById(id);
    Object.assign(route, data);
    return this.routeRepo.save(route);
  }

  async addWaypoint(id: string, waypoint: { lat: number; lng: number; order: number }): Promise<Route> {
    const route = await this.findRouteById(id);
    
    const existingOrder = route.waypoints.some(w => w.order === waypoint.order);
    if (existingOrder) {
      throw new BadRequestException(`Waypoint with order ${waypoint.order} already exists`);
    }

    route.waypoints.push(waypoint);
    route.waypoints.sort((a, b) => a.order - b.order);
    
    this.logger.log(`Waypoint added to route ${route.routeId}`);
    return this.routeRepo.save(route);
  }

  async removeWaypoint(id: string, order: number): Promise<Route> {
    const route = await this.findRouteById(id);
    
    const initialLength = route.waypoints.length;
    route.waypoints = route.waypoints.filter(w => w.order !== order);
    
    if (route.waypoints.length === initialLength) {
      throw new NotFoundException(`Waypoint with order ${order} not found`);
    }

    route.waypoints.sort((a, b) => a.order - b.order);
    
    this.logger.log(`Waypoint removed from route ${route.routeId}`);
    return this.routeRepo.save(route);
  }

  async reorderWaypoints(id: string, newOrder: Array<{ order: number; lat: number; lng: number }>): Promise<Route> {
    const route = await this.findRouteById(id);

    if (newOrder.length !== route.waypoints.length) {
      throw new BadRequestException('Waypoint count mismatch');
    }

    route.waypoints = newOrder.map((w, i) => ({
      lat: w.lat,
      lng: w.lng,
      order: i + 1,
    }));

    this.logger.log(`Waypoints reordered for route ${route.routeId}`);
    return this.routeRepo.save(route);
  }

  async optimizeRoute(id: string, mode: string): Promise<Route> {
    const route = await this.findRouteById(id);

    if (mode === 'shortest_distance') {
      const waypoints = [...route.waypoints];
      const optimized: Array<{ lat: number; lng: number; order: number }> = [];
      const visited = new Set<number>();

      let current = waypoints[0];
      optimized.push(current);
      visited.add(current.order);

      while (optimized.length < waypoints.length) {
        let nearest: { lat: number; lng: number; order: number } | null = null;
        let minDist = Infinity;

        for (const wp of waypoints) {
          if (visited.has(wp.order)) continue;
          const dist = this.haversineDistance(current.lat, current.lng, wp.lat, wp.lng);
          if (dist < minDist) {
            minDist = dist;
            nearest = wp;
          }
        }

        if (nearest) {
          optimized.push(nearest);
          visited.add(nearest.order);
          current = nearest;
        }
      }

      optimized.forEach((wp, i) => { wp.order = i + 1; });
      route.waypoints = optimized;
    }

    route.optimizationMode = mode;
    this.logger.log(`Route ${route.routeId} optimized with mode: ${mode}`);
    return this.routeRepo.save(route);
  }

  async calculateDistance(id: string): Promise<{ totalDistanceKm: number; segmentDistances: number[] }> {
    const route = await this.findRouteById(id);
    const segments: number[] = [];

    for (let i = 0; i < route.waypoints.length - 1; i++) {
      const a = route.waypoints[i];
      const b = route.waypoints[i + 1];
      const dist = this.haversineDistance(a.lat, a.lng, b.lat, b.lng);
      segments.push(Math.round(dist * 100) / 100);
    }

    const total = segments.reduce((sum, d) => sum + d, 0);
    
    route.distanceKm = Math.round(total * 1000) / 1000;
    await this.routeRepo.save(route);

    return { totalDistanceKm: total, segmentDistances: segments };
  }

  async getRouteStats(): Promise<{
    total: number;
    byOptimizationMode: Record<string, number>;
    avgWaypoints: number;
    avgDistanceKm: number;
    avgDurationSeconds: number;
  }> {
    const routes = await this.routeRepo.find();
    const stats: any = {
      total: routes.length,
      byOptimizationMode: {},
      avgWaypoints: 0,
      avgDistanceKm: 0,
      avgDurationSeconds: 0,
    };

    let totalWaypoints = 0;
    let totalDistance = 0;
    let totalDuration = 0;
    let routesWithDistance = 0;
    let routesWithDuration = 0;

    for (const r of routes) {
      stats.byOptimizationMode[r.optimizationMode] = (stats.byOptimizationMode[r.optimizationMode] || 0) + 1;
      totalWaypoints += r.waypoints.length;
      if (r.distanceKm) {
        totalDistance += parseFloat(String(r.distanceKm));
        routesWithDistance++;
      }
      if (r.estimatedDurationSeconds) {
        totalDuration += r.estimatedDurationSeconds;
        routesWithDuration++;
      }
    }

    stats.avgWaypoints = routes.length > 0 ? Math.round((totalWaypoints / routes.length) * 100) / 100 : 0;
    stats.avgDistanceKm = routesWithDistance > 0 ? Math.round((totalDistance / routesWithDistance) * 1000) / 1000 : 0;
    stats.avgDurationSeconds = routesWithDuration > 0 ? Math.round(totalDuration / routesWithDuration) : 0;

    return stats;
  }

  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
