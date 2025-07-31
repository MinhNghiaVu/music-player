import { ISong } from './ISong';

export interface IPlayer {
  currentSong: ISong | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}
