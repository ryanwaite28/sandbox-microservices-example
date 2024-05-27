import { Controller, Get, Post, Put, Delete, Query, Body, Param, ParseIntPipe } from '@nestjs/common';

import { UsersService } from './users.service';
import { rmqClient } from '../rmq.client';
import { ControllerServiceResultsHandler, CreateUserDto, JwtPayloadSlim, MicroservicesQueues, MicroservicesStorageRequests, MicroservicesUsersRequests, UpdateUserDto, ValidationPipe } from '@app/lib-backend';
import { IAuthJwtResults, MediaObject } from '@app/lib-shared';
import { ContentTypes, RmqEventMessage } from 'rxjs-rabbitmq';



@Controller('users')
export class UsersController {

  constructor(
    private readonly userService: UsersService
  ) {}

  @Get('/check-session')
  check_session(@JwtPayloadSlim() auth: IAuthJwtResults) {
    // return UsersService.check_session(auth).then(ControllerServiceResultsHandler);
  }

  @Get(`id/:id`)
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.Users.USER_GET_BY_ID,
      data: { id },
      publishOptions: {
        type: MicroservicesUsersRequests.USER_GET_BY_ID,
        contentType: ContentTypes.JSON,
      }
    })
    .then((rmqMessage: RmqEventMessage<MediaObject>) => {
      return { data: rmqMessage.data };
    });
  }

  @Get(`username/:query_term`)
  getUsersLikeUsername(@Param('query_term') query_term: string) {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.Users.USERS_GET_LIKE_USERNAME,
      data: { query_term },
      publishOptions: {
        type: MicroservicesUsersRequests.USERS_GET_LIKE_USERNAME,
        contentType: ContentTypes.JSON,
      }
    })
    .then((rmqMessage: RmqEventMessage<MediaObject>) => {
      return { data: rmqMessage.data };
    });
  }

  @Post('/')
  createUser(@Body(new ValidationPipe()) dto: CreateUserDto) {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.Users.USER_CREATE,
      data: dto,
      publishOptions: {
        type: MicroservicesUsersRequests.USER_CREATE,
        contentType: ContentTypes.JSON,
      }
    })
    .then((rmqMessage: RmqEventMessage<MediaObject>) => {
      return { data: rmqMessage.data };
    });
  }

  @Put('/')
  loginUser(@Body(new ValidationPipe()) dto: UpdateUserDto) {
    
  }

  @Put(`id/:id`)
  updateUser(@Param('id', ParseIntPipe) id: number) {
    return rmqClient.sendRequest({
      queue: MicroservicesQueues.Users.USER_GET_BY_ID,
      data: { id },
      publishOptions: {
        type: MicroservicesUsersRequests.USER_GET_BY_ID,
        contentType: ContentTypes.JSON,
      }
    })
    .then((rmqMessage: RmqEventMessage<MediaObject>) => {
      return { data: rmqMessage.data };
    });
  }

}
