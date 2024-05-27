import { CreateUser, UserEntity } from "@app/lib-shared";
import { fn, Op, WhereOptions } from "sequelize";
import { Users, UserExpoDevices } from "../app.models";
import { sequelize_model_class_crud_to_entity_class, user_attrs_slim } from "@app/lib-backend";






const users_crud = sequelize_model_class_crud_to_entity_class<UserEntity>(Users);






export function get_user_by_where(
  whereClause: WhereOptions
) {
  return users_crud.findOne({
    where: whereClause,
    attributes: user_attrs_slim
  });
}

export function get_users_by_where(
  whereClause: WhereOptions
) {
  return users_crud.findAll({
    where: whereClause,
    attributes: user_attrs_slim
  });
}

export function get_users_like_username(query_term: string) {
  return users_crud.findAll({
    where: {
      username: { [Op.iLike]: query_term }
    },
    limit: 10,
  });
}

export function get_user_by_username_or_email(email_or_username: string) {
  return users_crud.findOne({
    where: {
      [Op.or]: [
        { email: email_or_username },
        { username: email_or_username }
      ]
    }
  });
}

export async function create_user(params: CreateUser) {
  const new_user_model = await users_crud.create(params);
  const user = await get_user_by_id(new_user_model.id);
  return user!;
}

export async function get_random_users(
  limit: number
) {
  const users = await users_crud.findAll({
    limit,
    order: [fn( 'RANDOM' )],
    include: [{
      model: UserExpoDevices,
      as: `expo_devices`,
    }],
    attributes: [
      'id',
      'firstname',
      'lastname',
      'username',
      'icon_link',
      'uuid',
      'created_at',
      'updated_at',
      'deleted_at',
    ]
  })
  return users;
}

export async function get_user_by_phone(
  phone: string
) {
  try {
    const userModel = await users_crud.findOne({
      where: { phone },
      attributes: user_attrs_slim,
      include: [{
        model: UserExpoDevices,
        as: `expo_devices`,
      }],
    });
    return userModel;
  } catch (e) {
    console.log(`get_user_by_phone error - `, e);
    return null;
  }
}

export function update_user_by_id(id: number, updatesObj: any) {
  return users_crud.updateById(id, updatesObj);
}

export function delete_user_by_id(id: number) {
  return users_crud.deleteById(id);
}

export async function get_user_by_temp_phone(
  temp_phone: string
) {
  try {
    const userModel = await users_crud.findOne({
      where: { temp_phone },
      attributes: user_attrs_slim,
      include: [{
        model: UserExpoDevices,
        as: `expo_devices`,
      }],
    })
    return userModel;
  } catch (e) {
    console.log(`get_user_by_temp_phone error - `, e);
    return null;
  }
}



export async function get_user_by_id(id: number) {
  console.log(`get_user_by_id:`, { id });
  const user_model = await users_crud.findOne({
    where: { id },
    // include: [{
    //   model: UserExpoDevices,
    //   as: `expo_devices`,
    // }],
    attributes: user_attrs_slim,
  })
  return user_model;
}

export async function get_user_by_email(email: string) {
  console.log(`get_user_by_email:`, { email });
  const user_model = await users_crud.findOne({
    where: { email },
    // include: [{
    //   model: UserExpoDevices,
    //   as: `expo_devices`,
    // }],
    attributes: user_attrs_slim,
  })
  return user_model;
}

export async function get_user_by_stripe_customer_account_id(stripe_customer_account_id: string) {
  const user_model = await users_crud.findOne({
    where: { stripe_customer_account_id },
    include: [{
      model: UserExpoDevices,
      as: `expo_devices`,
    }],
    attributes: user_attrs_slim
  })
  .catch((err) => {
    console.log(`could not get user by stripe_customer_account_id`, { stripe_customer_account_id }, err);
    throw err;
  })
  return user_model;
}

export async function get_user_by_stripe_connected_account_id(stripe_account_id: string) {
  const user_model = await users_crud.findOne({
    where: { stripe_account_id },
    include: [{
      model: UserExpoDevices,
      as: `expo_devices`,
    }],
    attributes: user_attrs_slim
  })
  .catch((err) => {
    console.log(`could not get user by stripe_account_id`, { stripe_account_id }, err);
    throw err;
  })
  return user_model;
}

export async function get_user_by_username(
  username: string
) {
  const user_model = await users_crud.findOne({
    where: { username },
    attributes: user_attrs_slim,
    // include: [{
    //   model: UserExpoDevices,
    //   as: `expo_devices`,
    // }],
  })
  return user_model;
}

export async function get_user_by_uuid(
  uuid: string
) {
  try {
    const user_model = await users_crud.findOne({
      where: { uuid },
      attributes: user_attrs_slim,
      // include: [{
      //   model: UserExpoDevices,
      //   as: `expo_devices`,
      // }],
    })
    return user_model;
  } catch (e) {
    console.log({
      errorMessage: `get_user_by_uuid error - `,
      e,
      uuid
    });
    return null;
  }
}

export async function update_user(
  newState: Partial<{
    email: string;
    paypal: string;
    username: string;
    phone: string | null;
    temp_phone: string | null;
    bio: string;
    location: string;
    password: string;
    icon_link: string;
    icon_id: string;
    wallpaper_link: string;
    wallpaper_id: string;
    email_verified: boolean;
    phone_verified: boolean;
    stripe_account_verified: boolean;
    stripe_account_id: string;
    stripe_customer_account_id: string;
    platform_subscription_id: string,
  }>,
  whereClause: WhereOptions
) {
  try {
    const user_model_update = await users_crud.update(
      newState as any,
      { where: whereClause }
    );
    return user_model_update;
  } catch (e) {
    console.log({
      errorMessage: `update_user error - `,
      e,
      newState,
      whereClause
    });
    throw e;
  }
}
