import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Device {
	id: string;
	name: string;
	type: string;
	state: string;
	room: string;
}

const API_BASE = "http://192.168.237.74";

// Fetch all devices
export const useDevices = () => {
	return useQuery({
		queryKey: ["devices"],
		queryFn: async (): Promise<Device[]> => {
			// For now, return mock data since fetch endpoint format is unknown
			// TODO: Update when device fetch endpoint is provided
			return [
				{
					id: "LED1",
					name: "LED1",
					type: "light",
					state: "unknown",
					room: "Main",
				},
				{
					id: "LED2",
					name: "LED2",
					type: "light",
					state: "unknown",
					room: "Main",
				},
				{
					id: "LED3",
					name: "LED3",
					type: "light",
					state: "unknown",
					room: "Main",
				},
			];
		},
		staleTime: 30000, // Consider data fresh for 30 seconds
		refetchInterval: 60000, // Refetch every minute
	});
};

// Fetch active device state
export const useActiveDevice = () => {
	return useQuery({
		queryKey: ["active-device"],
		queryFn: async (): Promise<Device | null> => {
			// For now, return null since active device endpoint format is unknown
			// TODO: Update when active device endpoint is provided
			return null;
		},
		staleTime: 10000, // Consider data fresh for 10 seconds
		refetchInterval: 15000, // Refetch every 15 seconds
	});
};

// Control device (mutation)
export const useControlDevice = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			deviceId,
			action,
		}: {
			deviceId: string;
			action: string;
		}) => {
			// Format: /LED1=ON or /LED2=OFF
			const deviceName = deviceId.toUpperCase();
			const deviceState = action.toUpperCase();
			const response = await fetch(`${API_BASE}/${deviceName}=${deviceState}`);
			if (!response.ok) {
				throw new Error("Failed to control device");
			}
			return response.text();
		},
		onSuccess: () => {
			// Invalidate and refetch devices and active device queries
			queryClient.invalidateQueries({ queryKey: ["devices"] });
			queryClient.invalidateQueries({ queryKey: ["active-device"] });
		},
	});
};
