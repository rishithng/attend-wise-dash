import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Key, RefreshCw, Copy, Calendar } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { useToast } from "@/hooks/use-toast";

export const DailyCodeDisplay = () => {
  const { dailyCode, generateDailyCode } = useAttendance();
  const { toast } = useToast();

  const handleCopyCode = () => {
    if (dailyCode) {
      navigator.clipboard.writeText(dailyCode.code);
      toast({
        title: "Code Copied!",
        description: "Daily code copied to clipboard",
      });
    }
  };

  const handleGenerateNew = () => {
    generateDailyCode();
    toast({
      title: "New Code Generated!",
      description: "A new daily login code has been created",
    });
  };

  if (!dailyCode) {
    return (
      <Card className="animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Daily Login Code
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={handleGenerateNew} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate Today's Code
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isExpired = new Date() > dailyCode.expiresAt;

  return (
    <Card className="animate-fade-in border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Daily Login Code
          </div>
          <Badge variant={isExpired ? "destructive" : "secondary"}>
            {isExpired ? "Expired" : "Active"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-mono font-bold text-primary bg-background/50 px-4 py-3 rounded-lg border border-primary/20">
            {dailyCode.code}
          </div>
          <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-1">
            <Calendar className="h-4 w-4" />
            Valid for {dailyCode.date}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyCode} className="flex-1">
            <Copy className="h-4 w-4 mr-2" />
            Copy Code
          </Button>
          <Button variant="outline" onClick={handleGenerateNew} className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New
          </Button>
        </div>

        <div className="text-xs text-center text-muted-foreground bg-muted/50 p-2 rounded">
          Share this code with students for today's login. Code expires at midnight.
        </div>
      </CardContent>
    </Card>
  );
};