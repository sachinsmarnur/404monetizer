import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeadMagnet } from "@/types/page";
import { Gift, Download, FileText, BookOpen, Palette } from "lucide-react";

interface Props {
  settings: LeadMagnet;
  onChange: (settings: LeadMagnet) => void;
}

const fileTypeIcons = {
  pdf: FileText,
  ebook: BookOpen,
  template: Palette,
  other: Download
};

export function LeadMagnetSection({ settings, onChange }: Props) {
  const FileIcon = fileTypeIcons[settings.fileType] || Download;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Gift className="h-5 w-5 text-primary" />
          <CardTitle>Lead Magnet</CardTitle>
        </div>
        <CardDescription>
          Offer a free download in exchange for email addresses. Perfect for building your email list.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Enable Lead Magnet</Label>
            <p className="text-sm text-muted-foreground">
              Offer valuable content to capture leads
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
                <Label htmlFor="leadMagnetTitle">Title</Label>
                <Input
                  id="leadMagnetTitle"
                  placeholder="Get Our Free Guide"
                  value={settings.title}
                  onChange={(e) => onChange({ ...settings, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fileType">File Type</Label>
                <Select
                  value={settings.fileType}
                  onValueChange={(value: LeadMagnet['fileType']) => onChange({ ...settings, fileType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        PDF Document
                      </div>
                    </SelectItem>
                    <SelectItem value="ebook">
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4" />
                        E-book
                      </div>
                    </SelectItem>
                    <SelectItem value="template">
                      <div className="flex items-center">
                        <Palette className="mr-2 h-4 w-4" />
                        Template
                      </div>
                    </SelectItem>
                    <SelectItem value="other">
                      <div className="flex items-center">
                        <Download className="mr-2 h-4 w-4" />
                        Other
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadMagnetDescription">Description</Label>
              <Textarea
                id="leadMagnetDescription"
                placeholder="Describe what users will get and why it's valuable..."
                value={settings.description}
                onChange={(e) => onChange({ ...settings, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUrl">Download URL</Label>
              <Input
                id="fileUrl"
                placeholder="https://example.com/download-link"
                value={settings.fileUrl}
                onChange={(e) => onChange({ ...settings, fileUrl: e.target.value })}
                type="url"
              />
              <p className="text-xs text-muted-foreground">
                Direct link to your file (Google Drive, Dropbox, or your server)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  placeholder="Download Now"
                  value={settings.buttonText}
                  onChange={(e) => onChange({ ...settings, buttonText: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailPlaceholder">Email Placeholder</Label>
                <Input
                  id="emailPlaceholder"
                  placeholder="Enter your email"
                  value={settings.emailPlaceholder}
                  onChange={(e) => onChange({ ...settings, emailPlaceholder: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="successMessage">Success Message</Label>
              <Input
                id="successMessage"
                placeholder="Check your email for the download link!"
                value={settings.successMessage}
                onChange={(e) => onChange({ ...settings, successMessage: e.target.value })}
              />
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 border rounded-lg bg-muted/50">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <FileIcon className="mr-2 h-4 w-4" />
                Preview
              </h4>
              <div className="space-y-2 text-sm">
                <div className="font-medium">{settings.title || "Lead Magnet Title"}</div>
                <div className="text-muted-foreground">{settings.description || "Description goes here..."}</div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 px-3 py-2 bg-background border rounded text-xs">
                    {settings.emailPlaceholder || "Email placeholder"}
                  </div>
                  <div className="px-3 py-2 bg-primary text-primary-foreground rounded text-xs">
                    {settings.buttonText || "Download"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 