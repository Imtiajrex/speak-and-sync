import { Card } from "@/components/ui/card";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { Mic2 } from "lucide-react";

interface VoiceInterfaceProps {
	onTranscript: (transcript: string) => void;
	isProcessing: boolean;
}

export const VoiceInterface = ({
	onTranscript,
	isProcessing,
}: VoiceInterfaceProps) => {
	return (
		<Card className="p-8 bg-gradient-card border-border text-center">
			<div className="flex items-center justify-center mb-4">
				<Mic2 className="w-6 h-6 text-primary mr-2" />
				<h2 className="text-xl font-semibold">Voice Command Center</h2>
			</div>

			<VoiceRecorder onTranscript={onTranscript} isProcessing={isProcessing} />
		</Card>
	);
};
