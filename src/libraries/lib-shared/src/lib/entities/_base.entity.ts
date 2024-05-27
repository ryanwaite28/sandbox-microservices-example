

export interface BaseEntity {
  id: number;
  uuid: string;
  metadata: string;
  
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}