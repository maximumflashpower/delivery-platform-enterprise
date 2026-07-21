import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assembly } from '../entities/assembly.entity';
import { CreateAssemblyDto } from '../dto/create-assembly.dto'
import { UpdateAssemblyDto } from '../dto/update-assembly.dto';

@Injectable()
export class AssemblyService {
  constructor(
    @InjectRepository(Assembly)
    private readonly assemblyRepo: Repository<Assembly>,
  ) {}

  async create(dto: CreateAssemblyDto): Promise<Assembly> {
    const assembly = this.assemblyRepo.create(dto);
    return this.assemblyRepo.save(assembly);
  }

  async findAll(options?: { communityId?: string }): Promise<Assembly[]> {
    const query = this.assemblyRepo.createQueryBuilder('assembly');
    
    if (options?.communityId) {
      query.where('assembly.communityId = :communityId', { communityId: options.communityId });
    }
    
    query.orderBy('assembly.scheduledStart', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<Assembly> {
    const assembly = await this.assemblyRepo.findOne({ where: { id }, relations: ['participants'] });
    if (!assembly) throw new NotFoundException(`Assembly ${id} not found`);
    return assembly;
  }

  async update(id: string, dto: UpdateAssemblyDto): Promise<Assembly> {
    const assembly = await this.findOne(id);
    Object.assign(assembly, dto);
    return this.assemblyRepo.save(assembly);
  }

  async remove(id: string): Promise<void> {
    const assembly = await this.findOne(id);
    await this.assemblyRepo.remove(assembly);
  }

  async activate(id: string): Promise<Assembly> {
    const assembly = await this.findOne(id);
    if (assembly.status !== 'scheduled') throw new ConflictException('Only scheduled assemblies can be activated');
    assembly.status = 'active';
    assembly.actualStart = new Date();
    return this.assemblyRepo.save(assembly);
  }

  async complete(id: string): Promise<Assembly> {
    const assembly = await this.findOne(id);
    if (assembly.status !== 'active') throw new ConflictException('Only active assemblies can be completed');
    assembly.status = 'completed';
    assembly.actualEnd = new Date();
    return this.assemblyRepo.save(assembly);
  }

  async checkQuorum(id: string): Promise<{ met: boolean; current: number; required: number }> {
    const assembly = await this.findOne(id);
    if (!assembly.requiresQuorum) return { met: true, current: 0, required: 0 };
    
    const participantCount = assembly.participants?.length || 0;
    const required = Math.ceil(assembly.quorumPercentage / 100 * participantCount);
    const met = participantCount >= required;
    
    return { met, current: participantCount, required };
  }
}
