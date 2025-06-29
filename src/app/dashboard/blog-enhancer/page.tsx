"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardHeader } from "@/components/dashboard/header";
import { PlanLock } from "@/components/ui/plan-lock";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  PenTool, 
  Sparkles, 
  Search, 
  Eye, 
  Target, 
  FileText, 
  Loader2,
  Copy,
  Check,
  Crown,
  Zap,
  Globe,
  ExternalLink,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface EnhancementResult {
  type: string;
  title: string;
  content: string;
  score?: number;
}

interface BlogAnalysis {
  url: string;
  title: string;
  wordCount: number;
  publishDate?: string;
  author?: string;
  excerpt: string;
}

export default function BlogEnhancerPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [blogUrl, setBlogUrl] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementResults, setEnhancementResults] = useState<EnhancementResult[]>([]);
  const [blogAnalysis, setBlogAnalysis] = useState<BlogAnalysis | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isAIPowered, setIsAIPowered] = useState(false);

  if (user?.plan === 'free') {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Blog Post Enhancer"
          text="Transform your blog posts with AI-powered enhancements and SEO optimizations."
        />
        <PlanLock
          title="AI Blog Post Enhancer Available in Pro"
          description="Enhance your blog posts with AI-powered content optimization, SEO improvements, and engagement boosters."
          features={[
            "AI-powered content enhancement",
            "SEO optimization suggestions",
            "Readability improvements",
            "Meta description generation",
            "Title optimization",
            "Content structure analysis",
            "Keyword density insights",
            "Call-to-action suggestions"
          ]}
        />
      </DashboardShell>
    );
  }

  const handleEnhance = async () => {
    if (!blogUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid blog post URL first.",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(blogUrl);
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid URL (e.g., https://example.com/blog-post)",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);
    setEnhancementResults([]);
    setBlogAnalysis(null);
    setIsAIPowered(false);

    try {
      const response = await fetch('/api/blog-enhancer/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: blogUrl,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Enhancement failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If response is not JSON, use status text or generic message
          errorMessage = response.statusText || `Server error (${response.status})`;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Server returned invalid response. Please try again.');
      }
      setEnhancementResults(data.enhancements);
      setBlogAnalysis(data.analysis);
      setIsAIPowered(data.aiPowered || false);
      
      toast({
        title: "Success!",
        description: `Blog post "${data.analysis.title}" has been analyzed${data.aiPowered ? ' with AI' : ''}.`,
      });
    } catch (error) {
      console.error('Enhancement error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content.",
        variant: "destructive",
      });
    }
  };

  const getEnhancementIcon = (type: string) => {
    switch (type) {
      case 'seo':
        return <Search className="h-4 w-4" />;
      case 'readability':
        return <Eye className="h-4 w-4" />;
      case 'engagement':
        return <Target className="h-4 w-4" />;
      case 'structure':
        return <FileText className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getEnhancementColor = (type: string) => {
    switch (type) {
      case 'seo':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'readability':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'engagement':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'structure':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Blog Post Enhancer"
        text="Transform your blog posts with AI-powered enhancements and SEO optimizations."
      />
      
      <div className="space-y-6 max-w-full overflow-hidden">
        {/* Pro Feature Banner */}
        <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <Crown className="h-5 w-5 text-amber-600" />
          <div>
            <p className="font-medium text-amber-800">Pro Feature</p>
            <p className="text-sm text-amber-700">
              AI-powered blog enhancement with Gemini API integration included with your Pro subscription.
            </p>
          </div>
        </div>

        {/* URL Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Blog Post URL Analysis
            </CardTitle>
            <CardDescription>
              Enter your blog post URL below and let AI automatically fetch and analyze your content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-col sm:flex-row">
              <Input
                type="url"
                placeholder="https://yourblog.com/your-post-title"
                value={blogUrl}
                onChange={(e) => setBlogUrl(e.target.value)}
                className="flex-1 min-w-0"
              />
              <Button 
                onClick={handleEnhance}
                disabled={isEnhancing || !blogUrl.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold min-w-[140px]"
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Analyze Blog
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>Supports most blog platforms</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>Auto content extraction</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>AI-powered analysis</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Analysis Overview */}
        {blogAnalysis && (
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <TrendingUp className="h-5 w-5" />
                Blog Post Analysis
                {/* AI Indicator */}
                {isAIPowered ? (
                  <Badge className="bg-black text-white font-semibold">
                    🤖 AI Powered
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">
                    📝 Enhanced Mock
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-primary">{blogAnalysis.wordCount}</div>
                  <div className="text-sm text-muted-foreground">Words</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-primary">{Math.ceil(blogAnalysis.wordCount / 200)}</div>
                  <div className="text-sm text-muted-foreground">Min Read</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-primary">{enhancementResults.length}</div>
                  <div className="text-sm text-muted-foreground">Suggestions</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <ExternalLink className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-green-800">Title: </span>
                    <span className="text-green-700 break-words">{blogAnalysis.title}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-green-800">Excerpt: </span>
                    <span className="text-green-700 text-sm break-words">{blogAnalysis.excerpt}</span>
                  </div>
                </div>
                {blogAnalysis.author && (
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-green-800">Author: </span>
                      <span className="text-green-700 break-words">{blogAnalysis.author}</span>
                    </div>
                  </div>
                )}
              </div>
              {/* Analysis Type Indicator */}
              <div className="mt-4 p-3 rounded-lg bg-white border-l-4 border-l-primary">
                <div className="flex items-start gap-2">
                  {isAIPowered ? (
                    <Sparkles className="h-4 w-4 text-black mt-0.5" />
                  ) : (
                    <FileText className="h-4 w-4 text-orange-600 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-sm">
                      {isAIPowered ? 'AI-Generated Analysis' : 'Enhanced Mock Analysis'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isAIPowered 
                        ? 'Real-time analysis powered by Google Gemini AI based on your actual blog content.'
                        : 'Sophisticated mock analysis providing valuable insights and suggestions based on best practices.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhancement Results */}
        {enhancementResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Enhancement Results
              </CardTitle>
              <CardDescription>
                AI-powered suggestions to improve your blog post.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 gap-1">
                  <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
                  <TabsTrigger value="seo" className="text-xs sm:text-sm">SEO</TabsTrigger>
                  <TabsTrigger value="readability" className="text-xs sm:text-sm">Read</TabsTrigger>
                  <TabsTrigger value="engagement" className="text-xs sm:text-sm">Engage</TabsTrigger>
                  <TabsTrigger value="structure" className="text-xs sm:text-sm">Structure</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4 mt-4">
                  {enhancementResults.map((result, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {getEnhancementIcon(result.type)}
                          <h3 className="font-medium break-words">{result.title}</h3>
                          <Badge variant="outline" className={getEnhancementColor(result.type)}>
                            {result.type.toUpperCase()}
                          </Badge>
                          {result.score && (
                            <Badge variant="secondary">
                              Score: {result.score}/100
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(result.content, index)}
                          className="flex-shrink-0"
                        >
                          {copiedIndex === index ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg prose prose-sm max-w-none text-sm [&>*]:text-foreground [&>h1]:text-lg [&>h1]:font-bold [&>h2]:text-base [&>h2]:font-semibold [&>h3]:text-sm [&>h3]:font-medium [&>p]:mb-2 [&>ul]:mb-2 [&>li]:mb-1">
                        <ReactMarkdown>
                          {result.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                {['seo', 'readability', 'engagement', 'structure'].map((type) => (
                  <TabsContent key={type} value={type} className="space-y-4 mt-4">
                    {enhancementResults
                      .filter((result) => result.type === type)
                      .map((result, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {getEnhancementIcon(result.type)}
                              <h3 className="font-medium break-words">{result.title}</h3>
                              {result.score && (
                                <Badge variant="secondary">
                                  Score: {result.score}/100
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(result.content, index)}
                              className="flex-shrink-0"
                            >
                              {copiedIndex === index ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="bg-muted/50 p-4 rounded-lg prose prose-sm max-w-none text-sm [&>*]:text-foreground [&>h1]:text-lg [&>h1]:font-bold [&>h2]:text-base [&>h2]:font-semibold [&>h3]:text-sm [&>h3]:font-medium [&>p]:mb-2 [&>ul]:mb-2 [&>li]:mb-1">
                            <ReactMarkdown>
                              {result.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ))}
                    {enhancementResults.filter((result) => result.type === type).length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No {type} suggestions available.
                      </p>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Usage Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              How to Use Blog Post Enhancer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Enter Blog URL</p>
                  <p>Paste your published blog post URL into the input field above.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">AI Analysis</p>
                  <p>Click "Analyze Blog" to automatically fetch and analyze your content with AI.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Review & Apply</p>
                  <p>Review the SEO, readability, engagement, and structure suggestions to improve your blog.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">4</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Copy & Implement</p>
                  <p>Use the copy button to save suggestions and apply them to optimize your blog post.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
} 