import Nexmo, {
  SendSmsOptions,
  MessageRequestResponseStatusCode
} from 'nexmo';
import { isProd } from './constants.utils';
import { PlainObject } from '@app/lib-shared';



export function send_sms(params: {
  to_phone_number: string,
  message: string,
  countryCode?: string
}) {
  return new Promise((resolve, reject) => {
    const { to_phone_number, message, countryCode } = params;
    if (!to_phone_number) {
      console.log(`PHONE NUMBER REQUIRED...`);
      return reject();
    }
    if (!message) {
      console.log(`MESSAGE REQUIRED...`);
      return reject();
    }

    const apiKey = process.env.NEXMO_API_KEY;
    if (!apiKey) {
      console.log(`NEXMO API KEY REQUIRED...`);
      return reject();
    }
    const apiSecret = process.env.NEXMO_API_SECRET;
    if (!apiSecret) {
      console.log(`NEXMO API SECRET REQUIRED...`);
      return reject();
    }

    let nexmo;
    try {
      nexmo = new Nexmo({ apiKey, apiSecret }, { debug: true });
    } catch (e) {
      console.log(`COULD NOT INITIALIZE NEXMO...`, e);
      return reject(e);
    }

    const from = process.env.NEXMO_APP_NUMBER!;
    const to_number = to_phone_number.length === 10
      ? (countryCode || '1') + to_phone_number
      : to_phone_number;

    const smsOpts =  {
      from,
      to: to_number,
      body: (!isProd ? '(DEV) ' : '') + message
    } as SendSmsOptions;

    console.log({ smsOpts });

    try {
      nexmo.message.sendSms(from, to_number, message, smsOpts, (err, result) => {
        // console.log(`send sms reaults:`, { from, to_number, err, result });
        if (err || (<any> result).messages[0]['error-text']) {
          console.log(err || (<any> result).messages[0]);
          reject(err);
        } else {
          // console.log(result.messages);
          resolve(result);
        }
      });
    } catch (e) {
      // console.log(`COULD NOT INITIALIZE NEXMO...`, e);
      return reject(e);
    }
  });
}

export function send_verify_sms_request(phone_number: string): Promise<PlainObject> {
  return new Promise((resolve, reject) => {
    if (!phone_number) {
      console.log(`REQUIEST ID REQUIRED...`);
      return reject();
    }
    
    const apiKey = process.env.NEXMO_API_KEY;
    if (!apiKey) {
      console.log(`NEXMO API KEY REQUIRED...`);
      return reject();
    }
    const apiSecret = process.env.NEXMO_API_SECRET;
    if (!apiSecret) {
      console.log(`NEXMO API SECRET REQUIRED...`);
      return reject();
    }

    let nexmo;
    try {
      nexmo = new Nexmo({ apiKey, apiSecret }, { debug: true });
    } catch (e) {
      console.log(`COULD NOT INITIALIZE NEXMO...`, e);
      return reject(e);
    }

    try {
      nexmo.verify.request({
        number: phone_number,
        brand: process.env.APP_NAME!,
        code_length: 6
      }, (err, result) => {
        return err
          ? reject(err)
          : resolve(result);
      });
    } catch (e) {
      console.log(`COULD NOT INITIALIZE NEXMO...`, e);
      return reject(e);
    }
  });
}

export function cancel_verify_sms_request(request_id: string) {
  return new Promise((resolve, reject) => {
    if (!request_id) {
      console.log(`REQUIEST ID REQUIRED...`);
      return reject();
    }

    const apiKey = process.env.NEXMO_API_KEY;
    if (!apiKey) {
      console.log(`NEXMO API KEY REQUIRED...`);
      return reject();
    }
    const apiSecret = process.env.NEXMO_API_SECRET;
    if (!apiSecret) {
      console.log(`NEXMO API SECRET REQUIRED...`);
      return reject();
    }

    let nexmo;
    try {
      nexmo = new Nexmo({ apiKey, apiSecret }, { debug: true });
    } catch (e) {
      console.log(`COULD NOT INITIALIZE NEXMO...`, e);
      return reject(e);
    }

    try {
      nexmo.verify.control({ request_id, cmd: 'cancel' }, (err, result) => {
        return err
          ? reject(err)
          : resolve(result);
      });
    } catch (e) {
      console.log(`COULD NOT INITIALIZE NEXMO...`, e);
      return reject(e);
    }
  });
}

export function check_verify_sms_request(params: {
  request_id: string,
  code: string
}): Promise<PlainObject> {
  return new Promise((resolve, reject) => {
    const { request_id, code } = params;
    if (!request_id) {
      console.log(`REQUIEST ID REQUIRED...`);
      return reject();
    }
    if (!code) {
      console.log(`VERIFICATION CODE REQUIRED...`);
      return reject();
    }
  
    const apiKey = process.env.NEXMO_API_KEY;
    if (!apiKey) {
      console.log(`NEXMO API KEY REQUIRED...`);
      return reject();
    }
    const apiSecret = process.env.NEXMO_API_SECRET;
    if (!apiSecret) {
      console.log(`NEXMO API SECRET REQUIRED...`);
      return reject();
    }

    let nexmo;
    try {
      nexmo = new Nexmo({ apiKey, apiSecret }, { debug: true });
    } catch (e) {
      console.log(`COULD NOT INITIALIZE NEXMO...`, e);
      return reject(e);
    }

    try {
      nexmo.verify.check({ request_id, code }, (err, result) => {
        return err
          ? reject(err)
          : resolve(result);
      });
    } catch (e) {
      console.log(`COULD NOT INITIALIZE NEXMO...`, e);
      return reject(e);
    }
  });
}