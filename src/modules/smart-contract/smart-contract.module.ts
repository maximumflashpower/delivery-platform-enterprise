import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartContract } from './entities/smart-contract.entity';
import { ContractExecution } from './entities/contract-execution.entity';
import { SmartContractService } from './services/smart-contract.service';
import { SmartContractController } from './controllers/smart-contract.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SmartContract, ContractExecution])],
  controllers: [SmartContractController],
  providers: [SmartContractService],
  exports: [TypeOrmModule],
})
export class SmartContractModule {}
