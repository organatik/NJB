import Telegraf, { Markup } from 'telegraf';
import { Injectable } from '@nestjs/common';
import Scene = require('telegraf/scenes/base');
import Stage = require('telegraf/stage');
import { session } from 'telegraf';
import { TelegramTransportService } from './telegram-transport.service';

@Injectable()
export class TelegramService {
  private bot: Telegraf<any>;

  constructor(private transportServise: TelegramTransportService) {
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
          ['Search', '+ ADD', 'MainMenu'], // Row1 with 2 buttons
        ])
          .oneTime()
          .resize()
          .extra(),
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

    addScene.hears('MainMenu', leave());
    addScene.on('message', (ctx) => {
      let result;
      result = ctx.message.text.split('#');
      const name = result[0];
      const identificator = result[1].split('.');
      console.log(name, identificator);
      if (result.length !== 2) {
        ctx.reply('Enter like this format Companyname#12345');
      } else {
        ctx.reply(`Your company name is <b>${name}</b>`);
        ctx.reply(`Your company number is ${identificator}`);
        this.transportServise
          .addCompany({
            name,
            identificator,
          })
          .then(() => {
            ctx.reply('Company has been added');
          })
          .catch((errorr) => {
            ctx.reply(`Company has NOT been added. Reason${errorr}`);
          });
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
          ['Search', '+ ADD', 'MainMenu'], // Row1 with 2 buttons
        ])
          .oneTime()
          .resize()
          .extra(),
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
          .extra(),
      );
    });

    this.bot.hears('+ ADD', (ctx) => {
      ctx.scene.enter('AddScene');
    });
    this.bot.hears('MainMenu', (ctx) => {
      return ctx.reply(
        'Выберите тип действия',
        Markup.keyboard([
          ['🔍 Search', '+ ADD', 'MainMenu'], // Row1 with 2 buttons
        ])
          .oneTime()
          .resize()
          .extra(),
      );
    });
    this.bot.startPolling();
  }

  public launch(): void {
    this.bot.launch();
  }
}
