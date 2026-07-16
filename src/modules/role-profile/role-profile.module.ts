import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Profile } from './entities/profile.entity';
import { UserRole } from './entities/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Profile, UserRole])],
  exports: [TypeOrmModule],
})
export class RoleProfileModule {}
