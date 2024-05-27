import {
  CreateUser,
  HttpStatusCode,
  LoginUser,
  ServiceMethodResults,
  UpdateUser,
  UserEntity
} from "@app/lib-shared";
import {
  ContentTypes,
  RmqEventMessage
} from "rxjs-rabbitmq";
import * as bcrypt from 'bcrypt-nodejs';
import {
  create_user,
  delete_user_by_id,
  get_user_by_email,
  get_user_by_id,
  get_user_by_username,
  get_user_by_username_or_email,
  get_users_like_username,
  update_user_by_id
} from "./repos/users.repo";
import {
  MicroservicesErrorEventName,
  MicroservicesUsersEvents,
  USERS_EXCHANGE,
  generateJWT
} from "@app/lib-backend";



export async function USER_GET_BY_ID(rmqMessage: RmqEventMessage) {
  const id: number = rmqMessage.data.id;
  const userEntity: UserEntity = await get_user_by_id(id);

  rmqMessage.publishEvent({
    exchange: USERS_EXCHANGE.name,
    routingKey: MicroservicesUsersEvents.USER_FETCHED_BY_ID,
    data: userEntity,
    publishOptions: {
      type: MicroservicesUsersEvents.USER_FETCHED_BY_ID,
      contentType: ContentTypes.JSON,
    }
  });

  if (!!rmqMessage.message.properties.replyTo) {
    console.log(`Sending reply ---`);
    rmqMessage.sendMessage({
      queue: rmqMessage.message.properties.replyTo,
      data: userEntity,
      publishOptions: {
        type: MicroservicesUsersEvents.USER_FETCHED_BY_ID,
        contentType: ContentTypes.JSON,
        correlationId: rmqMessage.message.properties.correlationId
      }
    });
  }

  return rmqMessage.ack();
}

export async function USER_GET_BY_USERNAME(rmqMessage: RmqEventMessage) {
  const username: string = rmqMessage.data.username;
  const userEntity: UserEntity = await get_user_by_username(username);

  rmqMessage.publishEvent({
    exchange: USERS_EXCHANGE.name,
    routingKey: MicroservicesUsersEvents.USER_FETCHED_BY_USERNAME,
    data: userEntity,
    publishOptions: {
      type: MicroservicesUsersEvents.USER_FETCHED_BY_USERNAME,
      contentType: ContentTypes.JSON,
    }
  });

  if (!!rmqMessage.message.properties.replyTo) {
    console.log(`Sending reply ---`);
    rmqMessage.sendMessage({
      queue: rmqMessage.message.properties.replyTo,
      data: userEntity,
      publishOptions: {
        type: MicroservicesUsersEvents.USER_FETCHED_BY_ID,
        contentType: ContentTypes.JSON,
        correlationId: rmqMessage.message.properties.correlationId
      }
    });
  }

  return rmqMessage.ack();
}

export async function USER_GET_BY_EMAIL(rmqMessage: RmqEventMessage) {
  const email: string = rmqMessage.data.email;

  const userEntity: UserEntity = await get_user_by_email(email);

  rmqMessage.publishEvent({
    exchange: USERS_EXCHANGE.name,
    routingKey: MicroservicesUsersEvents.USER_FETCHED_BY_EMAIL,
    data: userEntity,
    publishOptions: {
      type: MicroservicesUsersEvents.USER_FETCHED_BY_EMAIL,
      contentType: ContentTypes.JSON,
    }
  });

  if (!!rmqMessage.message.properties.replyTo) {
    console.log(`Sending reply ---`);
    rmqMessage.sendMessage({
      queue: rmqMessage.message.properties.replyTo,
      data: userEntity,
      publishOptions: {
        type: MicroservicesUsersEvents.USER_FETCHED_BY_ID,
        contentType: ContentTypes.JSON,
        correlationId: rmqMessage.message.properties.correlationId
      }
    });
  }

  return rmqMessage.ack();
}

export async function USERS_GET_LIKE_USERNAME(rmqMessage: RmqEventMessage) {
  const query_term: string = rmqMessage.data.query_term;
  const userEntityList: UserEntity[] = await get_users_like_username(query_term);

  rmqMessage.publishEvent({
    exchange: USERS_EXCHANGE.name,
    routingKey: MicroservicesUsersEvents.USERS_FETCHED_LIKE_USERNAME,
    data: userEntityList,
    publishOptions: {
      type: MicroservicesUsersEvents.USERS_FETCHED_LIKE_USERNAME,
      contentType: ContentTypes.JSON,
    }
  });

  if (!!rmqMessage.message.properties.replyTo) {
    console.log(`Sending reply ---`);
    rmqMessage.sendMessage({
      queue: rmqMessage.message.properties.replyTo,
      data: userEntityList,
      publishOptions: {
        type: MicroservicesUsersEvents.USERS_FETCHED_LIKE_USERNAME,
        contentType: ContentTypes.JSON,
        correlationId: rmqMessage.message.properties.correlationId
      }
    });
  }

  return rmqMessage.ack();
}

export async function USER_AUTHENTICATE(rmqMessage: RmqEventMessage<LoginUser>) {
  const userEntity: UserEntity = await get_user_by_username_or_email(rmqMessage.data.email_or_username);

  if (!userEntity) {
    const results: ServiceMethodResults = {
      status: HttpStatusCode.NOT_FOUND,
      error: true,
      info: {
        message: `User not found by email or username = ${rmqMessage.data.email_or_username}`,
      }
    };
    rmqMessage.publishEvent({
      exchange: USERS_EXCHANGE.name,
      routingKey: MicroservicesErrorEventName,
      data: results,
      publishOptions: {
        type: MicroservicesErrorEventName,
        contentType: ContentTypes.JSON,
      }
    });
  
    if (!!rmqMessage.message.properties.replyTo) {
      console.log(`Sending reply ---`);
      rmqMessage.sendMessage({
        queue: rmqMessage.message.properties.replyTo,
        data: results,
        publishOptions: {
          type: MicroservicesErrorEventName,
          contentType: ContentTypes.JSON,
          correlationId: rmqMessage.message.properties.correlationId
        }
      });
    }

    return rmqMessage.ack();
  }

  const checkPassword = userEntity.password;
  const badPassword = bcrypt.compareSync(rmqMessage.data.password, checkPassword!) === false;

  if (badPassword) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.UNAUTHORIZED,
      error: true,
      info: {
        message: 'Invalid credentials.'
      }
    };
    
    rmqMessage.publishEvent({
      exchange: USERS_EXCHANGE.name,
      routingKey: MicroservicesErrorEventName,
      data: serviceMethodResults,
      publishOptions: {
        type: MicroservicesErrorEventName,
        contentType: ContentTypes.JSON,
      }
    });
  
    if (!!rmqMessage.message.properties.replyTo) {
      console.log(`Sending reply ---`);
      rmqMessage.sendMessage({
        queue: rmqMessage.message.properties.replyTo,
        data: serviceMethodResults,
        publishOptions: {
          type: MicroservicesErrorEventName,
          contentType: ContentTypes.JSON,
          correlationId: rmqMessage.message.properties.correlationId
        }
      });
    }

    return rmqMessage.ack();
  }

  delete userEntity.password;

  const jwt: string = generateJWT(userEntity);

  rmqMessage.publishEvent({
    exchange: USERS_EXCHANGE.name,
    routingKey: MicroservicesUsersEvents.USER_AUTHENTICATED,
    data: { jwt },
    publishOptions: {
      type: MicroservicesUsersEvents.USER_AUTHENTICATED,
      contentType: ContentTypes.JSON,
    }
  });

  if (!!rmqMessage.message.properties.replyTo) {
    console.log(`Sending reply ---`);
    rmqMessage.sendMessage({
      queue: rmqMessage.message.properties.replyTo,
      data: { jwt },
      publishOptions: {
        type: MicroservicesUsersEvents.USER_AUTHENTICATED,
        contentType: ContentTypes.JSON,
        correlationId: rmqMessage.message.properties.correlationId
      }
    });
  }

  return rmqMessage.ack();
}

export async function USER_CREATE(rmqMessage: RmqEventMessage<CreateUser>) {
  const params: CreateUser = rmqMessage.data;

  const check_email = await get_user_by_email(params.email);
  if (check_email) {
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.BAD_REQUEST,
      error: true,
      info: {
        message: 'Email already in use'
      }
    };
    
    rmqMessage.publishEvent({
      exchange: USERS_EXCHANGE.name,
      routingKey: MicroservicesErrorEventName,
      data: serviceMethodResults,
      publishOptions: {
        type: MicroservicesErrorEventName,
        contentType: ContentTypes.JSON,
      }
    });
  
    if (!!rmqMessage.message.properties.replyTo) {
      console.log(`Sending reply ---`);
      rmqMessage.sendMessage({
        queue: rmqMessage.message.properties.replyTo,
        data: serviceMethodResults,
        publishOptions: {
          type: MicroservicesErrorEventName,
          contentType: ContentTypes.JSON,
          correlationId: rmqMessage.message.properties.correlationId
        }
      });
    }
  }

  const hash = bcrypt.hashSync(params.password);

  const userEntity: UserEntity = await create_user({
    email: params.email,
    password: hash,
  });

  rmqMessage.publishEvent({
    exchange: USERS_EXCHANGE.name,
    routingKey: MicroservicesUsersEvents.USER_CREATED,
    data: userEntity,
    publishOptions: {
      type: MicroservicesUsersEvents.USER_CREATED,
      contentType: ContentTypes.JSON,
    }
  });

  if (!!rmqMessage.message.properties.replyTo) {
    console.log(`Sending reply ---`);
    rmqMessage.sendMessage({
      queue: rmqMessage.message.properties.replyTo,
      data: userEntity,
      publishOptions: {
        type: MicroservicesUsersEvents.USER_CREATED,
        contentType: ContentTypes.JSON,
        correlationId: rmqMessage.message.properties.correlationId
      }
    });
  }

  return rmqMessage.ack();
}

export async function USER_UPDATE(rmqMessage: RmqEventMessage<{ id: number, updates: UpdateUser }>) {
  const userEntityUpdates = await update_user_by_id(rmqMessage.data.id, rmqMessage.data.updates);
  const userEntity: UserEntity = userEntityUpdates.model;

  rmqMessage.publishEvent({
    exchange: USERS_EXCHANGE.name,
    routingKey: MicroservicesUsersEvents.USER_UPDATED,
    data: userEntity,
    publishOptions: {
      type: MicroservicesUsersEvents.USER_UPDATED,
      contentType: ContentTypes.JSON,
    }
  });

  if (!!rmqMessage.message.properties.replyTo) {
    console.log(`Sending reply ---`);
    rmqMessage.sendMessage({
      queue: rmqMessage.message.properties.replyTo,
      data: userEntity,
      publishOptions: {
        type: MicroservicesUsersEvents.USER_UPDATED,
        contentType: ContentTypes.JSON,
        correlationId: rmqMessage.message.properties.correlationId
      }
    });
  }

  return rmqMessage.ack();
}

export async function USER_DELETE(rmqMessage: RmqEventMessage) {
  const id: number = rmqMessage.data.id;
  const deletes = await delete_user_by_id(id);

  rmqMessage.publishEvent({
    exchange: USERS_EXCHANGE.name,
    routingKey: MicroservicesUsersEvents.USER_DELETED,
    data: deletes,
    publishOptions: {
      type: MicroservicesUsersEvents.USER_DELETED,
      contentType: ContentTypes.JSON,
    }
  });

  if (!!rmqMessage.message.properties.replyTo) {
    console.log(`Sending reply ---`);
    rmqMessage.sendMessage({
      queue: rmqMessage.message.properties.replyTo,
      data: deletes,
      publishOptions: {
        type: MicroservicesUsersEvents.USER_DELETED,
        contentType: ContentTypes.JSON,
        correlationId: rmqMessage.message.properties.correlationId
      }
    });
  }

  return rmqMessage.ack();
}