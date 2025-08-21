import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface ParsedCommand {
  item: string;
  state: string;
  room?: string;
  confidence?: number;
}

interface CommandResultProps {
  originalText: string;
  parsedCommand: ParsedCommand | null;
  isProcessing: boolean;
  error?: string;
}

export const CommandResult = ({ 
  originalText, 
  parsedCommand, 
  isProcessing, 
  error 
}: CommandResultProps) => {
  if (!originalText && !isProcessing) return null;

  return (
    <Card className="w-full max-w-md p-4 bg-gradient-card border-border animate-fade-in-up">
      <div className="space-y-3">
        {/* Original Command */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="outline" className="text-xs">
              Original Command
            </Badge>
          </div>
          <p className="text-sm text-foreground bg-muted/50 p-2 rounded">{originalText}</p>
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="flex items-center space-x-2 py-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Processing with AI...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-start space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">Processing Error</p>
              <p className="text-xs text-destructive/80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Parsed Result */}
        {parsedCommand && !isProcessing && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-voice-active" />
              <Badge variant="secondary" className="text-xs bg-voice-active/20 text-voice-active border-voice-active/30">
                Parsed Successfully
              </Badge>
            </div>
            
            <div className="bg-secondary/50 p-3 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Device</p>
                  <p className="font-medium text-sm text-foreground">{parsedCommand.item}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Action</p>
                  <p className="font-medium text-sm text-foreground">{parsedCommand.state}</p>
                </div>
              </div>
              
              {parsedCommand.room && (
                <div>
                  <p className="text-xs text-muted-foreground">Room</p>
                  <p className="font-medium text-sm text-foreground">{parsedCommand.room}</p>
                </div>
              )}
              
              {parsedCommand.confidence && (
                <div>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${parsedCommand.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(parsedCommand.confidence * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};