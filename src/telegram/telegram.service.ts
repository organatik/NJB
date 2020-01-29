import Telegraf, { Markup } from 'telegraf';
import TelegrafInlineMenu from 'telegraf-inline-menu';
import { Injectable } from '@nestjs/common';
import Scene = require('telegraf/scenes/base');
import Stage = require('telegraf/stage');
import { session } from 'telegraf';

@Injectable()
export class TelegramService {
  private bot: Telegraf<any>;

  constructor() {
    const botToken: string = '1000664964:AAFIvIuBaSZX9aj4O-ZGU2yQ26G0wStKvOE';
    this.bot = new Telegraf(botToken);
    const { leave } = Stage;

    // Greeter scene
    const greeter = new Scene('greeter');
    greeter.enter((ctx) => ctx.reply('Hi'));
    greeter.leave((ctx) => ctx.reply('Bye'));
    greeter.hears(/hi/gi, leave());
    greeter.on('message', (ctx) => {
      ctx.reply('Send `hi`');
      console.log(ctx.message.text, 'STATE');
    });
    // this.bot.hears('🔍 Search', (ctx) => ctx.reply('Yay!'));
    this.bot.hears('Find', (ctx) => ctx.reply('Find!'));
    this.bot.hears('test', (ctx) => {
      ctx.scene.enter(greeter);
      console.log(ctx.scene.state);
    });
    const stage = new Stage();
    stage.command('cancel', leave());
    // Scene registration
    stage.register(greeter);

    // Scene registration
    stage.register(greeter);

    this.bot.use(session());
    this.bot.use(stage.middleware());
    this.bot.command('greeter', (ctx) => ctx.scene.enter('greeter'));
    this.bot.command('test', (ctx) => {
      ctx.scene.enter('greeter');
    });
    this.bot.startPolling();
  }

  public launch(): void {
    this.bot.launch();
  }
}
