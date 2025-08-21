import { useState } from "react";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { DeviceCard, mockDevices } from "@/components/DeviceCard";
import { CommandResult } from "@/components/CommandResult";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Smartphone, Mic2 } from "lucide-react";

const Index = () => {
  const { processCommand, isProcessing, lastResult } = useVoiceCommands();
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);

  const handleTranscript = (transcript: string) => {
    processCommand(transcript);
    
    // Highlight matching device for demo
    const matchingDevice = mockDevices.find(device => 
      transcript.toLowerCase().includes(device.name.toLowerCase()) ||
      transcript.toLowerCase().includes(device.type.toLowerCase())
    );
    
    if (matchingDevice) {
      setActiveDeviceId(matchingDevice.id);
      setTimeout(() => setActiveDeviceId(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <Home className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Smart Home Voice Control
                </h1>
                <p className="text-sm text-muted-foreground">Control your devices with voice commands</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-voice-active/20 text-voice-active border-voice-active/30">
                <Smartphone className="w-3 h-3 mr-1" />
                Mobile Ready
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Voice Interface Section */}
          <Card className="p-8 bg-gradient-card border-border text-center">
            <div className="flex items-center justify-center mb-4">
              <Mic2 className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Voice Command Center</h2>
            </div>
            
            <VoiceRecorder 
              onTranscript={handleTranscript}
              isProcessing={isProcessing}
            />
          </Card>

          {/* Command Result */}
          {lastResult && (
            <div className="flex justify-center">
              <CommandResult
                originalText={lastResult.originalText}
                parsedCommand={lastResult.parsedCommand}
                isProcessing={isProcessing}
                error={lastResult.error}
              />
            </div>
          )}

          {/* Devices Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Connected Devices</h2>
              <Badge variant="outline" className="text-xs">
                {mockDevices.length} devices
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mockDevices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  isActive={activeDeviceId === device.id}
                />
              ))}
            </div>
          </div>

          {/* Example Commands */}
          <Card className="p-6 bg-gradient-card border-border">
            <h3 className="text-lg font-semibold mb-4">Try These Voice Commands</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-primary">Lighting Control</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>"Turn on the front light"</li>
                  <li>"Turn off the bedroom ceiling fan"</li>
                  <li>"Start the smart TV"</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-primary">Temperature & Security</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>"Set thermostat to 72 degrees"</li>
                  <li>"Lock the front door"</li>
                  <li>"Play music on smart speaker"</li>
                </ul>
              </div>
            </div>
          </Card>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-card border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built with React • Ready for mobile with Capacitor
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
