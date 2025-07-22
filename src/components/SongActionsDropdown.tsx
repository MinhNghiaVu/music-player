
import { useState } from 'react';
import { MoreHorizontal, Plus, Download, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Song, Collection } from '@/types/music';
import AddToPlaylistDialog from './AddToPlaylistDialog';

interface SongActionsDropdownProps {
  song: Song;
  collections: Collection[];
  onAddToCollection: (collectionId: string, song: Song) => void;
  onCreatePlaylist: (name: string, description?: string) => void;
  onLike: (songId: string) => void;
  onDislike: (songId: string) => void;
  onDownload: (song: Song) => void;
}

const SongActionsDropdown = ({
  song,
  collections,
  onAddToCollection,
  onCreatePlaylist,
  onLike,
  onDislike,
  onDownload,
}: SongActionsDropdownProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDownload = () => {
    onDownload(song);
    setDropdownOpen(false);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(song.id);
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDislike(song.id);
  };

  return (
    <div className="flex items-center space-x-1">
      <Button
        size="sm"
        variant="ghost"
        className={`w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
          song.liked ? 'text-green-500' : 'text-muted-foreground hover:text-green-500'
        }`}
        onClick={handleLike}
      >
        <ThumbsUp className="w-4 h-4" />
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        className={`w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
          song.disliked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
        }`}
        onClick={handleDislike}
      >
        <ThumbsDown className="w-4 h-4" />
      </Button>

      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <AddToPlaylistDialog
            song={song}
            collections={collections}
            onAddToCollection={onAddToCollection}
            onCreatePlaylist={onCreatePlaylist}
          >
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Plus className="w-4 h-4 mr-2" />
              Add to playlist
            </DropdownMenuItem>
          </AddToPlaylistDialog>
          
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SongActionsDropdown;
