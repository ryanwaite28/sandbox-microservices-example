import {
  createLogger,
  format,
  transports,
} from 'winston';
import { SPLAT } from 'triple-beam';
import 'winston-daily-rotate-file';



const myFormat = format.printf((params) => {
  const { level, message, label, timestamp } = params;
  // console.log(params, params[SPLAT]);
  return `${timestamp} [${label}] ${level}: ${message} - ${JSON.stringify(params)}`;
});


const rotateTransport = new transports.DailyRotateFile({
  filename: 'logs-%DATE%.log',
  dirname: process.env['SHARED_STORAGE_VOL_PATH'] || `logs`,
  datePattern: 'YYYY-MM-DD-HH',
  // zippedArchive: true,
  // maxSize: '20m',
  maxFiles: '7d'
});

rotateTransport.on('rotate', (oldFilename, newFilename) => {
  console.log(`Log file rotated`, { oldFilename, newFilename });
});

rotateTransport.on('new', (newFilename) => {
  console.log(`Log file created`, { newFilename });
});

rotateTransport.on('archive', (zipFilename) => {
  console.log(`Log file archived`, { zipFilename });
});


rotateTransport.on('logRemoved', (fileName) => {
  console.log(`Log file removed`, { fileName });
});



export const LOGGER = createLogger({
  transports: [
    new transports.File({
      filename: (process.env['SHARED_STORAGE_VOL_PATH'] || 'logs') + '/combined.log',
      format: format.combine(
        format.json(),
        format.timestamp(),
      )
    }),

    
    rotateTransport,
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.label({ label: 'EVENT' }),
        format.timestamp(),
        format.splat(),
        format.colorize({
          colors: {
            info: 'white',
            debug: 'blue',
            warn: 'yellow',
            error: 'red',
          }
        }),
        myFormat
      )
    })
  ],
});
