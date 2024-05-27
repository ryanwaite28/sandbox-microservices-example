import {
  fn,
  col,
  Op,
  WhereOptions,
  FindOptions,
  Includeable,
  Model,
  FindAttributeOptions,
  GroupOption,
  Order
} from 'sequelize';
import { convertModels, convertModel, convertModelCurry } from '../utils/helpers.utils';
import { PlainObject } from '@app/lib-shared';
import { IPaginateModelsOptions, IRandomModelsOptions } from '../interface/common.interface';
import { MyModelStatic, IMyModel, MyModelStaticGeneric } from '../interface/sequelize.interface';



export async function paginateTable(model: MyModelStatic, options: IPaginateModelsOptions)  {
  const { user_id_field, user_id, min_id, include, attributes, group, whereClause, orderBy } = options;

  const useWhereClause: WhereOptions = <PlainObject> (!min_id
    ? { [user_id_field]: user_id }
    : { [user_id_field]: user_id, id: { [Op.lt]: min_id } }
  );
  if (whereClause) {
    Object.assign(useWhereClause, whereClause);
  }

  console.log(whereClause, { useWhereClause });

  const models: (Model | IMyModel)[] = await model.findAll({
    attributes,
    group,
    where: useWhereClause,
    include: include || [],
    limit: 5,
    order: orderBy || [['id', 'DESC']]
  });

  return models;
}

export async function getCount(
  model: MyModelStatic | Model,
  user_id_field: string,
  user_id: number,
  group?: GroupOption,
  whereClause?: WhereOptions,
)  {
  // const models = await model.findAll<Model<T>>({
  const useWhereClause = whereClause
    ? { ...whereClause, [user_id_field]: user_id }
    : { [user_id_field]: user_id };

  const models = await (model as MyModelStatic).count({
    group,
    where: useWhereClause,
  });

  return models;
}

export async function getAll(
  model: MyModelStatic | Model<any, any>,
  user_id_field: string,
  user_id: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
  whereClause?: WhereOptions,
  orderBy?: Order
)  {
  // const models = await model.findAll<Model<T>>({
  const useWhereClause = whereClause
    ? { ...whereClause, [user_id_field]: user_id }
    : { [user_id_field]: user_id };

  if (whereClause) {
    Object.assign(useWhereClause, whereClause);
  }
  console.log(whereClause, { useWhereClause });

  const models = await (model as MyModelStatic).findAll({
    attributes,
    group,
    where: useWhereClause,
    include: include || [],
    order: orderBy || [['id', 'DESC']]
  });

  return models;
}

export async function getById<T>(
  model: MyModelStatic | Model<any, any>,
  id: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
  whereClause?: WhereOptions,
)  {
  // const result = await model.findOne<Model<T>>({
  const useWhereClause = whereClause
    ? { ...whereClause, id }
    : { id };

  console.log(whereClause, { useWhereClause });

  const result = await (model as MyModelStatic).findOne({
    attributes,
    group,
    where: useWhereClause,
    include: include || [],
  });

  return result;
}

export async function getRandomModels<T>(model: MyModelStatic, params: IRandomModelsOptions) {
  const { limit, include, attributes, group } = params;

  try {
    const results = await (<any> model).findAll({
      limit: limit || 10,
      order: [fn( 'RANDOM' )],
      attributes,
      group,
      include,
    });

    return results;
  } 
  catch (e) {
    console.log(`get_random_models error - `, e);
    return null;
  }
}

export function get_recent_models<T = any>(
  model: MyModelStatic,
  whereClause: WhereOptions = {},
) {
  return model.findAll({
    where: whereClause,
    order: [['id', 'DESC']],
    limit: 20,
  })
  .then((models: Model[]) => {
    return convertModels<T>(<IMyModel[]> models);
  });
}





// converted

export async function paginateTableConverted<T>(
  model: MyModelStatic | Model<any, any>,
  user_id_field: string,
  user_id?: number,
  min_id?: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
  whereClause?: WhereOptions,
  orderBy?: Order
)  {
  const useWhereClause: WhereOptions = <PlainObject> (!min_id
    ? { [user_id_field]: user_id }
    : { [user_id_field]: user_id, id: { [Op.lt]: min_id } }
  );
  if (whereClause) {
    Object.assign(useWhereClause, whereClause);
  }

  console.log(whereClause, { useWhereClause });

  const models = await (model as MyModelStatic).findAll({
    attributes,
    group,
    where: useWhereClause,
    include: include || [],
    limit: 5,
    order: orderBy || [['id', 'DESC']]
  })
  .then((models: IMyModel[]) => {
    return convertModels<T>(models);
  });

  return models;
}

export async function getAllConverted<T>(
  model: MyModelStatic | Model<any, any>,
  user_id_field: string,
  user_id: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
  whereClause?: WhereOptions,
  orderBy?: Order
)  {
  // const models = await model.findAll<Model<T>>({
  const useWhereClause = whereClause
    ? { ...whereClause, [user_id_field]: user_id }
    : { [user_id_field]: user_id };

  if (whereClause) {
    Object.assign(useWhereClause, whereClause);
  }
  console.log(whereClause, { useWhereClause });

  const models = await (model as MyModelStatic).findAll({
    attributes,
    group,
    where: useWhereClause,
    include: include || [],
    order: orderBy || [['id', 'DESC']]
  });

  return models;
}

export async function getByIdConverted<T>(
  model: MyModelStatic | Model,
  id: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
  whereClause?: WhereOptions,
)  {
  // const result = await model.findOne<Model<T>>({
  const useWhereClause = whereClause
    ? { ...whereClause, id }
    : { id };

  console.log(whereClause, { useWhereClause });

  const result = await (model as MyModelStatic).findOne({
    attributes,
    group,
    where: useWhereClause,
    include: include || [],
  })
  .then((model: IMyModel | null) => {
    return convertModel<T>(model);
  });

  return result;
}

export async function getRandomModelsConverted<T>(
  model: MyModelStaticGeneric<T> | Model,
  limit: number,
  include?: Includeable[],
  attributes?: FindAttributeOptions,
  group?: GroupOption,
) {
  try {
    const results = await (<any> model).findAll({
      limit,
      order: [fn( 'RANDOM' )],
      attributes,
      group,
      include,
    })
    .then((models: IMyModel[]) => {
      return convertModels<T>(models);
    });

    return results;
  } 
  catch (e) {
    console.log(`get_random_models error - `, e);
    return null;
  }
}

export function get_recent_models_converted<T>(
  model: MyModelStatic | Model,
  whereClause: WhereOptions = {},
) {
  return (model as MyModelStatic).findAll({
    where: whereClause,
    order: [['id', 'DESC']],
    limit: 20,
  })
  .then((models) => {
    return convertModels<T>(<IMyModel[]> models);
  });
}




// export async function get_user_ratings_stats_via_model(ratingsModel: MyModelStatic, id: number): Promise<{
//   user_ratings_info: IModelRating | null,
//   writer_ratings_info: IModelRating | null,
// }> {
//   const user_ratings_info = await ratingsModel.findOne({
//     where: { user_id: id },
//     attributes: [
//       [fn('AVG', col('rating')), 'ratingsAvg'],
//       [fn('COUNT', col('rating')), 'ratingsCount'],
//     ],
//     group: ['user_id'],
//   })
//   .then((model: IMyModel | null) => {
//     return convertModel<IModelRating>(model);
//   });

//   const writer_ratings_info = await ratingsModel.findOne({
//     where: { writer_id: id },
//     attributes: [
//       [fn('AVG', col('rating')), 'ratingsAvg'],
//       [fn('COUNT', col('rating')), 'ratingsCount'],
//     ],
//     group: ['writer_id'],
//   })
//   .then((model: IMyModel | null) => {
//     return convertModel<IModelRating>(model)!;
//   });

//   return {
//     user_ratings_info,
//     writer_ratings_info,
//   }
// }


// export async function get_user_notification_last_opened(user_id: number) {
//   const converter = convertModelCurry<UserNotificationsLastOpenedEntity>();
//   let data = await UserNotificationsLastOpened.findOne({ where: { user_id } }).then(converter);

//   if (!data) {
//     data = await UserNotificationsLastOpened.create({ user_id }).then(converter);
//   }

//   console.log(data);

//   return data!;
// }

// export async function update_user_notification_last_opened(user_id: number) {
//   const converter = convertModelCurry<UserNotificationsLastOpenedEntity>();
//   let data = await UserNotificationsLastOpened.update({ notifications_last_opened: fn('NOW') }, { returning: true, where: { user_id } }).then(updates => {
//     console.log({ user_id, updates });
//     const i = converter(updates[1] && updates[1][0]);
//     return i;
//   });
  
//   return data!;
// }
