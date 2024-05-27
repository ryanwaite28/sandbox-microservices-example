import { NAME_REGEX, HttpStatusCode, ServiceMethodResults } from "@app/lib-shared";


export function validatePassword(password: string) {
  if (!password) { return false; }
  if (password.constructor !== String) { return false; }

  const hasMoreThanSixCharacters = password.length > 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);

  return (
    hasMoreThanSixCharacters
    && (hasUpperCase || hasLowerCase)
    // && hasNumbers
  );
}



export function validateEmail(email: string) {
  if (!email) { return false; }
  if (email.constructor !== String) { return false; }
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

export function validatePhone(phone?: string) {
  // https://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript
  if (!phone) { return false; }
  if (typeof(phone) !== 'string') { return false; }
  const re = /^[\d]+$/;
  return re.test(phone.toLowerCase()) && (phone.length === 10 || phone.length === 11);
}

export function validateUsername(value: string): boolean {
  if (!value) { return false; }
  if (value.constructor !== String) { return false; }
  const re = /^[a-zA-Z0-9\-\_\.]{2,50}$/;
  return re.test(value.toLowerCase());
}

export function validateURL(value: any): boolean {
  if (!value) { return false; }
  if (value.constructor !== String) { return false; }
  const re = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  return re.test(value.toLowerCase());
}

export function validatePersonName(value: any): boolean {
  if (!value) { return false; }
  if (value.constructor !== String) { return false; }
  const re = /^[a-zA-Z\s\'\-\_\.]{2,50}$/;
  return re.test(value.toLowerCase());
}

export function validateName(name: string) {
  return !!name && (typeof name === 'string') && NAME_REGEX.test(name);
}




export const optionalValidatorCheck = (arg: any, fn: (arg: any) => boolean) => !arg || fn(arg);
export const requiredValidatorCheck = (arg: any, fn: (arg: any) => boolean) => !!arg && fn(arg);



export const genericTextValidator = (arg: any) => !!arg && typeof(arg) === 'string' && (/^[a-zA-Z0-9\s\'\-\_\.\@\$\#]{1,250}/).test(arg);
export const genericTextValidatorOptional = (arg: any) => !arg || genericTextValidator(arg);
export const phoneValidator = (arg: any) => (/^[0-9]{10,15}$/).test(arg);
export const stringValidator = (arg: any) => typeof(arg) === 'string';
export const numberValidator = (arg: any) => typeof(arg) === 'number';
export const booleanValidator = (arg: any) => typeof(arg) === 'boolean';
export const dateObjValidator = (arg: any) => typeof(arg) === 'object' && arg.constructor === Date;
export const notNullValidator = (arg: any) => arg !== null;



export const optional_textValidator = (arg: any) => {
  console.log({ arg });
  return optionalValidatorCheck(arg, genericTextValidator);
};
export const required_textValidator = (arg: any) => requiredValidatorCheck(arg, genericTextValidator);

export const optional_emailValidator = (arg: any) => optionalValidatorCheck(arg, validateEmail);
export const required_emailValidator = (arg: any) => requiredValidatorCheck(arg, validateEmail);

export const optional_phoneValidator = (arg: any) => optionalValidatorCheck(arg, phoneValidator);
export const required_phoneValidator = (arg: any) => requiredValidatorCheck(arg, phoneValidator);

export const optional_stringValidator = (arg: any) => optionalValidatorCheck(arg, stringValidator);
export const required_stringValidator = (arg: any) => requiredValidatorCheck(arg, stringValidator);

export const optional_numberValidator = (arg: any) => optionalValidatorCheck(arg, numberValidator);
export const required_numberValidator = (arg: any) => requiredValidatorCheck(arg, numberValidator);

export const optional_booleanValidator = (arg: any) => optionalValidatorCheck(arg, booleanValidator);
export const required_booleanValidator = (arg: any) => requiredValidatorCheck(arg, booleanValidator);

export const optional_notNullValidator = (arg: any) => optionalValidatorCheck(arg, notNullValidator);
export const required_notNullValidator = (arg: any) => requiredValidatorCheck(arg, notNullValidator);



export const stripeValidators = Object.freeze({
  customerId: (arg: any) => !!arg && typeof(arg) === 'string' && (/^cus_[a-zA-Z0-9]{19,35}/).test(arg),
  paymentMethodId: (arg: any) => !!arg && typeof(arg) === 'string' && (/^pm_[a-zA-Z0-9]{19,35}/).test(arg),
});






export const createGenericServiceMethodError = (message: string, status?: HttpStatusCode, error?: any): ServiceMethodResults => {
  const serviceMethodResults: ServiceMethodResults = {
    status: HttpStatusCode.BAD_REQUEST,
    error: true,
    info: {
      message,
      error,
    }
  };
  return serviceMethodResults;
};

export const createGenericServiceMethodSuccess = <T = any> (message?: string, data?: T): ServiceMethodResults => {
  const serviceMethodResults: ServiceMethodResults<T> = {
    status: HttpStatusCode.OK,
    error: false,
    info: {
      message,
      data,
    }
  };
  return serviceMethodResults;
};