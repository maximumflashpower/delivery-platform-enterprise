import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SandboxInstance } from './entities/sandbox-instance.entity';
import { SandboxExecution } from './entities/sandbox-execution.entity';
import { SandboxResourceSnapshot } from './entities/sandbox-resource-snapshot.entity';
import { AgentSandboxService } from './services/agent-sandbox.service';
import { AgentSandboxController } from './controllers/agent-sandbox.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SandboxInstance, SandboxExecution, SandboxResourceSnapshot])],
  controllers: [AgentSandboxController],
  providers: [AgentSandboxService],
  exports: [AgentSandboxService],
})
export class AgentSandboxModule {}
