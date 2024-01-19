export enum StorageVersions {
  V1 = 1, // local 
  V2, // aws
  V3, // google
  V4, // azure
}

export enum UploadStatus {
  STARTED = 'STARTED',
  PROGRESS = 'PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum Binary {
  BIT = 1,
  BYTE = 8,
  KILO = 2 ** 10,
  MEGA = 2 ** 20,
  GIGA = 2 ** 30,
  TERA = 2 ** 40,
  PETA = 2 ** 50,
  EXA = 2 ** 60,
  ZETTA = 2 ** 70,
  YOTTA = 2 ** 80,
  BRONTO = 2 ** 90,
  GEOP = 2 ** 100,
}