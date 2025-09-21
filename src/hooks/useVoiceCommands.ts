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
			console.log(import.meta.env.VITE_OPENROUTER_KEY);
			const hasKey = Boolean(import.meta.env.VITE_OPENROUTER_KEY);
			let response: ParsedCommand;
			if (hasKey) {
				try {
					response = (await parseVoiceCommand(transcript)) as AIParsedCommand;
				} catch (aiError) {
					// Fallback to local simulation if AI call fails
					console.warn(
						"AI parsing failed, falling back to local simulation:",
						aiError
					);
					response = await simulateAIProcessing(transcript);
				}
			} else {
				response = await simulateAIProcessing(transcript);
			}

			setLastResult({
				originalText: transcript,
				parsedCommand: response,
			});

			// After successful parsing, attempt to call the device endpoint
			try {
				const base =
					import.meta.env.VITE_DEVICE_API_BASE || "http://192.168.0.3:8000";
				// Normalize item/state for path (remove spaces, capitalize words joined by '-')
				const pathItem = response.item.replace(/\s+/g, "-");
				// Keep state as-is but capitalize first letter for consistency in path
				const pathState = response.state.replace(/\s+/g, "-");
				const url = `${base.replace(/\/$/, "")}/${encodeURIComponent(
					pathItem
				)}/${encodeURIComponent(pathState)}`;
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
						toast({
							title: "Device Call Failed",
							description: String(err.message || err),
							variant: "destructive",
						});
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

// Simulate AI processing with realistic parsing (fallback when key absent or network errors)
const simulateAIProcessing = async (text: string): Promise<ParsedCommand> => {
	// Simulate network delay
	await new Promise((resolve) =>
		setTimeout(resolve, 1000 + Math.random() * 1500)
	);

	const lowerText = text.toLowerCase();

	// Simple pattern matching to simulate AI parsing
	const patterns = [
		{
			pattern: /turn (on|off) (?:the )?(.+)/,
			extract: (match: RegExpMatchArray): Omit<ParsedCommand, "room"> => ({
				item: capitalizeWords(match[2]),
				state: match[1],
				confidence: 0.9,
			}),
		},
		{
			pattern:
				/set (?:the )?(.+?) (?:to )?(\d+(?:\.\d+)?)\s*(?:degrees?|°f?|°c?)?/,
			extract: (match: RegExpMatchArray): Omit<ParsedCommand, "room"> => ({
				item: capitalizeWords(match[1]),
				state: `${match[2]}°F`,
				confidence: 0.85,
			}),
		},
		{
			pattern: /(lock|unlock) (?:the )?(.+)/,
			extract: (match: RegExpMatchArray): Omit<ParsedCommand, "room"> => ({
				item: capitalizeWords(match[2]),
				state: match[1] + "ed",
				confidence: 0.9,
			}),
		},
		{
			pattern: /(start|stop|play|pause) (?:the )?(.+)/,
			extract: (match: RegExpMatchArray): Omit<ParsedCommand, "room"> => ({
				item: capitalizeWords(match[2]),
				state: match[1] === "start" || match[1] === "play" ? "on" : "off",
				confidence: 0.8,
			}),
		},
	];

	for (const { pattern, extract } of patterns) {
		const match = lowerText.match(pattern);
		if (match) {
			const result: ParsedCommand = { ...extract(match) };

			// Add room detection
			const roomPatterns = [
				{ pattern: /living room|lounge/, room: "Living Room" },
				{ pattern: /bedroom|bed room/, room: "Bedroom" },
				{ pattern: /kitchen/, room: "Kitchen" },
				{ pattern: /bathroom|bath room/, room: "Bathroom" },
				{ pattern: /office|study/, room: "Office" },
				{ pattern: /entrance|front door/, room: "Entrance" },
			];

			for (const { pattern: roomPattern, room } of roomPatterns) {
				if (lowerText.match(roomPattern)) {
					result.room = room;
					break;
				}
			}

			return result;
		}
	}

	// Fallback for unrecognized commands
	throw new Error("Could not parse the voice command. Please try rephrasing.");
};

const capitalizeWords = (str: string): string => {
	return str
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};
