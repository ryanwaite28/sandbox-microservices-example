export const NAME_REGEX: RegExp = /[a-zA-Z\']{2,50}/;
export const USERNAME_REGEX: RegExp = /^[a-zA-Z0-9\-\_\.]{2,50}$/;
export const DISPLAYNAME_REGEX: RegExp = /[^"\\\/;<>]{1,100}/;
export const PASSWORD_REGEX: RegExp = /[^\s]{5,}/;
