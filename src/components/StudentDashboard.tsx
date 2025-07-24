import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceMarker } from "./AttendanceMarker";
import { AttendanceChart } from "./AttendanceChart";
import { NotificationPanel } from "./NotificationPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, User } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { DEPARTMENT_COLORS } from "@/types/attendance";

export const StudentDashboard = () => {
  const { logout, currentUser, getStudentAttendance, getWeeklyAttendance } = useAttendance();
  
  const weeklyData = getWeeklyAttendance(currentUser?.id || "");
  const todayAttendance = getStudentAttendance(currentUser?.id || "");
  const today = new Date().toDateString();
  const todayRecord = todayAttendance.find(record => 
    record.timestamp.toDateString() === today
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <User className="h-8 w-8" />
            Welcome, {currentUser?.name}!
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant="outline"
              style={{ 
                borderColor: DEPARTMENT_COLORS[currentUser?.department!],
                color: DEPARTMENT_COLORS[currentUser?.department!]
              }}
            >
              {currentUser?.department}
            </Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">ID: {currentUser?.id}</span>
          </div>
        </div>
        <Button onClick={logout} variant="outline">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Mark Attendance */}
        <div className="lg:col-span-1 space-y-6">
          <AttendanceMarker />
          <NotificationPanel />
        </div>

        {/* Right Column - Stats and Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Stats */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="animate-slide-up">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Present:</span>
                    <span className="font-semibold text-success">{weeklyData.filter(d => d.present).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Days:</span>
                    <span className="font-semibold">{weeklyData.length}</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-success to-success-glow" 
                      style={{ width: `${(weeklyData.filter(d => d.present).length / weeklyData.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    {Math.round((weeklyData.filter(d => d.present).length / weeklyData.length) * 100)}% attendance
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success mb-2">
                    {todayRecord ? "Present" : "Not Marked"}
                  </div>
                  {todayRecord && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Marked at {todayRecord.timestamp.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                      {todayRecord.className && (
                        <p className="text-xs text-muted-foreground">
                          Class: {todayRecord.className}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Chart */}
          <AttendanceChart />
        </div>
      </div>
    </div>
  );
};