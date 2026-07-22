import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedTeamTest } from './entities/red-team-test.entity';
import { RedTeamFinding } from './entities/red-team-finding.entity';
import { RedTeamService } from './services/red-team.service';
import { RedTeamController } from './controllers/red-team.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RedTeamTest, RedTeamFinding])],
  providers: [RedTeamService],
  controllers: [RedTeamController],
  exports: [RedTeamService],
})
export class RedTeamModule {}
