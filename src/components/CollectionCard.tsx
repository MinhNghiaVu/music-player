
import { Folder, Play, Pause, MoreHorizontal } from 'lucide-react';
import { Collection } from '@/types/ICollection';
import { Button } from '@/components/ui/button';

interface CollectionCardProps {
  collection: Collection;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onClick: () => void;
}

const CollectionCard = ({ collection, isPlaying, onPlay, onPause, onClick }: CollectionCardProps) => {
  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  return (
    <div 
      className="group bg-song-card hover:bg-song-card-hover p-4 rounded-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            {collection.coverUrl ? (
              <img 
                src={collection.coverUrl} 
                alt={collection.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Folder className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          {collection.songs.length > 0 && (
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
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-foreground truncate">
            {collection.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {collection.songs.length} song{collection.songs.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
