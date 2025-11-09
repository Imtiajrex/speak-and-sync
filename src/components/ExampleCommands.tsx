import { Card } from "@/components/ui/card";

export const ExampleCommands = () => {
	return (
		<Card className="p-6 bg-gradient-card border-border">
			<h3 className="text-lg font-semibold mb-4">Try These Voice Commands</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<h4 className="font-medium text-primary">LED Control</h4>
					<ul className="text-sm text-muted-foreground space-y-1">
						<li>"Turn on LED1"</li>
						<li>"Turn off LED2"</li>
						<li>"Turn on LED3"</li>
					</ul>
				</div>
				<div className="space-y-2">
					<h4 className="font-medium text-primary">Multiple LEDs</h4>
					<ul className="text-sm text-muted-foreground space-y-1">
						<li>"Turn on all LEDs"</li>
						<li>"Turn off LED1 and LED3"</li>
						<li>"Toggle LED2"</li>
					</ul>
				</div>
			</div>
		</Card>
	);
};
