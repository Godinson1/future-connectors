import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConsumerConfig, ConsumerSubscribeTopics, KafkaMessage } from "kafkajs";
import { KafkajsConsumer } from "../kafka.consumer";
import { IConsumer } from "../interfaces/consumer.interface";
import { DlqService } from "../../database/dead-letter-queue/dlq.service";

interface KafkajsConsumerOptions {
  topic: ConsumerSubscribeTopics;
  config: ConsumerConfig;
  onMessage: (message: KafkaMessage) => Promise<void>;
}

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly consumers: IConsumer[] = [];

  constructor(private readonly configService: ConfigService, private readonly dlqService: DlqService) {}

  async consume({ topic, config, onMessage }: KafkajsConsumerOptions) {
    const consumer = new KafkajsConsumer(topic, this.dlqService, config, this.configService.get("KAFKA_BROKER"));
    await consumer.connect();
    await consumer.consume(onMessage);
    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
