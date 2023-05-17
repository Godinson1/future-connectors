import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Dlq, DLQSchema } from './shema/dlq.schema';
import { DlqService } from './dlq.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Dlq.name, schema: DLQSchema }])],
  providers: [DlqService],
  exports: [DlqService],
})
export class DlqModule {}
