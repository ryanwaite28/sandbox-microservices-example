import { MicroservicesQueues } from "../enums/queues.enum";

export const MEDIA_GET_BY_ID_QUEUE = Object.freeze({ name: MicroservicesQueues.Storage.MEDIA_GET_BY_ID, options: Object.freeze({ durable: true }) });
export const MEDIA_GET_ALL_QUEUE = Object.freeze({ name: MicroservicesQueues.Storage.MEDIA_GET_ALL, options: Object.freeze({ durable: true }) });
export const MEDIA_START_QUEUE = Object.freeze({ name: MicroservicesQueues.Storage.MEDIA_START, options: Object.freeze({ durable: true }) });
export const MEDIA_PROGRESS_QUEUE = Object.freeze({ name: MicroservicesQueues.Storage.MEDIA_PROGRESS, options: Object.freeze({ durable: true }) });

export const LOGGING_QUEUE = Object.freeze({ name: MicroservicesQueues.Logging.LOGGING, options: Object.freeze({ durable: true }) });

export const USER_GET_BY_ID_QUEUE = Object.freeze({ name: MicroservicesQueues.Users.USER_GET_BY_ID, options: Object.freeze({ durable: true }) });
export const USERS_GET_LIKE_USERNAME_QUEUE = Object.freeze({ name: MicroservicesQueues.Users.USERS_GET_LIKE_USERNAME, options: Object.freeze({ durable: true }) });
export const USER_CREATE_QUEUE = Object.freeze({ name: MicroservicesQueues.Users.USER_CREATE, options: Object.freeze({ durable: true }) });
export const USER_UPDATE_QUEUE = Object.freeze({ name: MicroservicesQueues.Users.USER_UPDATE, options: Object.freeze({ durable: true }) });
export const USER_DELETE_QUEUE = Object.freeze({ name: MicroservicesQueues.Users.USER_DELETE, options: Object.freeze({ durable: true }) });

export const POST_GET_BY_ID_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.POST_GET_BY_ID, options: Object.freeze({ durable: true }) });
export const POSTS_GET_BY_USERID_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.POSTS_GET_BY_USERID, options: Object.freeze({ durable: true }) });
export const POSTS_GET_BY_TAG_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.POSTS_GET_BY_TAG, options: Object.freeze({ durable: true }) });
export const POST_CREATE_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.POST_CREATE, options: Object.freeze({ durable: true }) });
export const POST_UPDATE_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.POST_UPDATE, options: Object.freeze({ durable: true }) });
export const POST_DELETE_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.POST_DELETE, options: Object.freeze({ durable: true }) });
export const POST_LIKE_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.POST_LIKE, options: Object.freeze({ durable: true }) });
export const POST_SAVE_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.POST_SAVE, options: Object.freeze({ durable: true }) });
export const COMMENT_GET_BY_ID_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.COMMENT_GET_BY_ID, options: Object.freeze({ durable: true }) });
export const COMMENTS_GET_BY_USERID_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.COMMENTS_GET_BY_USERID, options: Object.freeze({ durable: true }) });
export const COMMENTS_GET_BY_TAG_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.COMMENTS_GET_BY_TAG, options: Object.freeze({ durable: true }) });
export const COMMENT_CREATE_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.COMMENT_CREATE, options: Object.freeze({ durable: true }) });
export const COMMENT_UPDATE_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.COMMENT_UPDATE, options: Object.freeze({ durable: true }) });
export const COMMENT_DELETE_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.COMMENT_DELETE, options: Object.freeze({ durable: true }) });
export const COMMENT_LIKE_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.COMMENT_LIKE, options: Object.freeze({ durable: true }) });
export const COMMENT_SAVE_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.COMMENT_SAVE, options: Object.freeze({ durable: true }) });
export const REPLY_GET_BY_ID_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.REPLY_GET_BY_ID, options: Object.freeze({ durable: true }) });
export const REPLIES_GET_BY_USERID_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.REPLIES_GET_BY_USERID, options: Object.freeze({ durable: true }) });
export const REPLIES_GET_BY_TAG_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.REPLIES_GET_BY_TAG, options: Object.freeze({ durable: true }) });
export const REPLY_CREATE_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.REPLY_CREATE, options: Object.freeze({ durable: true }) });
export const REPLY_UPDATE_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.REPLY_UPDATE, options: Object.freeze({ durable: true }) });
export const REPLY_DELETE_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.REPLY_DELETE, options: Object.freeze({ durable: true }) });
export const REPLY_LIKE_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.REPLY_LIKE, options: Object.freeze({ durable: true }) });
export const REPLY_SAVE_QUEUE = Object.freeze({ name: MicroservicesQueues.Blog.REPLY_SAVE, options: Object.freeze({ durable: true }) });
