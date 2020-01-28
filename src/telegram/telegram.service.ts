import Telegraf, { Markup } from 'telegraf';
import TelegrafInlineMenu from 'telegraf-inline-menu';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramService {
  private bot: Telegraf<any>;

  constructor() {
    const botToken: string = '1000664964:AAFIvIuBaSZX9aj4O-ZGU2yQ26G0wStKvOE';
    this.bot = new Telegraf(botToken);

    this.bot.command('start', ({ reply }) => {
      return reply(
        'Custom buttons keyboard',
        Markup.keyboard([
          ['🔍 Search', '+ ADD'] // Row1 with 2 buttons
        ])
          .oneTime()
          .resize()
          .extra()
      );
    });

    this.bot.hears('🔍 Search', (ctx) => ctx.reply('Yay!'));
    this.bot.hears('Find', (ctx) => ctx.reply('Find!'));
    this.bot.startPolling();
  }

  public launch(): void {
    this.bot.launch();
    this.bot.start((ctx) => ctx.reply('Welcome!'));
  }
}
