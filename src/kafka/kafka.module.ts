import { Module } from "@nestjs/common";
import { ProducerService } from "./services/producer.service";
import { ConsumerService } from "./services/consumer.service";
import { DlqModule } from "../database/dead-letter-queue/dlq.module";

@Module({
  imports: [DlqModule],
  providers: [ProducerService, ConsumerService],
  exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
