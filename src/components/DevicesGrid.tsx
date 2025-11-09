import { Badge } from "@/components/ui/badge";
import { DeviceCard } from "@/components/DeviceCard";
import { Device } from "@/hooks/useDevices";

interface DevicesGridProps {
	devices: Device[];
	activeDeviceId?: string | null;
	isLoading?: boolean;
	error?: Error | null;
}

export const DevicesGrid = ({
	devices,
	activeDeviceId,
	isLoading,
	error,
}: DevicesGridProps) => {
	if (isLoading) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">Loading devices...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-destructive">
					Error loading devices: {error.message}
				</p>
			</div>
		);
	}

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-semibold">Connected Devices</h2>
				<Badge variant="outline" className="text-xs">
					{devices.length} devices
				</Badge>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{devices.map((device) => (
					<DeviceCard
						key={device.id}
						device={device}
						isActive={activeDeviceId === device.id}
					/>
				))}
			</div>
		</div>
	);
};
