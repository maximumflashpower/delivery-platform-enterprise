import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Capability } from './entities/capability.entity';
import { SourceAuthority } from './entities/source-authority.entity';
import { CapabilityRegistryService } from './services/capability-registry.service';
import { CapabilityRegistryController } from './controllers/capability-registry.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Capability, SourceAuthority])],
  providers: [CapabilityRegistryService],
  controllers: [CapabilityRegistryController],
  exports: [CapabilityRegistryService],
})
export class DeveloperPlatformModule {}
