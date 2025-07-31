import { ISong } from './ISong';

export interface ICollection {
  id: string;
  name: string;
  description?: string;
  songs: ISong[];
  coverUrl?: string;
  createdAt: Date;
  isPublic: boolean;
}

