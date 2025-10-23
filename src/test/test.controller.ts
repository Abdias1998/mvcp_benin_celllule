import { Controller, Get } from '@nestjs/common';
import axios from 'axios';

@Controller('test-ip')
export class TestController {
  @Get()
  async getIp() {
    const res = await axios.get('https://api.ipify.org?format=json');
    return res.data; // { ip: "44.xxx.xxx.xxx" }
  }
}
