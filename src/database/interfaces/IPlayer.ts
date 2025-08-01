import { ISong } from './ISong';

export interface IPlayer {
  id: string;
  currentSong: ISong | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  createdAt: Date;
  updatedAt?: Date;
}
