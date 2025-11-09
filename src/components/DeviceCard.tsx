import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDeviceIcon } from "@/lib/deviceIcons";

interface Device {
	id: string;
	name: string;
	type: string;
	state: string;
	room: string;
}

interface DeviceCardProps {
	device: Device;
	isActive?: boolean;
}

export const DeviceCard = ({ device, isActive = false }: DeviceCardProps) => {
	const IconComponent = getDeviceIcon(device.type);

	const getStateColor = (state: string) => {
		switch (state.toLowerCase()) {
			case "on":
			case "unlocked":
			case "connected":
				return "bg-voice-active text-black";
			case "off":
			case "locked":
			case "disconnected":
				return "bg-destructive text-destructive-foreground";
			default:
				return "bg-secondary text-secondary-foreground";
		}
	};

	return (
		<Card
			className={`
      p-4 bg-gradient-card border-border transition-all duration-300
      hover:shadow-glow hover:border-primary/50
      ${isActive ? "shadow-glow border-primary animate-pulse-voice" : ""}
    `}
		>
			<div className="flex items-start justify-between">
				<div className="flex items-center space-x-3">
					<div
						className={`
            p-2 rounded-lg transition-colors duration-300
            ${isActive ? "bg-primary text-primary-foreground" : "bg-secondary"}
          `}
					>
						<IconComponent className="w-5 h-5" />
					</div>
					<div>
						<h3 className="font-medium text-foreground">{device.name}</h3>
						<p className="text-sm text-muted-foreground">{device.room}</p>
					</div>
				</div>

				<Badge
					variant="secondary"
					className={`${getStateColor(device.state)} text-xs font-medium`}
				>
					{device.state}
				</Badge>
			</div>
		</Card>
	);
};
