import {
  fn,
  Op,
  WhereOptions
} from 'sequelize';
import { UsersEmailVerifications, IMyModel } from '../app.models';
import {
  UsersEmailVerificationEntity
} from '@app/lib-shared';




export async function create_email_verification(
  params: {
    user_id: number;
    email: string;
  }
) {
  const new_model = await UsersEmailVerifications.create(params).then((model: IMyModel) => model.toJSON<UsersEmailVerificationEntity>());
  return new_model;
}

export async function query_email_verification(
  whereClause: WhereOptions
) {
  try {
    const model = await UsersEmailVerifications.findOne({ where: whereClause });
    return !model ? null : model.toJSON() as UsersEmailVerificationEntity;
  }
  catch (e) {
    console.log({
      errorMessage: `query_email_verf error - `,
      e,
      whereClause
    });
    throw e;
  }
}

export async function delete_email_verification(
  whereClause: WhereOptions
) {
  try {
    const model_updates = await UsersEmailVerifications.destroy({ where: whereClause });
    return model_updates;
  } catch (e) {
    console.log({
      errorMessage: `delete_email_verification error - `,
      e,
      whereClause
    });
    throw e;
  }
}

export async function update_email_verification(
  newState: Partial<{
    user_id: number;
    email: string;
    verification_code: string;
    verified: boolean;
  }>,
  whereClause: WhereOptions
) {
  try {
    const user_model_update = await UsersEmailVerifications.update(
      newState,
      { where: whereClause }
    );
    return user_model_update;
  }
  catch (e) {
    console.log({
      errorMessage: `update_email_verf error - `,
      e,
      newState,
      whereClause
    });
    throw e;
  }
}