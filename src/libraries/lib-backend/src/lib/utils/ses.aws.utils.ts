import { SESClient, SendEmailCommand, SendEmailCommandInput, SendEmailCommandOutput } from "@aws-sdk/client-ses";
import { AppEnvironment } from "./app.enviornment";
import { isLocal } from "./constants.utils";
import { LOGGER } from "./logger.utils";
const aws_ses_client = new SESClient({ region: "us-east-1" });



export function sendAwsEmail(params: {
  to: string,
  subject: string,
  message?: string,
  html?: string,
  forceInLocal?: boolean
}): Promise<SendEmailCommandOutput> {
  if (!params.forceInLocal && isLocal) {
    LOGGER.info(`Is local, not sending email...`, { isLocal, params });
    return Promise.resolve({} as any);
  }

  const sendCommandParams: SendEmailCommandInput = {
    Source: AppEnvironment.AWS.SES.EMAIL,
    Destination: {
      ToAddresses: [params.to]
    },
    Message: {
      Subject: {
        Data: params.subject,
        Charset: `utf-8`
      },
      // if both are defined, html takes priority over message
      Body: !!params.html
        ? { Html: { Data: params.html, Charset: `utf-8` } }
        : { Text: { Data: params.message, Charset: `utf-8` } }
    },
    ReplyToAddresses: [],
    SourceArn: AppEnvironment.AWS.SES.ARN
  };
  LOGGER.info(`Sending email via AWS SES:`, { params, sendCommandParams });
  const command = new SendEmailCommand(sendCommandParams);
  
  return aws_ses_client.send(command)
  .then((results) => {
    LOGGER.info(`Email AWS SES send results:`, { results });
    return results;
  })
  .catch((error) => {
    LOGGER.error(`Email AWS SES send error:`, { error });
    return error;
  });
}

export function sendAwsInternalEmail(params: {
  subject: string,
  message?: string,
  html?: string,
  forceInLocal?: boolean,
}) {
  if (!params.forceInLocal && isLocal) {
    LOGGER.info(`Is local, not sending email...`, { isLocal, params });
    return Promise.resolve();
  }
  const sendCommandParams: SendEmailCommandInput = {
    Source: AppEnvironment.AWS.SES.EMAIL_INTERNAL_SENDER,
    Destination: {
      ToAddresses: [AppEnvironment.AWS.SES.EMAIL_INTERNAL_RECEIVER]
    },
    Message: {
      Subject: {
        Data: params.subject,
        Charset: `utf-8`
      },
      // if both are defined, html takes priority over message
      Body: !!params.html
        ? { Html: { Data: params.html, Charset: `utf-8` } }
        : { Text: { Data: params.message, Charset: `utf-8` } }
    },
    ReplyToAddresses: [],
    SourceArn: AppEnvironment.AWS.SES.ARN_INTERNAL
  };
  LOGGER.info(`Sending email via AWS SES:`, { params, sendCommandParams });
  const command = new SendEmailCommand(sendCommandParams);
  
  return aws_ses_client.send(command)
  .then((results) => {
    LOGGER.info(`Email AWS SES send results:`, { results });
    return results;
  })
  .catch((error) => {
    LOGGER.error(`Email AWS SES send error:`, { error });
    return error;
  });
}