import { useState } from "react";
import { Header } from "@/components/Header";
import { VoiceInterface } from "@/components/VoiceInterface";
import { DevicesGrid } from "@/components/DevicesGrid";
import { ActiveDeviceStatus } from "@/components/ActiveDeviceStatus";
import { ExampleCommands } from "@/components/ExampleCommands";
import { Footer } from "@/components/Footer";
import { CommandResult } from "@/components/CommandResult";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";
import { useDevices, useActiveDevice } from "@/hooks/useDevices";

const Index = () => {
	const { processCommand, isProcessing, lastResult } = useVoiceCommands();
	const {
		data: devices = [],
		isLoading: devicesLoading,
		error: devicesError,
	} = useDevices();
	const { data: activeDevice, isLoading: activeDeviceLoading } =
		useActiveDevice();
	const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);

	const handleTranscript = (transcript: string) => {
		processCommand(transcript);

		// Highlight matching device for demo
		const matchingDevice = devices.find(
			(device) =>
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
			<Header />

			{/* Main Content */}
			<main className="container mx-auto px-4 py-8">
				<div className="max-w-6xl mx-auto space-y-8">
					{/* Voice Interface Section */}
					<VoiceInterface
						onTranscript={handleTranscript}
						isProcessing={isProcessing}
					/>

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

					{/* Active Device Status */}
					<ActiveDeviceStatus
						activeDevice={activeDevice}
						isLoading={activeDeviceLoading}
					/>

					{/* Devices Grid */}
					<DevicesGrid
						devices={devices}
						activeDeviceId={activeDeviceId}
						isLoading={devicesLoading}
						error={devicesError}
					/>

					{/* Example Commands */}
					<ExampleCommands />
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default Index;
