import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  HeadBucketCommand
} from "@aws-sdk/client-s3";
import { AppEnvironment } from "./app.enviornment";
import { UploadedFile } from "express-fileupload";
import { readFileSync } from "fs";
import { LOGGER } from "./logger.utils";
import { isImageFileOrBase64, upload_base64, upload_file } from "./helpers.utils";
import { PlainObject, ServiceMethodResults, HttpStatusCode } from "@app/lib-shared";



// Set the AWS Region.
const REGION = "us-east-1"; // e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: REGION });

// https://www.npmjs.com/package/s3-upload-stream

export class AwsS3Service {
  static readonly s3Client = s3Client;

  static isS3ConventionId(id: string) {
    return id.includes(`${AppEnvironment.AWS.S3.BUCKET}|`);
  }

  static async uploadFile(
    file: string | UploadedFile | undefined,
    options?: {
      treatNotFoundAsError: boolean,
      validateAsImage?: boolean,
      mutateObj?: PlainObject,
      id_prop?: string,
      link_prop?: string;
    }
  ) {
    if (!file) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: options && options.hasOwnProperty('treatNotFoundAsError') ? options.treatNotFoundAsError : true,
        info: {
          message: `No argument found/given`
        }
      };
      
      const errMsg = `AwsS3Service.uploadFile - ${options.treatNotFoundAsError ? 'error' : 'info'}: no file input...`;
      options.treatNotFoundAsError ? LOGGER.error(errMsg, { options, serviceMethodResults }) : LOGGER.info(errMsg, { options, serviceMethodResults });
      return serviceMethodResults;
    }

    if (!!options.validateAsImage && !isImageFileOrBase64(file)) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Bad file input given.`
        }
      };
      return serviceMethodResults;
    }

    
    try {
      let filepath: string = '';
      let filetype: string = '';
      let filename: string = '';
      if (typeof file === 'string') {
        // base64 string provided; attempt parsing...
        const filedata = await upload_base64(file);
        filepath = filedata.file_path;
        filetype = filedata.filetype;
        filename = filedata.filename;
      }
      else {
        const filedata = await upload_file(file);
        filetype = (<UploadedFile> file).mimetype;
        filepath = filedata.file_path;
        filename = filedata.filename;
      }
  
      const Key = `static/uploads/${filename}`;
      const Id = `${AppEnvironment.AWS.S3.BUCKET}|${Key}`; // unique id ref for database storage; makes it easy to figure out the bucket and key for later usages/purposes.
      const Link = `${AppEnvironment.AWS.S3.SERVE_ORIGIN}/uploads/${filename}`;
  
      const Body: Buffer = readFileSync(filepath);
      await AwsS3Service.createObject({
        Bucket: AppEnvironment.AWS.S3.BUCKET,
        Key,
        Body,
        ContentType: filetype
      });

      LOGGER.info(`Web link to new upload: ${Link}`);
  
      const results = {
        Bucket: AppEnvironment.AWS.S3.BUCKET,
        Key,
        ContentType: filetype,
        Link,
        Id
      };

      if (options && options.mutateObj && options.id_prop && options.link_prop) {
        options.mutateObj[options.id_prop] = Id;
        options.mutateObj[options.link_prop] = Link;
      }
  
      LOGGER.info(`AWS S3 upload results:`, { results });
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.OK,
        error: false,
        info: {
          data: results
        }
      };
      LOGGER.info(`AWS S3 upload results:`, { results });
      return serviceMethodResults;
    }
    catch (error) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        error: true,
        info: {
          message: `Could not upload to AWS S3; something went wrong`
        }
      };
      LOGGER.error(serviceMethodResults.info.message, { error });
      return serviceMethodResults;
    }
  }

  // create

  static async createBucket(Bucket: string) {
    const data = await s3Client.send(new CreateBucketCommand({ Bucket }));
    console.log({ data });
    console.log("Successfully created a bucket called:", data.Location);
    return data; // For unit tests.
  }

  static async createObject(params: {
    Bucket: string, // The name of the bucket. For example, 'sample_bucket_101'.
    Key: string, // The name of the object. For example, 'sample_upload.txt'.
    Body: any, // The content of the object. For example, 'Hello world!".
    ContentType: string
  }) {
    const results = await s3Client.send(new PutObjectCommand(params));
    console.log(
      "Successfully created " +
      params.Key +
      " and uploaded it to " +
      params.Bucket +  "/" + params.Key +
      ", served as "
    );
    return results;
  }

  // get

  static async getObject(params: {
    Bucket: string // The name of the bucket. For example, 'sample_bucket_101'.
    Key: string, // The name of the object. For example, 'sample_upload.txt'.
  }) {
    const results = await s3Client.send(new GetObjectCommand(params));
    console.log(
      "Successfully fetched " +
      params.Key +
      " and uploaded it to " +
      params.Bucket +
      "/" +
      params.Key
    );
    return results; // For unit tests.
  }

  // delete

  static async deleteBucket(Bucket: string) {
    const data = await s3Client.send(new DeleteBucketCommand({ Bucket }));
    console.log(data);
    return data; // For unit tests.
  }

  static async deleteObject(params: {
    Bucket: string, // The name of the bucket. For example, 'sample_bucket_101'.
    Key: string, // The name of the object. For example, 'sample_upload.txt'.
  }) {
    const results = await s3Client.send(new DeleteObjectCommand(params));
    console.log(
      "Successfully deleted " +
      params.Key +
      " from bucket " +
      params.Bucket
    );
    
    return results;
  }


  static async bucketExists(Bucket: string): Promise<boolean> {
    try {
      const response = await s3Client.send(new HeadBucketCommand({ Bucket }));
      return true;
    }
    catch {
      return false;
    }
  }
}