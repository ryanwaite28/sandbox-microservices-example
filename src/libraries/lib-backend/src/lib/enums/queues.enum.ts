export namespace MicroservicesQueues {

  export enum Storage {
    MEDIA_GET_BY_ID = 'MEDIA_GET_BY_ID',
    MEDIA_GET_ALL = 'MEDIA_GET_ALL',
    MEDIA_START = 'MEDIA_START',
    MEDIA_PROGRESS = 'MEDIA_PROGRESS',
  }

  export enum Logging {
    LOGGING = 'LOGGING',
  }

  export enum Users {
    USER_GET_BY_ID = 'USER_GET_BY_ID',
    USER_GET_BY_EMAIL = 'USER_GET_BY_EMAIL',
    USER_GET_BY_USERNAME = 'USER_GET_BY_USERNAME',
    USERS_GET_LIKE_USERNAME = 'USERS_GET_LIKE_USERNAME',
    USER_AUTHENTICATE = "USER_AUTHENTICATE",
    USER_CREATE = "USER_CREATE",
    USER_UPDATE = "USER_UPDATE",
    USER_DELETE = "USER_DELETE",
  }

  export enum Blog {
    POST_GET_BY_ID = 'POST_GET_BY_ID',
    POSTS_GET_BY_USERID = 'POSTS_GET_BY_USERID',
    POSTS_GET_BY_TAG = 'POSTS_GET_BY_TAG',
    POST_CREATE = "POST_CREATE",
    POST_UPDATE = "POST_UPDATE",
    POST_DELETE = "POST_DELETE",
    POST_LIKE = "POST_LIKE",
    POST_SAVE = "POST_SAVE",
  
    COMMENT_GET_BY_ID = 'COMMENT_GET_BY_ID',
    COMMENTS_GET_BY_USERID = 'COMMENTS_GET_BY_USERID',
    COMMENTS_GET_BY_TAG = 'COMMENTS_GET_BY_TAG',
    COMMENT_CREATE = "COMMENT_CREATE",
    COMMENT_UPDATE = "COMMENT_UPDATE",
    COMMENT_DELETE = "COMMENT_DELETE",
    COMMENT_LIKE = "COMMENT_LIKE",
    COMMENT_SAVE = "COMMENT_SAVE",
  
    REPLY_GET_BY_ID = 'REPLY_GET_BY_ID',
    REPLIES_GET_BY_USERID = 'REPLIES_GET_BY_USERID',
    REPLIES_GET_BY_TAG = 'REPLIES_GET_BY_TAG',
    REPLY_CREATE = "REPLY_CREATE",
    REPLY_UPDATE = "REPLY_UPDATE",
    REPLY_DELETE = "REPLY_DELETE",
    REPLY_LIKE = "REPLY_LIKE",
    REPLY_SAVE = "REPLY_SAVE",
  }

}