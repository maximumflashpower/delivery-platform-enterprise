import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Profile } from './entities/profile.entity';
import { UserRole } from './entities/user-role.entity';
import { RoleProfileService } from './services/role-profile.service';
import { RoleProfileController } from './controllers/role-profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Profile, UserRole])],
  providers: [RoleProfileService],
  controllers: [RoleProfileController],
  exports: [TypeOrmModule, RoleProfileService],
})
export class RoleProfileModule {}
