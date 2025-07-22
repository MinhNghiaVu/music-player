
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Music, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ImportSongsProps {
  onImport: (files: File[]) => void;
}

const ImportSongs = ({ onImport }: ImportSongsProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.flac', '.ogg', '.m4a']
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleImport = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          onImport(selectedFiles);
          setSelectedFiles([]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Import Your Music</h2>
        <p className="text-muted-foreground">
          Upload your favorite songs to build your personal library
        </p>
      </div>

      <Card className="p-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/10'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">
            {isDragActive ? 'Drop your music files here' : 'Drag & drop music files'}
          </p>
          <p className="text-muted-foreground mb-4">
            or click to browse your computer
          </p>
          <p className="text-sm text-muted-foreground">
            Supports MP3, WAV, FLAC, OGG, M4A
          </p>
        </div>
      </Card>

      {selectedFiles.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Selected Files ({selectedFiles.length})
          </h3>
          <div className="space-y-2 mb-6">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <Music className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFile(index)}
                  className="w-6 h-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {uploading && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          <Button 
            onClick={handleImport} 
            disabled={uploading}
            className="w-full"
          >
            {uploading ? 'Uploading...' : `Import ${selectedFiles.length} Song${selectedFiles.length > 1 ? 's' : ''}`}
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ImportSongs;
