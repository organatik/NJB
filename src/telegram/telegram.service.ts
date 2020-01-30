import Telegraf, { Markup } from 'telegraf';
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

    // findScene scene
    const findScene = new Scene('findScene');
    findScene.enter((ctx) => ctx.reply('Выберите тип Поиска'));
    findScene.leave((ctx) => {
      return ctx.reply(
        'Выберите тип действия',
        Markup.keyboard([
          ['Search', '+ ADD'] // Row1 with 2 buttons
        ])
          .oneTime()
          .resize()
          .extra()
      );
    });
    findScene.hears(/hi/gi, leave());
    findScene.hears('MainMenu', leave());
    findScene.on('message', (ctx) => {
      // ctx.reply('Выберите тип поиска');
      // ctx.reply(ctx.message.text);
      // console.log(ctx.message.text, 'STATE');
      // ctx.reply('Выберите тип Поиска'), Markup.keyboard([['Number', 'Text']]);
    });

    const addScene = new Scene('AddScene');
    addScene.enter((ctx) => {
      ctx.reply('Enter Company and number like this CompanyName#12345');
    });

    addScene.on('message', (ctx) => {
      let result;
      result = ctx.message.text.split('#');
      if (result.length !== 2) {
        ctx.reply('Enter like this format Companyname#12345');
      } else {
        ctx.reply(`Your company name is <b>${result[0]}</b>`);
        ctx.reply(`Your company number is ${result[1]}`);
      }
    });

    this.bot.hears('Number', (ctx) => {
      ctx.reply('Введите номер компании');
    });
    const stage = new Stage();
    stage.command('cancel', leave());
    // Scene registration
    stage.register(findScene);
    stage.register(addScene);

    // Scene registration
    this.bot.command('start', ({ reply }) => {
      return reply(
        'Выберите тип действия',
        Markup.keyboard([
          ['Search', '+ ADD'] // Row1 with 2 buttons
        ])
          .oneTime()
          .resize()
          .extra()
      );
    });
    this.bot.use(session());
    this.bot.use(stage.middleware());
    this.bot.command('findScene', (ctx) => ctx.scene.enter('findScene'));
    this.bot.command('test', (ctx) => {
      ctx.scene.enter('findScene');
    });
    this.bot.hears('Search', (ctx) => {
      ctx.scene.enter('findScene');
      return ctx.reply(
        'Выберите тип поиска',
        Markup.keyboard([['Number', 'Text', 'MainMenu']])
          .oneTime()
          .resize()
          .extra()
      );
    });

    this.bot.hears('+ ADD', (ctx) => {
      ctx.scene.enter('AddScene');
    });
    this.bot.hears('MainMenu', (ctx) => {
      return ctx.reply(
        'Выберите тип действия',
        Markup.keyboard([
          ['🔍 Search', '+ ADD'] // Row1 with 2 buttons
        ])
          .oneTime()
          .resize()
          .extra()
      );
    });
    this.bot.startPolling();
  }

  public launch(): void {
    this.bot.launch();
  }
}
