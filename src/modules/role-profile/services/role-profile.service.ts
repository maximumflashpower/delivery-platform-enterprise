import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Profile } from '../entities/profile.entity';
import { UserRole } from '../entities/user-role.entity';
import { RoleLevel } from '../enums/role-level.enum';
import { ProfileType } from '../enums/profile-type.enum';

@Injectable()
export class RoleProfileService {
  private readonly logger = new Logger(RoleProfileService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
  ) {}

  // Roles
  async createRole(data: { name: string; description: string; level: RoleLevel; permissions?: string[] }): Promise<Role> {
    const role = this.roleRepo.create(data);
    return this.roleRepo.save(role);
  }

  async findAllRoles(): Promise<Role[]> {
    return this.roleRepo.find({ where: { isActive: true } });
  }

  async findRoleById(id: string): Promise<Role> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async updateRole(id: string, data: Partial<Role>): Promise<Role> {
    const role = await this.findRoleById(id);
    Object.assign(role, data);
    return this.roleRepo.save(role);
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.findRoleById(id);
    role.isActive = false;
    await this.roleRepo.save(role);
  }

  // Profiles
  async createProfile(userId: string, data: { type: ProfileType; bio?: string; website?: string; location?: string }): Promise<Profile> {
    const profile = this.profileRepo.create({ ...data, userId });
    return this.profileRepo.save(profile);
  }

  async findByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileRepo.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async updateProfile(profileId: string, data: Partial<Profile>): Promise<Profile> {
    const profile = await this.profileRepo.findOne({ where: { id: profileId } });
    if (!profile) throw new NotFoundException('Profile not found');
    Object.assign(profile, data);
    return this.profileRepo.save(profile);
  }

  // User-Role Assignments
  async assignRole(userId: string, roleId: string, assignedBy?: string): Promise<UserRole> {
    const existing = await this.userRoleRepo.findOne({ where: { userId, roleId } });
    if (existing) return existing;

    const userRole = this.userRoleRepo.create({
      userId,
      roleId,
      assignedAt: new Date(),
      assignedBy,
    });
    return this.userRoleRepo.save(userRole);
  }

  async getUserRoles(userId: string): Promise<UserRole[]> {
    return this.userRoleRepo.find({
      where: { userId },
      relations: ['role'],
      order: { assignedAt: 'DESC' },
    });
  }

  async removeUserRole(userRoleId: string): Promise<void> {
    const userRole = await this.userRoleRepo.findOne({ where: { id: userRoleId } });
    if (!userRole) throw new NotFoundException('User role assignment not found');
    await this.userRoleRepo.remove(userRole);
  }

  async hasRole(userId: string, roleIds: string[]): Promise<boolean> {
    const count = await this.userRoleRepo.count({
      where: { userId, roleId: In(roleIds) },
    });
    return count > 0;
  }
}
