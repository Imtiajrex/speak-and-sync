import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Device {
	id: string;
	name: string;
	type: string;
	state: string;
	room: string;
}

const API_BASE = "http://192.168.0.3:8000";

// Fetch all devices
export const useDevices = () => {
	return useQuery({
		queryKey: ["devices"],
		queryFn: async (): Promise<Device[]> => {
			const response = await fetch(`${API_BASE}/devices`);
			if (!response.ok) {
				throw new Error("Failed to fetch devices");
			}
			return response.json();
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
			const response = await fetch(`${API_BASE}/active-device`);
			if (!response.ok) {
				if (response.status === 404) {
					return null; // No active device
				}
				throw new Error("Failed to fetch active device");
			}
			return response.json();
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
			const response = await fetch(
				`${API_BASE}/devices/${deviceId}/${action}`,
				{
					method: "POST",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to control device");
			}
			return response.json();
		},
		onSuccess: () => {
			// Invalidate and refetch devices and active device queries
			queryClient.invalidateQueries({ queryKey: ["devices"] });
			queryClient.invalidateQueries({ queryKey: ["active-device"] });
		},
	});
};
