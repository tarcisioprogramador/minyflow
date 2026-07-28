import { Module } from '@nestjs/common';
import { DripSequencesService } from './drip-sequences.service';
import { DripSequencesController } from './drip-sequences.controller';

@Module({
  controllers: [DripSequencesController],
  providers: [DripSequencesService],
  exports: [DripSequencesService],
})
export class DripSequencesModule {}
