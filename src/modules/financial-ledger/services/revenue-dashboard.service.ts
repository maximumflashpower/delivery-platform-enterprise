import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RevenueSnapshot } from '../entities/revenue-snapshot.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalLine } from '../entities/journal-line.entity';
import { Account } from '../entities/account.entity';
import { GenerateSnapshotDto } from '../dto/generate-snapshot.dto';

@Injectable()
export class RevenueDashboardService {
  constructor(
    @InjectRepository(RevenueSnapshot)
    private readonly revenueSnapshotRepo: Repository<RevenueSnapshot>,
    
    @InjectRepository(JournalEntry)
    private readonly journalEntryRepo: Repository<JournalEntry>,
    
    @InjectRepository(JournalLine)
    private readonly journalLineRepo: Repository<JournalLine>,
    
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async getOverview(startDate: string, endDate: string): Promise<Object> {
    // Get journal lines within date range via entryDate
    const lines = await this.journalLineRepo
      .createQueryBuilder('jl')
      .leftJoin('jl.entry', 'je')
      .where("DATE(je.entryDate) BETWEEN :start AND :end", {
        start: startDate,
        end: endDate,
      })
      .getMany();

    const totalRevenue = lines.reduce((sum, line) => sum + parseFloat(line.amount.toString()), 0);
    const ordersCount = lines.length;
    const avgOrderValue = ordersCount > 0 ? totalRevenue / ordersCount : 0;

    return {
      period: { startDate, endDate },
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      ordersCount,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      currency: 'MXN',
      generatedAt: new Date(),
    };
  }

  async findAllSnapshots(): Promise<RevenueSnapshot[]> {
    return this.revenueSnapshotRepo.find({
      order: { snapshotDate: 'DESC' },
    });
  }

  async findSnapshot(id: string): Promise<RevenueSnapshot> {
    const snapshot = await this.revenueSnapshotRepo.findOne({ where: { id } });
    if (!snapshot) {
      throw new NotFoundException(`Snapshot ${id} not found`);
    }
    return snapshot;
  }

  async generateSnapshot(dto: GenerateSnapshotDto): Promise<RevenueSnapshot> {
    const snapshotDate = new Date(dto.snapshotDate);

    // Get journal lines for the date
    const lines = await this.journalLineRepo
      .createQueryBuilder('jl')
      .leftJoin('jl.entry', 'je')
      .where("DATE(je.entryDate) = :date", {
        date: snapshotDate.toISOString().split('T')[0],
      })
      .getMany();

    // Load accounts for categorization
    const accountIds = [...new Set(lines.map(l => l.accountId))];
    const accounts = await this.accountRepo.findBy({ id: In(accountIds) });
    const accountMap = new Map(accounts.map(a => [a.id, a]));

    // Calculate metrics by domain (using account type as domain proxy)
    const domainTotals: Record<string, number> = {};
    let totalRevenue = 0;

    lines.forEach(line => {
      const account = accountMap.get(line.accountId);
      const domain = account?.type?.toLowerCase() || line.type.toLowerCase() || 'other';
      domainTotals[domain] = (domainTotals[domain] || 0) + parseFloat(line.amount.toString());
      totalRevenue += parseFloat(line.amount.toString());
    });

    const ordersCount = lines.length;
    const avgOrderValue = ordersCount > 0 ? totalRevenue / ordersCount : 0;

    // Create snapshot
    const snapshot = new RevenueSnapshot();
    snapshot.snapshotDate = snapshotDate;
    snapshot.totalRevenue = Math.round(totalRevenue * 100) / 100;
    snapshot.ordersCount = ordersCount;
    snapshot.avgOrderValue = Math.round(avgOrderValue * 100) / 100;
    snapshot.byDomain = JSON.stringify(domainTotals);
    snapshot.byPaymentMethod = null; // Payment method info not in journal lines
    
    // Set generatedAt manually since it's CreateDateColumn
    snapshot.generatedAt = new Date();

    return this.revenueSnapshotRepo.save(snapshot);
  }

  async getTrends(period: string): Promise<Object> {
    const days = period === 'daily' ? 7 : period === 'weekly' ? 4 : 12;
    
    const snapshots = await this.revenueSnapshotRepo
      .find({
        order: { snapshotDate: 'DESC' },
        take: days,
      })
      .then(s => s.reverse());

    return {
      period,
      data: snapshots.map(s => ({
        date: s.snapshotDate,
        revenue: s.totalRevenue,
        orders: s.ordersCount,
        avgValue: s.avgOrderValue,
      })),
      summary: {
        totalRevenue: snapshots.reduce((sum, s) => sum + s.totalRevenue, 0),
        totalOrders: snapshots.reduce((sum, s) => sum + s.ordersCount, 0),
        avgRevenuePerDay: snapshots.length > 0 
          ? snapshots.reduce((sum, s) => sum + s.totalRevenue, 0) / snapshots.length 
          : 0,
      },
    };
  }

  async getByDomain(startDate?: string, endDate?: string): Promise<Object> {
    let queryBuilder = this.journalLineRepo.createQueryBuilder('jl');
    queryBuilder.leftJoin('jl.entry', 'je');

    if (startDate && endDate) {
      queryBuilder.where("DATE(je.entryDate) BETWEEN :start AND :end", {
        start: startDate,
        end: endDate,
      });
    }

    const lines = await queryBuilder.getMany();

    // Load accounts for categorization
    const accountIds = [...new Set(lines.map(l => l.accountId))];
    const accounts = await this.accountRepo.findBy({ id: In(accountIds) });
    const accountMap = new Map(accounts.map(a => [a.id, a]));

    const domainTotals: Record<string, { revenue: number, count: number }> = {};
    
    lines.forEach(line => {
      const account = accountMap.get(line.accountId);
      const domain = account?.type?.toLowerCase() || line.type.toLowerCase() || 'other';
      if (!domainTotals[domain]) {
        domainTotals[domain] = { revenue: 0, count: 0 };
      }
      const amount = parseFloat(line.amount.toString());
      domainTotals[domain].revenue += amount;
      domainTotals[domain].count += 1;
    });

    return {
      domains: Object.entries(domainTotals).map(([name, data]) => ({
        name,
        revenue: Math.round(data.revenue * 100) / 100,
        orders: data.count,
        avgOrderValue: data.count > 0 ? Math.round((data.revenue / data.count) * 100) / 100 : 0,
      })).sort((a, b) => b.revenue - a.revenue),
      generatedAt: new Date(),
    };
  }
}
