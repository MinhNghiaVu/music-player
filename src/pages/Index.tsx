import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import SongCard from '@/components/SongCard';
import CollectionCard from '@/components/CollectionCard';
import Player from '@/components/Player';
import AudioVisualizer from '@/components/AudioVisualizer';
import ImportSongs from '@/components/ImportSongs';
import { Song, Collection, PlayerState } from '@/types/ICollection';
import { generateId } from '@/lib/utils';

const Index = () => {
  const [activeView, setActiveView] = useState('home');
  const [songs, setSongs] = useState<Song[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentSong: null,
    isPlaying: false,
    volume: 75,
    currentTime: 0,
    duration: 0,
    shuffle: false,
    repeat: 'none'
  });

  // Sample data for demonstration
  useEffect(() => {
    const sampleSongs: Song[] = [
      {
        id: '1',
        title: 'Midnight Dreams',
        artist: 'Luna Eclipse',
        album: 'Nocturnal Vibes',
        duration: 245,
        genre: ['Electronic', 'Ambient'],
        audioUrl: '',
        playCount: 1250,
        uploadedAt: new Date(),
        likes: 45,
        dislikes: 2,
        liked: false,
        disliked: false
      },
      {
        id: '2',
        title: 'Electric Pulse',
        artist: 'Neon Riders',
        album: 'City Lights',
        duration: 198,
        genre: ['Electronic', 'Synthwave'],
        audioUrl: '',
        playCount: 892,
        uploadedAt: new Date(),
        likes: 78,
        dislikes: 5,
        liked: false,
        disliked: false
      },
      {
        id: '3',
        title: 'Ocean Waves',
        artist: 'Calm Collective',
        album: 'Nature Sounds',
        duration: 312,
        genre: ['ambient', 'Chill'],
        audioUrl: '',
        playCount: 2341,
        uploadedAt: new Date(),
        likes: 156,
        dislikes: 3,
        liked: false,
        disliked: false
      }
    ];
    setSongs(sampleSongs);

    const sampleCollections: Collection[] = [
      {
        id: 'liked-songs',
        name: 'Liked Songs',
        description: 'Your favorite tracks',
        songs: [],
        createdAt: new Date(),
        isPublic: false
      },
      {
        id: '1',
        name: 'Chill Vibes',
        description: 'Perfect for relaxing',
        songs: [sampleSongs[0], sampleSongs[2]],
        createdAt: new Date(),
        isPublic: false
      }
    ];
    setCollections(sampleCollections);
  }, []);

  const handleImportSongs = (files: File[]) => {
    const newSongs: Song[] = files.map(file => ({
      id: generateId(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: 'Unknown Artist',
      duration: 0,
      genre: ['Unknown'],
      audioUrl: URL.createObjectURL(file),
      playCount: 0,
      uploadedAt: new Date(),
      likes: 0,
      dislikes: 0,
      liked: false,
      disliked: false
    }));
    
    setSongs(prev => [...prev, ...newSongs]);
    setActiveView('library');
  };

  const handleCreateCollection = (name: string, description?: string) => {
    const newCollection: Collection = {
      id: generateId(),
      name,
      description,
      songs: [],
      createdAt: new Date(),
      isPublic: false
    };
    setCollections(prev => [...prev, newCollection]);
  };

  const handleAddToCollection = (collectionId: string, song: Song) => {
    setCollections(prev => prev.map(collection => {
      if (collection.id === collectionId) {
        // Check if song is already in collection
        if (!collection.songs.find(s => s.id === song.id)) {
          // Get the latest version of the song from the main songs array
          const latestSong = songs.find(s => s.id === song.id) || song;
          return {
            ...collection,
            songs: [...collection.songs, latestSong]
          };
        }
      }
      return collection;
    }));
  };

  const handleLike = (songId: string) => {
    setSongs(prev => prev.map(song => {
      if (song.id === songId) {
        const wasLiked = song.liked;
        const wasDisliked = song.disliked;
        const newLikedState = !wasLiked;
        
        const updatedSong = {
          ...song,
          liked: newLikedState,
          disliked: false, // Remove dislike if liking
          likes: (song.likes || 0) + (wasLiked ? -1 : 1),
          dislikes: wasDisliked ? (song.dislikes || 0) - 1 : (song.dislikes || 0)
        };

        // Update the song in all collections
        setCollections(prevCollections => prevCollections.map(collection => ({
          ...collection,
          songs: collection.songs.map(collectionSong => 
            collectionSong.id === songId ? updatedSong : collectionSong
          )
        })));

        // Add to or remove from Liked Songs collection
        if (newLikedState) {
          setCollections(prevCollections => prevCollections.map(collection => {
            if (collection.id === 'liked-songs') {
              // Check if song is already in liked songs
              if (!collection.songs.find(s => s.id === songId)) {
                return {
                  ...collection,
                  songs: [...collection.songs, updatedSong]
                };
              }
            }
            return collection;
          }));
        } else {
          setCollections(prevCollections => prevCollections.map(collection => {
            if (collection.id === 'liked-songs') {
              return {
                ...collection,
                songs: collection.songs.filter(s => s.id !== songId)
              };
            }
            return collection;
          }));
        }

        return updatedSong;
      }
      return song;
    }));
  };

  const handleDislike = (songId: string) => {
    setSongs(prev => prev.map(song => {
      if (song.id === songId) {
        const wasLiked = song.liked;
        const wasDisliked = song.disliked;
        
        const updatedSong = {
          ...song,
          liked: false, // Remove like if disliking
          disliked: !wasDisliked,
          likes: wasLiked ? (song.likes || 0) - 1 : (song.likes || 0),
          dislikes: (song.dislikes || 0) + (wasDisliked ? -1 : 1)
        };

        // Update the song in all collections
        setCollections(prevCollections => prevCollections.map(collection => ({
          ...collection,
          songs: collection.songs.map(collectionSong => 
            collectionSong.id === songId ? updatedSong : collectionSong
          )
        })));

        // Remove from Liked Songs if disliking
        if (!wasDisliked) {
          setCollections(prevCollections => prevCollections.map(collection => {
            if (collection.id === 'liked-songs') {
              return {
                ...collection,
                songs: collection.songs.filter(s => s.id !== songId)
              };
            }
            return collection;
          }));
        }

        return updatedSong;
      }
      return song;
    }));
  };

  const handleDownload = (song: Song) => {
    if (song.audioUrl) {
      const link = document.createElement('a');
      link.href = song.audioUrl;
      link.download = `${song.title} - ${song.artist}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePlay = (song: Song) => {
    setPlayerState(prev => ({
      ...prev,
      currentSong: song,
      isPlaying: true,
      duration: song.duration
    }));
  };

  const handlePause = () => {
    setPlayerState(prev => ({ ...prev, isPlaying: false }));
  };

  const handlePlayerPlay = () => {
    setPlayerState(prev => ({ ...prev, isPlaying: true }));
  };

  const handlePlayerPause = () => {
    setPlayerState(prev => ({ ...prev, isPlaying: false }));
  };

  const handleSeek = (time: number) => {
    setPlayerState(prev => ({ ...prev, currentTime: time }));
  };

  const handleVolumeChange = (volume: number) => {
    setPlayerState(prev => ({ ...prev, volume }));
  };

  const handleNext = () => {
    // Implementation for next song
    console.log('Next song');
  };

  const handlePrevious = () => {
    // Implementation for previous song
    console.log('Previous song');
  };

  const handleToggleShuffle = () => {
    setPlayerState(prev => ({ ...prev, shuffle: !prev.shuffle }));
  };

  const handleToggleRepeat = () => {
    setPlayerState(prev => ({
      ...prev,
      repeat: prev.repeat === 'none' ? 'all' : prev.repeat === 'all' ? 'one' : 'none'
    }));
  };

  const renderContent = () => {
    if (activeView === 'home') {
      return (
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">Discover and enjoy your favorite music</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Recently Played</h2>
            <div className="grid gap-3">
              {songs.slice(0, 3).map(song => (
                <SongCard
                  key={song.id}
                  song={song}
                  collections={collections.filter(c => c.id !== 'liked-songs')}
                  isPlaying={playerState.isPlaying && playerState.currentSong?.id === song.id}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onAddToCollection={handleAddToCollection}
                  onCreatePlaylist={handleCreateCollection}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    if (activeView === 'library') {
      return (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground">Your Library</h1>
            <span className="text-muted-foreground">{songs.length} songs, {collections.length} playlists</span>
          </div>
          
          {collections.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Your Playlists</h2>
              <div className="grid gap-3">
                {collections.map(collection => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    isPlaying={false}
                    onPlay={() => {}}
                    onPause={() => {}}
                    onClick={() => setActiveView(`collection-${collection.id}`)}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">All Songs</h2>
            <div className="grid gap-3">
              {songs.map(song => (
                <SongCard
                  key={song.id}
                  song={song}
                  collections={collections.filter(c => c.id !== 'liked-songs')}
                  isPlaying={playerState.isPlaying && playerState.currentSong?.id === song.id}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onAddToCollection={handleAddToCollection}
                  onCreatePlaylist={handleCreateCollection}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    if (activeView === 'liked') {
      const likedSongsCollection = collections.find(c => c.id === 'liked-songs');
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Liked Songs</h1>
            <p className="text-muted-foreground mt-2">Your favorite tracks</p>
            <p className="text-muted-foreground mt-1">{likedSongsCollection?.songs.length || 0} songs</p>
          </div>
          
          <div className="grid gap-3">
            {likedSongsCollection?.songs.map(song => (
              <SongCard
                key={song.id}
                song={song}
                collections={collections.filter(c => c.id !== 'liked-songs')}
                isPlaying={playerState.isPlaying && playerState.currentSong?.id === song.id}
                onPlay={handlePlay}
                onPause={handlePause}
                onAddToCollection={handleAddToCollection}
                onCreatePlaylist={handleCreateCollection}
                onLike={handleLike}
                onDislike={handleDislike}
                onDownload={handleDownload}
              />
            )) || (
              <p className="text-muted-foreground text-center py-8">
                No liked songs yet. Start liking songs to see them here!
              </p>
            )}
          </div>
        </div>
      );
    }
    
    if (activeView === 'import') {
      return <ImportSongs onImport={handleImportSongs} />;
    }
    
    // Dynamic collection routes
    if (activeView.startsWith('collection-')) {
      const collectionId = activeView.replace('collection-', '');
      const collection = collections.find(c => c.id === collectionId);
      
      if (collection) {
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{collection.name}</h1>
              {collection.description && (
                <p className="text-muted-foreground mt-2">{collection.description}</p>
              )}
              <p className="text-muted-foreground mt-1">{collection.songs.length} songs</p>
            </div>
            
            <div className="grid gap-3">
              {collection.songs.map(song => (
                <SongCard
                  key={song.id}
                  song={song}
                  collections={collections.filter(c => c.id !== 'liked-songs')}
                  isPlaying={playerState.isPlaying && playerState.currentSong?.id === song.id}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onAddToCollection={handleAddToCollection}
                  onCreatePlaylist={handleCreateCollection}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          </div>
        );
      }
    }
    
    // Default case
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-muted-foreground">Page not found</h2>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        collections={collections}
        onCreateCollection={handleCreateCollection}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      
      <main className="flex-1 overflow-auto scrollbar-custom">
        <div className="p-8 pb-24">
          {renderContent()}
        </div>
      </main>

      <AudioVisualizer 
        isPlaying={playerState.isPlaying} 
        currentSong={playerState.currentSong} 
      />

      <Player
        playerState={playerState}
        onPlay={handlePlayerPlay}
        onPause={handlePlayerPause}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onToggleShuffle={handleToggleShuffle}
        onToggleRepeat={handleToggleRepeat}
      />
    </div>
  );
};

export default Index;
