import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Job } from '../entities/job.entity';
import { JobStatus } from '../enums/job-status.enum';

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);

  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
  ) {}

  async findAll(): Promise<Job[]> {
    return this.jobRepo.find({ where: { deletedAt: IsNull() }, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Job> {
    const job = await this.jobRepo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!job) throw new NotFoundException(`Job with ID ${id} not found`);
    return job;
  }

  async create(data: Partial<Job>): Promise<Job> {
    if (!data.jobCode || !data.name || !data.jobType) {
      throw new BadRequestException('jobCode, name, and jobType are required');
    }
    return this.jobRepo.save(this.jobRepo.create(data));
  }

  async update(id: string, data: Partial<Job>): Promise<Job> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.jobRepo.update(id, data);
    return this.findById(id);
  }

  async queue(id: string): Promise<Job> {
    const job = await this.findById(id);
    job.status = JobStatus.QUEUED;
    return this.jobRepo.save(job);
  }

  async start(id: string): Promise<Job> {
    const job = await this.findById(id);
    job.status = JobStatus.RUNNING;
    job.startedAt = new Date();
    return this.jobRepo.save(job);
  }

  async complete(id: string): Promise<Job> {
    const job = await this.findById(id);
    job.status = JobStatus.COMPLETED;
    job.completedAt = new Date();
    return this.jobRepo.save(job);
  }

  async fail(id: string, errorMessage: string): Promise<Job> {
    const job = await this.findById(id);
    job.status = JobStatus.FAILED;
    job.errorMessage = errorMessage;
    return this.jobRepo.save(job);
  }

  async retry(id: string): Promise<Job> {
    const job = await this.findById(id);
    job.status = JobStatus.RETRYING;
    job.retryCount += 1;
    return this.jobRepo.save(job);
  }

  async cancel(id: string): Promise<Job> {
    const job = await this.findById(id);
    job.status = JobStatus.CANCELLED;
    return this.jobRepo.save(job);
  }
}
