import { ISong } from './ISong';

export interface ICollection {
  id: string;
  name: string;
  songs: ISong[];
  isPublic: boolean;
  createdAt: Date;
  description?: string;
  coverUrl?: string;
}

