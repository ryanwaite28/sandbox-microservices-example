import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RMQ_PROVIDER } from './rmq.client';
import { UsersController } from './users/users.controller';
import { BlogController } from './blog/blog.controller';
import { UsersService } from './users/users.service';
import { BlogService } from './blog/blog.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    UsersController,
    BlogController,
  ],
  providers: [
    RMQ_PROVIDER,
    AppService,
    UsersService,
    BlogService,
  ],
})
export class AppModule {}
