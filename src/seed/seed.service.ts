import { Injectable } from '@nestjs/common';


@Injectable()
export class SeedService {
  
  public executeSeed() {
    return `Seed Execute`
  }
}
