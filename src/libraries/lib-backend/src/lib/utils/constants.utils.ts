export const specialCaracters = ['!', '@', '#', '$', '%', '&', '+', ')', ']', '}', ':', ';', '?'];
export const codeCharacters = ['!', '@', '#', '$', '%', '&', '|', '*', ':', '-', '_', '+'];
export const allowedImages = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG'];
export const isAppEnvSet: boolean = ('APP_ENV' in process.env);
export const isDevEnv: boolean = isAppEnvSet && process.env.APP_ENV === "DEV";
export const isLocal: boolean = isAppEnvSet && process.env.APP_ENV === "LOCAL";
export const isProd: boolean = isAppEnvSet && process.env.APP_ENV === "PROD";
export const URL_REGEX = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
export const BASE64_REGEX = /^data:([A-Za-z-+\/]+);base64,(.+)$/;

// console.log({
//   isAppEnvSet,
//   isDevEnv,
//   isProd,
//   USE_CLIENT_DOMAIN_URL
// });




import { CorsOptions } from "cors";
import cors from 'cors';
import { genericTextValidator, stripeValidators, numberValidator, booleanValidator, validatePersonName, phoneValidator, validateEmail } from "./validators.utils";
import { AppEnvironment } from "./app.enviornment";
import { NextFunction, Request, Response } from "express";
import { IModelValidator, cities_map, countries_by_name_map, states_map, zipcodes_map } from "@app/lib-shared";


export const user_attrs_slim = [
  'id',
  'uuid',
  'metadata',
  'created_at',
  'updated_at',
  'deleted_at',
  'username',
  'displayname',
  'email',
  'phone',
  'bio',
];



export const sizes = ["X-SMALL", "SMALL", "MEDIUM", "LARGE", "X-LARGE"];

const payout_min = 3;

export const create_delivery_required_props: IModelValidator[] = [
  { field: "title", name: "Title", validator: genericTextValidator },
  {
    field: "description",
    name: "Description",
    validator: genericTextValidator,
  },
  {
    field: "payment_method_id",
    name: "Payment Method Id",
    validator: stripeValidators.paymentMethodId,
  },
  { field: "size", name: "Size", validator: (arg: any) => sizes.includes(arg) },
  { field: "weight", name: "Weight", validator: numberValidator },
  {
    field: "distance_miles",
    name: "Distance (Miles)",
    validator: numberValidator,
  },
  {
    field: "payout",
    name: "Payout",
    validator: (arg) => numberValidator(arg) && arg > payout_min,
  },
  { field: "penalty", name: "Penalty", validator: numberValidator },
  {
    field: "auto_accept_anyone",
    name: "Auto-Accept Anyone",
    validator: booleanValidator,
  },
  { field: "urgent", name: "Urgent", validator: booleanValidator },

  {
    field: "from_location",
    name: "From Location",
    validator: genericTextValidator,
  },
  {
    field: "from_address",
    name: "From Address",
    validator: genericTextValidator,
  },
  {
    field: "from_street",
    name: "From Street",
    validator: (arg) => /^[a-zA-Z0-9\s]+$/.test(arg),
  },
  {
    field: "from_city",
    name: "From City",
    validator: (arg) => cities_map.has(arg),
  },
  {
    field: "from_state",
    name: "From State",
    validator: (arg) => states_map.has(arg),
  },
  {
    field: "from_zipcode",
    name: "From Zipcode",
    validator: (arg) => !!arg && zipcodes_map.has(arg.toString()),
  },
  {
    field: "from_country",
    name: "From Country",
    validator: (arg) => countries_by_name_map.has(arg && arg.toLowerCase()),
  },
  {
    field: "from_place_id",
    name: "From Place ID",
    validator: genericTextValidator,
  },
  { field: "from_lat", name: "From Latitude", validator: numberValidator },
  { field: "from_lng", name: "From Longitude", validator: numberValidator },

  { field: "from_person", name: "From Person", validator: validatePersonName },
  {
    field: "from_person_phone",
    name: "From Person Phone",
    validator: (arg: any) => arg === "" || phoneValidator(arg),
  },
  {
    field: "from_person_email",
    name: "From Person Email",
    validator: (arg: any) => arg === "" || validateEmail(arg),
  },
  {
    field: "from_person_id_required",
    name: "From Person ID Required",
    validator: booleanValidator,
  },
  {
    field: "from_person_sig_required",
    name: "From Person Signature Required",
    validator: booleanValidator,
  },

  {
    field: "to_location",
    name: "To Location",
    validator: genericTextValidator,
  },
  { field: "to_address", name: "To Address", validator: genericTextValidator },
  {
    field: "to_street",
    name: "To Street",
    validator: (arg) => /^[a-zA-Z0-9\s]+$/.test(arg),
  },
  {
    field: "to_city",
    name: "To City",
    validator: (arg) => cities_map.has(arg),
  },
  {
    field: "to_state",
    name: "To State",
    validator: (arg) => states_map.has(arg),
  },
  {
    field: "to_zipcode",
    name: "To Zipcode",
    validator: (arg) => !!arg && zipcodes_map.has(arg.toString()),
  },
  {
    field: "to_country",
    name: "To Country",
    validator: (arg) => countries_by_name_map.has(arg && arg.toLowerCase()),
  },
  {
    field: "to_place_id",
    name: "To Place ID",
    validator: genericTextValidator,
  },
  { field: "to_lat", name: "To Latitude", validator: numberValidator },
  { field: "to_lng", name: "To Longitude", validator: numberValidator },

  { field: "to_person", name: "To Person", validator: validatePersonName },
  {
    field: "to_person_phone",
    name: "To Person Phone",
    validator: (arg: any) => arg === "" || phoneValidator(arg),
  },
  {
    field: "to_person_email",
    name: "To Person Email",
    validator: (arg: any) => arg === "" || validateEmail(arg),
  },
  {
    field: "to_person_id_required",
    name: "To Person ID Required",
    validator: booleanValidator,
  },
  {
    field: "to_person_sig_required",
    name: "To Person Signature Required",
    validator: booleanValidator,
  },
];

export const update_delivery_required_props: IModelValidator[] = [
  { field: "title", name: "Title", validator: genericTextValidator },
  {
    field: "description",
    name: "Description",
    validator: genericTextValidator,
  },
  { field: "size", name: "Size", validator: (arg: any) => sizes.includes(arg) },
  { field: "weight", name: "Weight", validator: numberValidator },
  {
    field: "distance_miles",
    name: "Distance (Miles)",
    validator: numberValidator,
  },
  {
    field: "auto_accept_anyone",
    name: "Auto-Accept Anyone",
    validator: booleanValidator,
  },
  { field: "urgent", name: "Urgent", validator: booleanValidator },
  {
    field: "payout",
    name: "Payout",
    validator: (arg) => numberValidator(arg) && arg > payout_min,
  },
  { field: "penalty", name: "Penalty", validator: numberValidator },

  {
    field: "from_location",
    name: "From Location",
    validator: genericTextValidator,
  },
  {
    field: "from_address",
    name: "From Address",
    validator: genericTextValidator,
  },
  {
    field: "from_street",
    name: "From Street",
    validator: (arg) => /^[a-zA-Z0-9\s]+$/.test(arg),
  },
  {
    field: "from_city",
    name: "From City",
    validator: (arg) => cities_map.has(arg),
  },
  {
    field: "from_state",
    name: "From State",
    validator: (arg) => states_map.has(arg),
  },
  {
    field: "from_zipcode",
    name: "From Zipcode",
    validator: (arg) => !!arg && zipcodes_map.has(arg.toString()),
  },
  {
    field: "from_country",
    name: "From Country",
    validator: (arg) => countries_by_name_map.has(arg && arg.toLowerCase()),
  },
  {
    field: "from_place_id",
    name: "From Place ID",
    validator: genericTextValidator,
  },
  { field: "from_lat", name: "From Latitude", validator: numberValidator },
  { field: "from_lng", name: "From Longitude", validator: numberValidator },
  { field: "from_person", name: "From Person", validator: validatePersonName },
  {
    field: "from_person_phone",
    name: "From Person Phone",
    validator: (arg: any) => arg === "" || phoneValidator(arg),
  },
  {
    field: "from_person_email",
    name: "From Person Email",
    validator: (arg: any) => arg === "" || validateEmail(arg),
  },
  {
    field: "from_person_id_required",
    name: "From Person ID Required",
    validator: booleanValidator,
  },
  {
    field: "from_person_sig_required",
    name: "From Person Signature Required",
    validator: booleanValidator,
  },

  {
    field: "to_location",
    name: "To Location",
    validator: genericTextValidator,
  },
  { field: "to_address", name: "To Address", validator: genericTextValidator },
  {
    field: "to_street",
    name: "To Street",
    validator: (arg) => /^[a-zA-Z0-9\s]+$/.test(arg),
  },
  {
    field: "to_city",
    name: "To City",
    validator: (arg) => cities_map.has(arg),
  },
  {
    field: "to_state",
    name: "To State",
    validator: (arg) => states_map.has(arg),
  },
  {
    field: "to_zipcode",
    name: "To Zipcode",
    validator: (arg) => !!arg && zipcodes_map.has(arg.toString()),
  },
  {
    field: "to_country",
    name: "To Country",
    validator: (arg) => countries_by_name_map.has(arg && arg.toLowerCase()),
  },
  {
    field: "to_place_id",
    name: "To Place ID",
    validator: genericTextValidator,
  },
  { field: "to_lat", name: "To Latitude", validator: numberValidator },
  { field: "to_lng", name: "To Longitude", validator: numberValidator },
  { field: "to_person", name: "To Person", validator: validatePersonName },
  {
    field: "to_person_phone",
    name: "To Person Phone",
    validator: (arg: any) => arg === "" || phoneValidator(arg),
  },
  {
    field: "to_person_email",
    name: "To Person Email",
    validator: (arg: any) => arg === "" || validateEmail(arg),
  },
  {
    field: "to_person_id_required",
    name: "To Person ID Required",
    validator: booleanValidator,
  },
  {
    field: "to_person_sig_required",
    name: "To Person Signature Required",
    validator: booleanValidator,
  },
];

export const create_delivery_tracking_update_required_props: IModelValidator[] =
  [
    { field: "message", name: "Message", validator: genericTextValidator },
    {
      field: "location",
      optional: true,
      name: "Location",
      validator: genericTextValidator,
    },
    {
      field: "carrier_lat",
      name: "Carrier's Latitude",
      validator: numberValidator,
    },
    {
      field: "carrier_lng",
      name: "Carrier's Longitude",
      validator: numberValidator,
    },
  ];

export const deliveryme_user_settings_required_props: {
  field: string;
  name: string;
  validator: (arg: any) => boolean;
}[] = [
  {
    field: "phone",
    name: "Phone",
    validator: (arg: any) => arg === "" || phoneValidator(arg),
  },
  {
    field: "email",
    name: "Email",
    validator: (arg: any) => arg === "" || validateEmail(arg),
  },
  {
    field: "cashapp_tag",
    name: "$CashApp Tag",
    validator: (arg: any) => arg === "" || genericTextValidator(arg),
  },
  {
    field: "venmo_id",
    name: "Venmo @",
    validator: (arg: any) => arg === "" || genericTextValidator(arg),
  },
  {
    field: "paypal_me",
    name: "Paypal.Me Link",
    validator: (arg: any) => arg === "" || genericTextValidator(arg),
  },
  {
    field: "google_pay",
    name: "Google Pay (name/phone/id/etc)",
    validator: (arg: any) => arg === "" || genericTextValidator(arg),
  },
];

export const delivery_carrier_review_required_props: {
  field: string;
  name: string;
  validator: (arg: any) => boolean;
}[] = [
  {
    field: "rating",
    name: "Rating",
    validator: (arg) => numberValidator(arg) && arg >= 1 && arg <= 5,
  },
  {
    field: "title",
    name: "Title",
    validator: (arg: any) => genericTextValidator(arg),
  },
  {
    field: "summary",
    name: "Summary",
    validator: (arg: any) => genericTextValidator(arg),
  },
];

export const create_delivery_dispute_required_props: {
  field: string;
  name: string;
  validator: (arg: any) => boolean;
}[] = [
  {
    field: "title",
    name: "Title",
    validator: (arg: any) => genericTextValidator(arg),
  },
  {
    field: "details",
    name: "Details",
    validator: (arg: any) => genericTextValidator(arg),
  },
  {
    field: "compensation",
    name: "Compentation",
    validator: (arg) => numberValidator(arg) && arg >= 1,
  },
];

export const create_delivery_dispute_log_required_props: {
  field: string;
  name: string;
  validator: (arg: any) => boolean;
}[] = [
  {
    field: "body",
    name: "Body",
    validator: (arg: any) => genericTextValidator(arg),
  },
];

export const create_delivery_dispute_customer_support_message_required_props: {
  field: string;
  name: string;
  validator: (arg: any) => boolean;
}[] = [
  {
    field: "body",
    name: "Body",
    validator: (arg: any) => genericTextValidator(arg),
  },
  {
    field: "is_from_cs",
    name: "Is From Customer Support Flag",
    validator: (arg: any) => booleanValidator(arg),
  },
];

export const create_delivery_dispute_settlement_required_props: {
  field: string;
  name: string;
  validator: (arg: any) => boolean;
}[] = [
  {
    field: "message",
    name: "Message",
    validator: (arg: any) => genericTextValidator(arg),
  },
  {
    field: "offer_amount",
    name: "Offer Amount",
    validator: (arg) => numberValidator(arg) && arg >= 1,
  },
];

export const create_card_payment_method_required_props: IModelValidator[] = [
  { field: `number`, name: `Card Number`, errorMessage: `Must be a 16-digit number`, validator: (arg: any) => (/[\d]{16}/).test(arg) },
  { field: `exp_month`, name: `Expiration Month`, errorMessage: `Must be a number from 1 to 12`, validator: (arg: any) => (/[\d]{1,2}/).test(arg) },
  { field: `exp_year`, name: `Expiration Year`, errorMessage: `Must be a 4-digit number`, validator: (arg: any) => (/[\d]{4}/).test(arg) },
  { field: `cvc`, name: `CVC`, errorMessage: `Must be a 3-digit number`, validator: (arg: any) => (/[\d]{3}/).test(arg) },
];



export const delivery_search_attrs = [
  "id",
  "owner_id",

  "created_at",
  "size",
  "weight",
  "distance_miles",
  "payout",
  "penalty",

  "title",
  // 'description',

  "from_city",
  "from_state",
  "from_zipcode",

  "to_city",
  "to_state",
  "to_zipcode",
];

export const corsApiOptions: CorsOptions = {
  // https://expressjs.com/en/resources/middleware/cors.html
  credentials: true,
  optionsSuccessStatus: 200,
  origin(origin: string | undefined, callback: any) {
    const useOrigin = (origin || '');
    const originIsAllowed = AppEnvironment.CORS.WHITELIST.includes(useOrigin);
    
    console.log(`API request:`, {
      origin,
      // callback,
      originIsAllowed,
      // whitelist_domains,
    });
    // allowing all domains/origins from server-to-server requests; requests coming in from /api should have api key header for authentiction
    callback(null, true);
  }
};

export const corsWebOptions: CorsOptions = {
  // https://expressjs.com/en/resources/middleware/cors.html
  credentials: true,
  optionsSuccessStatus: 200,
  origin(origin: string | undefined, callback: any) {
    const useOrigin = (origin || '');
    const originIsAllowed = AppEnvironment.CORS.WHITELIST.includes(useOrigin);
    
    // check browser origin; requests coming in from /web will authenticate through CORS, CSRF and JWT
    if (originIsAllowed) {
      callback(null, true);
    } 
    else {
      console.log({
        origin,
        // callback,
        originIsAllowed,
        // whitelist_domains,
      });
      callback(new Error(`Web Origin "${origin}" Not allowed by CORS`));
    }
  }
};

export const corsMobileOptions: CorsOptions = {
  // https://expressjs.com/en/resources/middleware/cors.html
  credentials: true,
  optionsSuccessStatus: 200,
  origin(origin: string | undefined, callback: any) {
    // console.log(`mobile request:`, { origin });
    const useOrigin = (origin || '');
    const originIsAllowed = !useOrigin || AppEnvironment.CORS.WHITELIST.includes(useOrigin);
    
    console.log({
      origin,
      // callback,
      originIsAllowed,
      // whitelist_domains,
    });
    // allow all requests coming from /mobile route; requests should have a secret header for validating
    callback(null, true);
  }
};

export const CorsApiMiddleware = cors(corsApiOptions);
export const CorsWebMiddleware = cors(corsWebOptions);
export const CorsMobileMiddleware = cors(corsMobileOptions);



export enum RequestContexts {
  API = `API`,
  WEB = `WEB`,
  MOBILE = `APMOBILEI`,
}

export function SetApiRequestContext(request: Request, response: Response, next: NextFunction) {
  response.locals['REQUEST_CONTEXT'] = RequestContexts.API;
  response.locals['IS_API_REQUEST'] = true;
  next();
}

export function SetWebRequestContext(request: Request, response: Response, next: NextFunction) {
  response.locals['REQUEST_CONTEXT'] = RequestContexts.WEB;
  response.locals['IS_WEB_REQUEST'] = true;
  next();
}

export function SetMobileRequestContext(request: Request, response: Response, next: NextFunction) {
  response.locals['REQUEST_CONTEXT'] = RequestContexts.MOBILE;
  response.locals['IS_MOBILE_REQUEST'] = true;
  next();
}