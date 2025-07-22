
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Settings as SettingsIcon } from 'lucide-react';

interface EqualizerBand {
  frequency: string;
  gain: number;
}

const Settings = () => {
  const [open, setOpen] = useState(false);
  const [equalizerBands, setEqualizerBands] = useState<EqualizerBand[]>([
    { frequency: '60Hz', gain: 0 },
    { frequency: '170Hz', gain: 0 },
    { frequency: '310Hz', gain: 0 },
    { frequency: '600Hz', gain: 0 },
    { frequency: '1kHz', gain: 0 },
    { frequency: '3kHz', gain: 0 },
    { frequency: '6kHz', gain: 0 },
    { frequency: '12kHz', gain: 0 },
    { frequency: '14kHz', gain: 0 },
    { frequency: '16kHz', gain: 0 },
  ]);

  const handleBandChange = (index: number, value: number[]) => {
    const newBands = [...equalizerBands];
    newBands[index].gain = value[0];
    setEqualizerBands(newBands);
  };

  const resetEqualizer = () => {
    setEqualizerBands(bands => bands.map(band => ({ ...band, gain: 0 })));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <SettingsIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Audio Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Audio Equalizer</h3>
              <Button variant="outline" size="sm" onClick={resetEqualizer}>
                Reset
              </Button>
            </div>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
              {equalizerBands.map((band, index) => (
                <div key={band.frequency} className="flex flex-col items-center space-y-2">
                  <div className="h-32 flex items-end">
                    <Slider
                      orientation="vertical"
                      value={[band.gain]}
                      onValueChange={(value) => handleBandChange(index, value)}
                      min={-12}
                      max={12}
                      step={0.5}
                      className="h-28"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    {band.frequency}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {band.gain > 0 ? '+' : ''}{band.gain}dB
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
