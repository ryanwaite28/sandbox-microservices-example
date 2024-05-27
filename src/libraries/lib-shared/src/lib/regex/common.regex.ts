export const AUTH_BEARER_HEADER_REGEX: RegExp = /Bearer\s[^]/;
export const GENERIC_TEXT_REGEX: RegExp = /^[a-zA-Z0-9\s\'\-\_\.\@\$\#]{1,250}/;
export const PERSON_NAME_REGEX: RegExp = /^[a-zA-Z\s\'\-\_\.]{2,50}$/;
export const URL_REGEX = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
export const BASE64_REGEX = /^data:([A-Za-z-+\/]+);base64,(.+)$/;
export const MENTIONS_REGEX = /@[a-zA-Z0-9\-\_\.]{2,50}/gi;

export const YOUTUBE_URL_STANDARD = /http(s?):\/\/(www\.)?youtube\.com\/watch\?(.*)/gi;
export const YOUTUBE_URL_SHORT = /http(s?):\/\/(www\.)?youtu\.be\/(.*)/gi;
export const YOUTUBE_URL_EMBED = /http(s?):\/\/(www\.)?youtube\.com\/embed\/(.*)/gi;
export const YOUTUBE_URL_ID = /(v=[a-zA-Z0-9\-\_]{7,}|\/[a-zA-Z0-9\-\_]{7,})/gi;

export const LEADING_SPACES = /[\s]{2,}/;
export const LEADING_SPACES_GLOBAL = /[\s]{2,}/gi;