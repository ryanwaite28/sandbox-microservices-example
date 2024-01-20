export interface MediaInfo {
  chunks?: number | null;
  ext: string;
  type: string;
  size: number;
}

export interface MediaAdd {
  id: number,
  index: number,
  chunks: number[],
  isLast: boolean,
  chunksCount: number | null,
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
