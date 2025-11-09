import { Badge } from "@/components/ui/badge";
import { Home, Smartphone } from "lucide-react";

export const Header = () => {
	return (
		<header className="bg-gradient-card border-b border-border">
			<div className="container mx-auto px-4 py-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="p-2 bg-primary rounded-lg">
							<Home className="w-6 h-6 text-primary-foreground" />
						</div>
						<div>
							<h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
								Smart Home Voice Control
							</h1>
							<p className="text-sm text-muted-foreground">
								Control your devices with voice commands
							</p>
						</div>
					</div>

					<div className="flex items-center space-x-2">
						<Badge
							variant="secondary"
							className="bg-voice-active/20 text-voice-active border-voice-active/30"
						>
							<Smartphone className="w-3 h-3 mr-1" />
							Mobile Ready
						</Badge>
					</div>
				</div>
			</div>
		</header>
	);
};
