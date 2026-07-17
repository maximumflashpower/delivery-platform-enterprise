import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartContract } from './entities/smart-contract.entity';
import { ContractExecution } from './entities/contract-execution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SmartContract, ContractExecution])],
  exports: [TypeOrmModule],
})
export class SmartContractModule {}
