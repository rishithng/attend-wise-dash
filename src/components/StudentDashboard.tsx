import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LogOut, Calendar, BarChart3, User } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { AttendanceMarker } from "./AttendanceMarker";
import { AttendanceChart } from "./AttendanceChart";
import { DEPARTMENT_COLORS } from "@/types/attendance";

export const StudentDashboard = () => {
  const { logout, currentUser, getStudentAttendance } = useAttendance();
  
  const studentAttendance = getStudentAttendance(currentUser?.id || "");
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyAttendance = studentAttendance.filter(record => 
    record.timestamp.getMonth() === thisMonth && record.timestamp.getFullYear() === thisYear
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
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

      {/* Dashboard Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Attendance Marker */}
        <div className="lg:col-span-1">
          <AttendanceMarker />
        </div>

        {/* Analytics */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="weekly" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Weekly View
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Monthly Stats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weekly">
              <AttendanceChart studentId={currentUser?.id} />
            </TabsContent>

            <TabsContent value="monthly">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Monthly Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-success">{monthlyAttendance.length}</div>
                      <p className="text-sm text-muted-foreground">Days Present</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {monthlyAttendance.length > 0 ? 
                          ((monthlyAttendance.length / new Date(thisYear, thisMonth + 1, 0).getDate()) * 100).toFixed(1) 
                          : 0}%
                      </div>
                      <p className="text-sm text-muted-foreground">Attendance Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};