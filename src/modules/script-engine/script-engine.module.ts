import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Script } from './entities/script.entity';
import { ScriptExecution } from './entities/script-execution.entity';
import { ScriptTemplate } from './entities/script-template.entity';
import { ScriptVariable } from './entities/script-variable.entity';
import { ScriptService } from './services/script.service';
import { ScriptExecutionService } from './services/script-execution.service';
import { ScriptTemplateService } from './services/script-template.service';
import { ScriptVariableService } from './services/script-variable.service';
import { ScriptController } from './controllers/script.controller';
import { ExecutionController } from './controllers/execution.controller';
import { TemplateController } from './controllers/template.controller';
import { VariableController } from './controllers/variable.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Script, ScriptExecution, ScriptTemplate, ScriptVariable]),
  ],
  controllers: [
    ScriptController,
    ExecutionController,
    TemplateController,
    VariableController,
  ],
  providers: [
    ScriptService,
    ScriptExecutionService,
    ScriptTemplateService,
    ScriptVariableService,
  ],
  exports: [
    ScriptService,
    ScriptExecutionService,
    ScriptTemplateService,
    ScriptVariableService,
  ],
})
export class ScriptEngineModule {}
