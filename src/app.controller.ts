import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Body() body: { message: string }): Promise<string> {
    const BOT_TOKEN = '7869955028:AAEeC5z0EMcJAQEHsBa8yp784yK_OnuDvgM';
    const CHAT_ID = '1177958583';

    await axios
      .post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: body.message,
      })
      .then((res) => res.data)
      .then((data) => {
      })
      .catch((err) => {
        console.error('Error sending message:', err);
      });

    return this.appService.getHello();
  }
}
