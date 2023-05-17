import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Dlq>;

@Schema()
export class Dlq {
  @Prop()
  value: string;

  @Prop()
  topic: string;
}

export const DLQSchema = SchemaFactory.createForClass(Dlq);
