
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Folder, Check } from 'lucide-react';
import { Collection, Song } from '@/database/interfaces/ICollection';
import CreatePlaylistDialog from './CreatePlaylistDialog';
import { useToast } from '@/components/ui/use-toast';

interface AddToPlaylistDialogProps {
  song: Song;
  collections: Collection[];
  onAddToCollection: (collectionId: string, song: Song) => void;
  onCreatePlaylist: (name: string, description?: string) => void;
  children: React.ReactNode;
}

const AddToPlaylistDialog = ({ 
  song, 
  collections, 
  onAddToCollection, 
  onCreatePlaylist, 
  children 
}: AddToPlaylistDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleAddToPlaylist = (collectionId: string, collectionName: string) => {
    const collection = collections.find(c => c.id === collectionId);
    const songAlreadyInPlaylist = collection?.songs.some(s => s.id === song.id);
    
    if (songAlreadyInPlaylist) {
      toast({
        title: "Song already in playlist",
        description: `"${song.title}" is already in "${collectionName}"`,
      });
    } else {
      onAddToCollection(collectionId, song);
      toast({
        title: "Added to playlist",
        description: `"${song.title}" added to "${collectionName}"`,
      });
      setOpen(false);
    }
  };

  const handleCreateAndAdd = (name: string, description?: string) => {
    onCreatePlaylist(name, description);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add &quot;{song.title}&quot; to playlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto space-y-2">
            {collections.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                No playlists yet. Create one below!
              </p>
            ) : (
              collections.map(collection => {
                const songInPlaylist = collection.songs.some(s => s.id === song.id);
                return (
                  <Button
                    key={collection.id}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3"
                    onClick={() => handleAddToPlaylist(collection.id, collection.name)}
                  >
                    <Folder className="w-4 h-4 mr-3" />
                    <div className="text-left flex-1">
                      <div className="font-medium">{collection.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {collection.songs.length} songs
                      </div>
                    </div>
                    {songInPlaylist && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </Button>
                );
              })
            )}
          </div>
          
          <div className="border-t pt-4">
            <CreatePlaylistDialog onCreatePlaylist={handleCreateAndAdd}>
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create New Playlist
              </Button>
            </CreatePlaylistDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToPlaylistDialog;
