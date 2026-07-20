import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { Community } from './entities/community.entity';
import { CommunityMembership } from './entities/community-membership.entity';
import { Profile } from './entities/profile.entity';
import { CommunityController } from './controllers/community.controller';
import { CommunityMembershipController } from './controllers/community-membership.controller';
import { ProfileController } from './controllers/profile.controller';
import { CommunityService } from './services/community.service';
import { CommunityMembershipService } from './services/community-membership.service';
import { ProfileService } from './services/profile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      UserRole,
      Community,
      CommunityMembership,
      Profile,
    ]),
  ],
  controllers: [
    CommunityController,
    CommunityMembershipController,
    ProfileController,
  ],
  providers: [
    CommunityService,
    CommunityMembershipService,
    ProfileService,
  ],
  exports: [CommunityService, CommunityMembershipService, ProfileService],
})
export class RoleProfileModule {}
