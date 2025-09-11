import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  currentSong: unknown; // TODO: Replace with actual Song type when we develop it
  audioElement?: HTMLAudioElement | null;
}

const AudioVisualizer = ({ isPlaying, currentSong, audioElement }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (!isPlaying || !currentSong) {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    // If no audio element or real audio, show static bars
    if (!audioElement || !audioElement.src || audioElement.src.startsWith('blob:')) {
      const draw = () => {
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        const barCount = 60;
        const barWidth = width / barCount;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Show static bars when no real audio
        for (let i = 0; i < barCount; i++) {
          const barHeight = height * 0.1; // Static low bars
          const x = i * barWidth;
          const y = height - barHeight;

          const gradient = ctx.createLinearGradient(0, height, 0, 0);
          gradient.addColorStop(0, 'hsl(213, 93%, 68%)');
          gradient.addColorStop(0.5, 'hsl(213, 93%, 78%)');
          gradient.addColorStop(1, 'hsl(213, 93%, 88%)');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth - 1, barHeight);
        }

        if (isPlaying && currentSong) {
          animationIdRef.current = requestAnimationFrame(draw);
        }
      };

      draw();
      return;
    }

    // If we have real audio, set up audio analysis
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)(); // TODO: Replace with actual AudioContext type when we develop it
        const source = audioContextRef.current.createMediaElementSource(audioElement);
        analyserRef.current = audioContextRef.current.createAnalyser();
        
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        
        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
      }

      const draw = () => {
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        const barCount = 60;
        const barWidth = width / barCount;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        if (analyserRef.current && dataArrayRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);

          for (let i = 0; i < barCount; i++) {
            const barHeight = (dataArrayRef.current[i] / 255) * height * 0.8;
            const x = i * barWidth;
            const y = height - barHeight;

            const gradient = ctx.createLinearGradient(0, height, 0, 0);
            gradient.addColorStop(0, 'hsl(213, 93%, 68%)');
            gradient.addColorStop(0.5, 'hsl(213, 93%, 78%)');
            gradient.addColorStop(1, 'hsl(213, 93%, 88%)');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth - 1, barHeight);
          }
        }

        if (isPlaying && currentSong) {
          animationIdRef.current = requestAnimationFrame(draw);
        }
      };

      draw();
    } catch (error) {
      console.log('Audio analysis not available, showing static visualization. Error: ', error);
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isPlaying, currentSong, audioElement]);

  if (!isPlaying || !currentSong) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 h-16 bg-gradient-to-t from-player-bg/50 to-transparent pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-60"
        style={{ height: '64px' }}
      />
    </div>
  );
};

export default AudioVisualizer;
