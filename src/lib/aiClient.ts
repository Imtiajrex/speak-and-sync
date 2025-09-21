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

// System prompt engineered to extract a JSON command from natural language.
const SYSTEM_PROMPT = `You are a home automation command parser. Extract the intent from user voice text and output ONLY compact JSON with keys: item, state, room (optional), confidence (0-1). Rules:
- item: concise device/appliance/entity name (no adjectives unless essential)
- state: normalized actionable state word (on/off/locked/unlocked/<number>°F)
- If temperature given without unit assume Fahrenheit and append °F
- room: capitalize words (e.g. Living Room) if a room is mentioned; omit if unknown
- confidence: float 0-1 (one decimal) representing how sure you are
Return ONLY JSON. No markdown, no explanation.
Examples:
Input: "Turn on the living room lights" -> {"item":"Lights","state":"on","room":"Living Room","confidence":0.9}
Input: "set thermostat to 72" -> {"item":"Thermostat","state":"72°F","confidence":0.85}
Input: "lock the front door" -> {"item":"Front Door","state":"locked","confidence":0.9}
`;

export async function parseVoiceCommand(
	transcript: string
): Promise<ParsedCommand> {
	const api = getClient();
	if (!api) throw new Error("Missing OpenRouter key (VITE_OPENROUTER_KEY).");

	// Using responses API for model-agnostic interface
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
