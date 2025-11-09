import {
	Lightbulb,
	Thermometer,
	Lock,
	Fan,
	Tv,
	Music,
	Shield,
	Wifi,
	LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
	light: Lightbulb,
	climate: Thermometer,
	lock: Lock,
	fan: Fan,
	entertainment: Tv,
	audio: Music,
	security: Shield,
	network: Wifi,
};

export const getDeviceIcon = (type: string): LucideIcon => {
	return iconMap[type] || Lightbulb; // Default to Lightbulb if type not found
};
