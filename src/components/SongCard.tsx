
import { Play, Pause, Music } from 'lucide-react';
import { Song, Collection } from '@/types/music';
import { Button } from '@/components/ui/button';
import { formatDuration } from '@/lib/utils';
import SongActionsDropdown from './SongActionsDropdown';

interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  collections: Collection[];
  onPlay: (song: Song) => void;
  onPause: () => void;
  onAddToCollection: (collectionId: string, song: Song) => void;
  onCreatePlaylist: (name: string, description?: string) => void;
  onLike: (songId: string) => void;
  onDislike: (songId: string) => void;
  onDownload: (song: Song) => void;
}

const SongCard = ({ 
  song, 
  isPlaying, 
  collections,
  onPlay, 
  onPause,
  onAddToCollection,
  onCreatePlaylist,
  onLike,
  onDislike,
  onDownload
}: SongCardProps) => {
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay(song);
    }
  };

  return (
    <div className="group bg-song-card hover:bg-song-card-hover p-4 rounded-lg transition-all duration-200 hover:scale-[1.02]">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            {song.coverUrl ? (
              <img 
                src={song.coverUrl} 
                alt={song.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Music className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <Button
            size="sm"
            onClick={handlePlayPause}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary hover:bg-primary-hover p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isPlaying ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3 ml-0.5" />
            )}
          </Button>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-foreground truncate">
            {song.title}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {song.artist}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">
            {formatDuration(song.duration)}
          </span>
          <SongActionsDropdown
            song={song}
            collections={collections}
            onAddToCollection={onAddToCollection}
            onCreatePlaylist={onCreatePlaylist}
            onLike={onLike}
            onDislike={onDislike}
            onDownload={onDownload}
          />
        </div>
      </div>
    </div>
  );
};

export default SongCard;
