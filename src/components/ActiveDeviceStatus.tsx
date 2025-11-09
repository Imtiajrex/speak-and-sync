import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeviceCard } from "@/components/DeviceCard";
import { Device } from "@/hooks/useDevices";
import { Activity } from "lucide-react";

interface ActiveDeviceStatusProps {
	activeDevice: Device | null | undefined;
	isLoading?: boolean;
}

export const ActiveDeviceStatus = ({
	activeDevice,
	isLoading,
}: ActiveDeviceStatusProps) => {
	if (isLoading) {
		return (
			<Card className="p-4 bg-gradient-card border-border">
				<div className="flex items-center space-x-2">
					<Activity className="w-4 h-4 animate-pulse" />
					<span className="text-sm text-muted-foreground">
						Checking active device...
					</span>
				</div>
			</Card>
		);
	}

	if (!activeDevice) {
		return (
			<Card className="p-4 bg-gradient-card border-border">
				<div className="flex items-center space-x-2">
					<Activity className="w-4 h-4 text-muted-foreground" />
					<span className="text-sm text-muted-foreground">
						No active device
					</span>
				</div>
			</Card>
		);
	}

	return (
		<Card className="p-4 bg-gradient-card border-border">
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center space-x-2">
					<Activity className="w-4 h-4 text-primary" />
					<span className="text-sm font-medium">Active Device</span>
				</div>
				<Badge variant="secondary" className="text-xs">
					Live Status
				</Badge>
			</div>
			<DeviceCard device={activeDevice} isActive={true} />
		</Card>
	);
};
