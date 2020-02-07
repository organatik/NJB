import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramService } from './telegram.service';
import { TelegramTransportService } from './telegram-transport.service';
import { CompanySchema } from './schemas/comapny.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }]),
  ],
  providers: [TelegramService, TelegramTransportService],
  exports: [TelegramService],
})
export class TelegramModule {
  constructor(telegramService: TelegramService) {
    telegramService.launch();
  }
}
