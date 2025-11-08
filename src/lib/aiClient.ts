// OpenRouter AI client wrapper using OpenAI SDK
// Provides a parseVoiceCommand function returning a structured object

import OpenAI from "openai";

export interface ParsedCommand {
	item: string;
	state: string;
	room?: string;
	confidence?: number;
}

let client: OpenAI | null = null;

function getClient(): OpenAI | null {
	const key = import.meta.env.VITE_OPENROUTER_KEY as string | undefined;
	if (!key) return null;
	if (!client) {
		client = new OpenAI({
			apiKey: key,
			baseURL: "https://openrouter.ai/api/v1",
			dangerouslyAllowBrowser: true,
		});
	}
	return client;
}

// Available devices in the smart home system
const AVAILABLE_DEVICES = [
	{ name: "Front Light", type: "light", room: "Living Room" },
	{ name: "Thermostat", type: "climate", room: "Living Room" },
	{ name: "Front Door", type: "lock", room: "Entrance" },
	{ name: "Ceiling Fan", type: "fan", room: "Bedroom" },
	{ name: "Smart TV", type: "entertainment", room: "Living Room" },
	{ name: "Smart Speaker", type: "audio", room: "Kitchen" },
	{ name: "Security System", type: "security", room: "House" },
	{ name: "WiFi Router", type: "network", room: "Office" },
];

// System prompt engineered to extract a JSON command from natural language.
const SYSTEM_PROMPT = `You are a home automation command parser. Extract the intent from user voice text and output ONLY compact JSON with keys: item, state, room (optional), confidence (0-1). 

Available devices in the system:
${AVAILABLE_DEVICES.map((d) => `- ${d.name} (${d.type}) in ${d.room}`).join(
	"\n"
)}

Rules:
- item: Must match one of the available device names exactly (case-insensitive matching allowed)
- state: normalized actionable state word (on/off/locked/unlocked/<number>°F/armed/disarmed/connected/disconnected)
- If temperature given without unit assume Fahrenheit and append °F
- room: capitalize words (e.g. Living Room) if a room is mentioned; omit if unknown
- confidence: float 0-1 (one decimal) representing how sure you are
- Only control devices that exist in the available devices list

Return ONLY JSON. No markdown, no explanation.
Examples:
Input: "Turn on the front light" -> {"item":"Front Light","state":"on","room":"Living Room","confidence":0.9}
Input: "set thermostat to 72" -> {"item":"Thermostat","state":"72°F","confidence":0.85}
Input: "lock the front door" -> {"item":"Front Door","state":"locked","confidence":0.9}
Input: "turn on the ceiling fan" -> {"item":"Ceiling Fan","state":"on","room":"Bedroom","confidence":0.9}
`;

export async function parseVoiceCommand(
	transcript: string
): Promise<ParsedCommand> {
	const api = getClient();
	if (!api) throw new Error("Missing OpenRouter key (VITE_OPENROUTER_KEY).");

	// Using Gemini 2.0 Flash via OpenRouter
	const model =
		import.meta.env.VITE_OPENROUTER_MODEL || "deepseek/deepseek-r1-0528:free";

	try {
		const response = await api.chat.completions.create({
			model,
			messages: [
				{ role: "system", content: SYSTEM_PROMPT },
				{ role: "user", content: transcript },
			],
			temperature: 0.2,
			max_tokens: 120,
		});

		const content = response.choices?.[0]?.message?.content;
		if (!content) throw new Error("Empty AI response");

		// Attempt to parse JSON from content (strip any fences just in case)
		const jsonMatch = content.match(/\{[\s\S]*\}/);
		if (!jsonMatch) throw new Error("No JSON object found in AI output");
		const parsed = JSON.parse(jsonMatch[0]);

		// Basic validation / normalization
		if (!parsed.item || !parsed.state)
			throw new Error("AI JSON missing required fields");
		return {
			item: String(parsed.item),
			state: String(parsed.state),
			room: parsed.room ? String(parsed.room) : undefined,
			confidence:
				typeof parsed.confidence === "number" ? parsed.confidence : undefined,
		};
	} catch (err: any) {
		throw new Error(err?.message || "AI parsing failed");
	}
}
