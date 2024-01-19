export interface MediaInfo {
  chunks?: number | null;
  ext: string;
  type: string;
  size: number;
}

export interface MediaAdd {
  index: number,
  chunks: number[]
}

export interface MediaLocation {
  id?: number;
  path: string;
}

export interface MediaObject {
  id: number;
  uuid: string;
  metadata: string | null;
  owner_id: number | null;
  extension: string;
  type: string;
  size: number;
  chunks: number | null;
  version: number;
  key: string;
  path: string;
  domain: string;
  url: string;
  status: string;
}
