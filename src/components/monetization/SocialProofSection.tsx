import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SocialProof } from "@/types/page";
import { MessageSquare, Star, User, X, Plus, Quote } from "lucide-react";

interface Props {
  settings: SocialProof;
  onChange: (settings: SocialProof) => void;
}

export function SocialProofSection({ settings, onChange }: Props) {
  const addTestimonial = () => {
    const newTestimonial = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      role: "",
      content: "",
      imageUrl: "",
      rating: 5
    };
    onChange({
      ...settings,
      testimonials: [...settings.testimonials, newTestimonial]
    });
  };

  const updateTestimonial = (index: number, updates: Partial<typeof settings.testimonials[0]>) => {
    const newTestimonials = [...settings.testimonials];
    newTestimonials[index] = { ...newTestimonials[index], ...updates };
    onChange({ ...settings, testimonials: newTestimonials });
  };

  const removeTestimonial = (index: number) => {
    const newTestimonials = [...settings.testimonials];
    newTestimonials.splice(index, 1);
    onChange({ ...settings, testimonials: newTestimonials });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <CardTitle>Social Proof</CardTitle>
        </div>
        <CardDescription>
          Build trust with customer testimonials and reviews on your 404 page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Enable Social Proof</Label>
            <p className="text-sm text-muted-foreground">
              Show testimonials to build credibility
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
                <Label htmlFor="socialProofTitle">Title</Label>
                <Input
                  id="socialProofTitle"
                  placeholder="What Our Customers Say"
                  value={settings.title}
                  onChange={(e) => onChange({ ...settings, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Testimonials</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addTestimonial}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Testimonial
                </Button>
              </div>
            </div>

            {settings.testimonials.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Testimonials ({settings.testimonials.length})</h4>
                {settings.testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">Testimonial #{index + 1}</span>
                        <div className="flex space-x-1">
                          {renderStars(testimonial.rating || 5)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTestimonial(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Customer Name</Label>
                        <Input
                          placeholder="John Doe"
                          value={testimonial.name}
                          onChange={(e) => updateTestimonial(index, { name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role/Company</Label>
                        <Input
                          placeholder="CEO, Company Inc."
                          value={testimonial.role}
                          onChange={(e) => updateTestimonial(index, { role: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Testimonial Content</Label>
                      <Textarea
                        placeholder="Share your positive experience with our product..."
                        value={testimonial.content}
                        onChange={(e) => updateTestimonial(index, { content: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Profile Image URL (Optional)</Label>
                        <Input
                          placeholder="https://example.com/avatar.jpg"
                          type="url"
                          value={testimonial.imageUrl || ''}
                          onChange={(e) => updateTestimonial(index, { imageUrl: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Rating</Label>
                        <Select
                          value={testimonial.rating?.toString() || '5'}
                          onValueChange={(value) => updateTestimonial(index, { rating: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 Stars - Excellent</SelectItem>
                            <SelectItem value="4">4 Stars - Very Good</SelectItem>
                            <SelectItem value="3">3 Stars - Good</SelectItem>
                            <SelectItem value="2">2 Stars - Fair</SelectItem>
                            <SelectItem value="1">1 Star - Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Preview */}
            <div className="mt-6 p-4 border rounded-lg bg-muted/50">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Preview
              </h4>
              <div className="p-4 bg-background border rounded-lg">
                <div className="text-center mb-4">
                  <div className="font-medium text-base">{settings.title || "What Our Customers Say"}</div>
                </div>
                
                {settings.testimonials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {settings.testimonials.slice(0, 2).map((testimonial, index) => (
                      <div key={testimonial.id} className="border rounded-lg p-3 space-y-2 h-full flex flex-col">
                        <div className="flex space-x-1">
                          {renderStars(testimonial.rating || 5)}
                        </div>
                        <div className="relative flex-grow">
                          <Quote className="h-3 w-3 text-muted-foreground absolute -top-1 -left-1" />
                          <p className="text-xs italic pl-3 leading-relaxed line-clamp-3">
                            {testimonial.content || "This is an example testimonial that shows how great your product or service is..."}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 mt-auto">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            {testimonial.imageUrl ? (
                              <img
                                src={testimonial.imageUrl}
                                alt={testimonial.name}
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : (
                              <User className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-xs truncate">
                              {testimonial.name || "Customer Name"}
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate">
                              {testimonial.role || "Customer Role"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No testimonials added yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 