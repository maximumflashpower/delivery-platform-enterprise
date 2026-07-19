import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CourierAssignment } from '../entities/courier-assignment.entity';
import { AssignmentStatus } from '../enums/assignment-status.enum';

@Injectable()
export class CourierAssignmentService {
  private readonly logger = new Logger(CourierAssignmentService.name);

  constructor(
    @InjectRepository(CourierAssignment)
    private readonly assignmentRepo: Repository<CourierAssignment>,
  ) {}

  async findAll(): Promise<CourierAssignment[]> {
    return this.assignmentRepo.find({ where: { deletedAt: IsNull() }, relations: {'courier'} });
  }

  async findByCouriertId(courierId: string): Promise<CourierAssignment[]> {
    return this.assignmentRepo.find({ 
      where: { courierId, deletedAt: IsNull() }, 
      relations: {'courier'},
      order: { createdAt: 'DESC' } 
    });
  }

  async findById(id: string): Promise<CourierAssignment> {
    const assignment = await this.assignmentRepo.findOne({ 
      where: { id, deletedAt: IsNull() }, 
      relations: {'courier'} 
    });
    if (!assignment) throw new NotFoundException(`Assignment with ID ${id} not found`);
    return assignment;
  }

  async create(data: Partial<CourierAssignment>): Promise<CourierAssignment> {
    const assignment = this.assignmentRepo.create(data);
    return this.assignmentRepo.save(assignment);
  }

  async markAssigned(id: string): Promise<CourierAssignment> {
    const assignment = await this.findById(id);
    assignment.status = AssignmentStatus.ASSIGNED;
    assignment.assignedAt = new Date();
    return this.assignmentRepo.save(assignment);
  }

  async markCompleted(id: string): Promise<CourierAssignment> {
    const assignment = await this.findById(id);
    assignment.status = AssignmentStatus.COMPLETED;
    assignment.completedAt = new Date();
    return this.assignmentRepo.save(assignment);
  }

  async markFailed(id: string, reason?: string): Promise<CourierAssignment> {
    const assignment = await this.findById(id);
    assignment.status = AssignmentStatus.FAILED;
    assignment.completedAt = new Date();
    return this.assignmentRepo.save(assignment);
  }
}
