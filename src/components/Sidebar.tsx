
import { Home, Music, Heart, Download } from 'lucide-react';
import { Collection } from '@/types/ICollection';
import CreatePlaylistDialog from './CreatePlaylistDialog';
import Settings from './Settings';

interface SidebarProps {
  collections: Collection[];
  onCreateCollection: (name: string, description?: string) => void;
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar = ({ collections, onCreateCollection, activeView, onViewChange }: SidebarProps) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'library', label: 'Your Library', icon: Music },
    { id: 'liked', label: 'Liked Songs', icon: Heart },
    { id: 'import', label: 'Import Songs', icon: Download },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">MusicStream</h1>
        <Settings />
      </div>
      
      <nav className="flex-1 px-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeView === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Playlists
            </h3>
            <CreatePlaylistDialog onCreatePlaylist={onCreateCollection} />
          </div>
          
          <div className="space-y-1">
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => onViewChange(`collection-${collection.id}`)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors truncate ${
                  activeView === `collection-${collection.id}`
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {collection.name}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
