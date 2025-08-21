import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Thermometer, 
  Lock, 
  Fan,
  Tv,
  Music,
  Shield,
  Wifi
} from "lucide-react";

interface Device {
  id: string;
  name: string;
  type: string;
  state: string;
  room: string;
  icon: React.ComponentType<any>;
}

interface DeviceCardProps {
  device: Device;
  isActive?: boolean;
}

export const DeviceCard = ({ device, isActive = false }: DeviceCardProps) => {
  const IconComponent = device.icon;
  
  const getStateColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'on':
      case 'unlocked':
      case 'connected':
        return 'bg-voice-active text-black';
      case 'off':
      case 'locked':
      case 'disconnected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className={`
      p-4 bg-gradient-card border-border transition-all duration-300
      hover:shadow-glow hover:border-primary/50
      ${isActive ? 'shadow-glow border-primary animate-pulse-voice' : ''}
    `}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`
            p-2 rounded-lg transition-colors duration-300
            ${isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary'}
          `}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{device.name}</h3>
            <p className="text-sm text-muted-foreground">{device.room}</p>
          </div>
        </div>
        
        <Badge 
          variant="secondary" 
          className={`${getStateColor(device.state)} text-xs font-medium`}
        >
          {device.state}
        </Badge>
      </div>
    </Card>
  );
};

// Mock smart home devices
export const mockDevices: Device[] = [
  {
    id: '1',
    name: 'Front Light',
    type: 'light',
    state: 'off',
    room: 'Living Room',
    icon: Lightbulb
  },
  {
    id: '2',
    name: 'Thermostat',
    type: 'climate',
    state: '72°F',
    room: 'Living Room',
    icon: Thermometer
  },
  {
    id: '3',
    name: 'Front Door',
    type: 'lock',
    state: 'locked',
    room: 'Entrance',
    icon: Lock
  },
  {
    id: '4',
    name: 'Ceiling Fan',
    type: 'fan',
    state: 'on',
    room: 'Bedroom',
    icon: Fan
  },
  {
    id: '5',
    name: 'Smart TV',
    type: 'entertainment',
    state: 'off',
    room: 'Living Room',
    icon: Tv
  },
  {
    id: '6',
    name: 'Smart Speaker',
    type: 'audio',
    state: 'on',
    room: 'Kitchen',
    icon: Music
  },
  {
    id: '7',
    name: 'Security System',
    type: 'security',
    state: 'armed',
    room: 'House',
    icon: Shield
  },
  {
    id: '8',
    name: 'WiFi Router',
    type: 'network',
    state: 'connected',
    room: 'Office',
    icon: Wifi
  }
];