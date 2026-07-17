import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ServiceCategory } from '../entities/service-category.entity';

@Injectable()
export class ServiceCategoryService {
  private readonly logger = new Logger(ServiceCategoryService.name);

  constructor(
    @InjectRepository(ServiceCategory)
    private readonly categoryRepo: Repository<ServiceCategory>,
  ) {}

  async findAll(): Promise<ServiceCategory[]> {
    return this.categoryRepo.find({ where: { deletedAt: IsNull(), isActive: true }, order: { name: 'ASC' } });
  }

  async findById(id: string): Promise<ServiceCategory> {
    const category = await this.categoryRepo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!category) throw new NotFoundException(`Category with ID ${id} not found`);
    return category;
  }

  async findBySlug(slug: string): Promise<ServiceCategory> {
    const category = await this.categoryRepo.findOne({ 
      where: { slug, deletedAt: IsNull(), isActive: true },
      relations: ['serviceBookings'] 
    });
    if (!category) throw new NotFoundException(`Category with slug ${slug} not found`);
    return category;
  }

  async create(data: Partial<ServiceCategory>): Promise<ServiceCategory> {
    if (!data.name || !data.slug) {
      throw new BadRequestException('name and slug are required');
    }
    const category = this.categoryRepo.create(data);
    return this.categoryRepo.save(category);
  }

  async update(id: string, data: Partial<ServiceCategory>): Promise<ServiceCategory> {
    await this.findById(id);
    Object.assign(data, { updatedAt: new Date() });
    await this.categoryRepo.update(id, data);
    return this.findById(id);
  }

  async toggleActive(id: string): Promise<ServiceCategory> {
    const category = await this.findById(id);
    category.isActive = !category.isActive;
    return this.categoryRepo.save(category);
  }
}
