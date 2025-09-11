
import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlayerState } from '@/database/interfaces/ICollection';
import { formatDuration } from '@/lib/utils';

interface PlayerProps {
  playerState: PlayerState;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

const Player = ({
  playerState,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onNext,
  onPrevious,
  onToggleShuffle,
  onToggleRepeat,
}: PlayerProps) => {
  const { currentSong, isPlaying, volume, currentTime, duration, shuffle, repeat } = playerState;
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  const handleMuteToggle = () => {
    if (isMuted) {
      // Unmute: restore previous volume
      onVolumeChange(previousVolume);
      setIsMuted(false);
    } else {
      // Mute: save current volume and set to 0
      setPreviousVolume(volume);
      onVolumeChange(0);
      setIsMuted(true);
    }
  };

  // Update mute state when volume changes externally
  useEffect(() => {
    if (volume === 0 && !isMuted) {
      setIsMuted(true);
    } else if (volume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [volume, isMuted]);

  if (!currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-player-bg border-t border-border p-4">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Current Song Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
            {currentSong.coverUrl ? (
              <img 
                src={currentSong.coverUrl} 
                alt={currentSong.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Music className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-foreground truncate">
              {currentSong.title}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 flex-1">
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleShuffle}
              className={`w-8 h-8 p-0 ${shuffle ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Shuffle className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={onPrevious}
              className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              onClick={isPlaying ? onPause : onPlay}
              className="w-10 h-10 rounded-full bg-primary hover:bg-primary-hover"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={onNext}
              className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleRepeat}
              className={`w-8 h-8 p-0 ${repeat !== 'none' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Repeat className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-3 w-full max-w-md">
            <span className="text-xs text-muted-foreground w-10 text-right">
              {formatDuration(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={(value) => onSeek(value[0])}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10">
              {formatDuration(duration)}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleMuteToggle}
            className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={100}
            step={1}
            onValueChange={(value) => {
              onVolumeChange(value[0]);
              if (value[0] > 0 && isMuted) {
                setIsMuted(false);
              }
            }}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
