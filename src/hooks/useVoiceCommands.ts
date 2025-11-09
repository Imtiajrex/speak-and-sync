import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
	parseVoiceCommand,
	ParsedCommand as AIParsedCommand,
} from "@/lib/aiClient";

interface ParsedCommand {
	item: string;
	state: string;
	room?: string;
	confidence?: number;
}

export const useVoiceCommands = () => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [lastResult, setLastResult] = useState<{
		originalText: string;
		parsedCommand: ParsedCommand | null;
		error?: string;
	} | null>(null);
	const { toast } = useToast();

	const processCommand = async (transcript: string): Promise<void> => {
		setIsProcessing(true);
		setLastResult({
			originalText: transcript,
			parsedCommand: null,
		});

		try {
			let response: ParsedCommand;
			try {
				response = (await parseVoiceCommand(transcript)) as AIParsedCommand;
			} catch (aiError) {
				// Fallback to local simulation if AI call fails
				console.warn(
					"AI parsing failed, falling back to local simulation:",
					aiError
				);
			}
			setLastResult({
				originalText: transcript,
				parsedCommand: response,
			});

			// After successful parsing, attempt to call the device endpoint
			try {
				const base =
					import.meta.env.VITE_DEVICE_API_BASE || "http://192.168.237.74";
				console.log(response);
				// Format: /LED1=ON or /LED2=OFF
				const deviceName = response.item.toUpperCase();
				const deviceState = response.state.toUpperCase();
				const url = `${base.replace(/\/$/, "")}/${deviceName}=${deviceState}`;
				fetch(url)
					.then((res) => {
						if (!res.ok) throw new Error(`Device call failed (${res.status})`);
						return res.text();
					})
					.then((body) => {
						console.log("Device response:", body);
						toast({
							title: "Device Updated",
							description: `${response.item} -> ${response.state}`,
						});
					})
					.catch((err) => {
						console.warn("Device call error:", err);
						// toast({
						// 	title: "Device Call Failed",
						// 	description: String(err.message || err),
						// 	variant: "destructive",
						// });
					});
			} catch (deviceErr) {
				console.warn("Device call setup error:", deviceErr);
			}

			toast({
				title: "Command Processed",
				description: `${response.item} → ${response.state}`,
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error occurred";
			setLastResult({
				originalText: transcript,
				parsedCommand: null,
				error: errorMessage,
			});

			toast({
				title: "Processing Failed",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsProcessing(false);
		}
	};

	return {
		processCommand,
		isProcessing,
		lastResult,
	};
};
