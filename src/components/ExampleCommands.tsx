import { Card } from "@/components/ui/card";

export const ExampleCommands = () => {
	return (
		<Card className="p-6 bg-gradient-card border-border">
			<h3 className="text-lg font-semibold mb-4">Try These Voice Commands</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<h4 className="font-medium text-primary">Lighting Control</h4>
					<ul className="text-sm text-muted-foreground space-y-1">
						<li>"Turn on the front light"</li>
						<li>"Turn off the bedroom ceiling fan"</li>
						<li>"Start the smart TV"</li>
					</ul>
				</div>
				<div className="space-y-2">
					<h4 className="font-medium text-primary">Temperature & Security</h4>
					<ul className="text-sm text-muted-foreground space-y-1">
						<li>"Set thermostat to 72 degrees"</li>
						<li>"Lock the front door"</li>
						<li>"Play music on smart speaker"</li>
					</ul>
				</div>
			</div>
		</Card>
	);
};
