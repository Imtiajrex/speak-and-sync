import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  isProcessing: boolean;
}

export const VoiceRecorder = ({ onTranscript, isProcessing }: VoiceRecorderProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please try Chrome or Safari.",
        variant: "destructive",
      });
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptSegment;
        } else {
          interimTranscript += transcriptSegment;
        }
      }

      setTranscript(finalTranscript + interimTranscript);
      
      if (finalTranscript) {
        onTranscript(finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: "Voice Recognition Error",
        description: "There was an error with voice recognition. Please try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onTranscript, toast]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Voice Button */}
      <div className="relative">
        <Button
          variant={isListening ? "default" : "secondary"}
          size="lg"
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`
            relative w-24 h-24 rounded-full bg-gradient-card border-2 border-border
            hover:shadow-glow transition-all duration-300 group
            ${isListening ? 'shadow-voice animate-pulse-voice' : ''}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isProcessing ? (
            <Volume2 className="w-8 h-8 text-primary animate-pulse" />
          ) : isListening ? (
            <Mic className="w-8 h-8 text-voice-active" />
          ) : (
            <MicOff className="w-8 h-8 text-voice-inactive" />
          )}
          
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-gradient-voice animate-ripple opacity-30" />
              <div className="absolute inset-0 rounded-full bg-gradient-voice animate-ripple opacity-20" style={{ animationDelay: '0.5s' }} />
            </>
          )}
        </Button>
        
        <div className={`
          absolute -bottom-2 left-1/2 transform -translate-x-1/2 
          px-3 py-1 rounded-full text-xs font-medium transition-all duration-300
          ${isListening ? 'bg-voice-active text-black' : 'bg-muted text-muted-foreground'}
        `}>
          {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'Tap to speak'}
        </div>
      </div>

      {/* Live Transcript */}
      {transcript && (
        <Card className="w-full max-w-md p-4 bg-gradient-card border-border animate-fade-in-up">
          <div className="flex items-start space-x-2">
            <Volume2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground mb-1">You said:</p>
              <p className="text-foreground font-medium">{transcript}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Instructions */}
      <div className="text-center space-y-2 max-w-sm">
        <p className="text-sm text-muted-foreground">
          Try saying: "Turn off the front light" or "Set living room temperature to 72"
        </p>
      </div>
    </div>
  );
};