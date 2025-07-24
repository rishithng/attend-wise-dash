import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Trash2 } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";

export const NotificationPanel = () => {
  const { notifications, clearNotifications } = useAttendance();

  if (notifications.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted/50 flex items-center justify-center">
            <BellOff className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg text-muted-foreground">
            No New Notifications
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Recent Activity
          <Badge variant="secondary">{notifications.length}</Badge>
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearNotifications}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.slice(0, 5).map((notification, index) => (
            <div 
              key={index} 
              className="p-3 bg-muted/50 rounded-lg border border-border animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-sm">{notification}</p>
            </div>
          ))}
          {notifications.length > 5 && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              +{notifications.length - 5} more notifications
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};