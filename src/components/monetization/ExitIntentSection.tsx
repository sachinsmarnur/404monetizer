import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExitIntent } from "@/types/page";
import { MousePointer, Clock, Gift, AlertTriangle } from "lucide-react";

interface Props {
  settings: ExitIntent;
  onChange: (settings: ExitIntent) => void;
}

export function ExitIntentSection({ settings, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <MousePointer className="h-5 w-5 text-primary" />
          <CardTitle>Exit Intent</CardTitle>
        </div>
        <CardDescription>
          Capture visitors who are about to leave with a compelling last-chance offer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Enable Exit Intent</Label>
            <p className="text-sm text-muted-foreground">
              Show popup when visitors attempt to leave
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(enabled) => onChange({ ...settings, enabled })}
          />
        </div>

        {settings.enabled && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exitIntentTitle">Title</Label>
                <Input
                  id="exitIntentTitle"
                  placeholder="Wait! Don't Leave Yet"
                  value={settings.title}
                  onChange={(e) => onChange({ ...settings, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delaySeconds">Delay (Seconds)</Label>
                <Select
                  value={settings.delaySeconds.toString()}
                  onValueChange={(value) => onChange({ ...settings, delaySeconds: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select delay" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Immediate</SelectItem>
                    <SelectItem value="1">1 Second</SelectItem>
                    <SelectItem value="2">2 Seconds</SelectItem>
                    <SelectItem value="3">3 Seconds</SelectItem>
                    <SelectItem value="5">5 Seconds</SelectItem>
                    <SelectItem value="10">10 Seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exitIntentDescription">Description</Label>
              <Textarea
                id="exitIntentDescription"
                placeholder="We have a special offer just for you..."
                value={settings.description}
                onChange={(e) => onChange({ ...settings, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="offerText">Offer Text</Label>
              <Input
                id="offerText"
                placeholder="Use code SAVE20 at checkout"
                value={settings.offerText}
                onChange={(e) => onChange({ ...settings, offerText: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  placeholder="Claim Offer"
                  value={settings.buttonText}
                  onChange={(e) => onChange({ ...settings, buttonText: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="redirectUrl">Redirect URL</Label>
                <Input
                  id="redirectUrl"
                  placeholder="https://your-store.com/special-offer"
                  type="url"
                  value={settings.redirectUrl}
                  onChange={(e) => onChange({ ...settings, redirectUrl: e.target.value })}
                />
              </div>
            </div>

            {/* Configuration Info */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800">Exit Intent Triggers:</p>
                  <ul className="text-blue-700 mt-1 space-y-1">
                    <li>• Mouse moves toward browser close button</li>
                    <li>• Mouse leaves the top of the page</li>
                    <li>• User attempts to navigate away</li>
                    <li>• After specified delay if no interaction</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 border rounded-lg bg-muted/50">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <MousePointer className="mr-2 h-4 w-4" />
                Preview
              </h4>
              <div className="relative p-4 bg-background border rounded-lg">
                {/* Mock popup overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center mb-4">
                        <Gift className="h-8 w-8 text-primary" />
                      </div>
                      <div className="font-bold text-lg">
                        {settings.title || "Wait! Don't Leave Yet"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {settings.description || "We have a special offer just for you..."}
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="text-sm font-medium text-yellow-800">
                          {settings.offerText || "Use code SAVE20 at checkout"}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium cursor-pointer">
                          {settings.buttonText || "Claim Offer"}
                        </button>
                        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded text-sm cursor-pointer">
                          No Thanks
                        </button>
                      </div>
                      <div className="flex items-center justify-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        Shows after {settings.delaySeconds}s delay
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Background content */}
                <div className="text-center py-12 text-muted-foreground opacity-30">
                  <p className="text-sm">Regular 404 page content</p>
                  <p className="text-xs mt-2">(Exit intent popup will overlay this)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 