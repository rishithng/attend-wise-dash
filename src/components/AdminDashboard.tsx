import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Users, BarChart3, Calendar, Settings, Clock, BookOpen } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { StudentManagement } from "./StudentManagement";
import { AttendanceChart } from "./AttendanceChart";
import { ClassManagement } from "./ClassManagement";
import { NotificationPanel } from "./NotificationPanel";
import { DailyCodeDisplay } from "./DailyCodeDisplay";
import { DEPARTMENT_COLORS } from "@/types/attendance";

export const AdminDashboard = () => {
  const { logout, getDepartmentStats, getTodayAttendance } = useAttendance();

  const deptStats = getDepartmentStats();
  const todayAttendance = getTodayAttendance();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage students, classes and track attendance</p>
        </div>
        <Button onClick={logout} variant="outline">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="space-y-6">
        {/* Top Row - Daily Code and Notifications */}
        <div className="grid md:grid-cols-2 gap-6">
          <DailyCodeDisplay />
          <NotificationPanel />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6">
              {/* Department Stats */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deptStats.map((stat) => (
                  <Card key={stat.department} className="animate-slide-up">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: DEPARTMENT_COLORS[stat.department] }}
                        />
                        {stat.department}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Present Today:</span>
                          <span className="font-semibold text-success">{stat.presentToday}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total Students:</span>
                          <span className="font-semibold">{stat.totalStudents}</span>
                        </div>
                        <div className="w-full bg-muted/50 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-success to-success-glow" 
                            style={{ 
                              width: `${stat.totalStudents > 0 ? (stat.presentToday / stat.totalStudents) * 100 : 0}%` 
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          {stat.totalStudents > 0 ? Math.round((stat.presentToday / stat.totalStudents) * 100) : 0}% attendance
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Attendance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todayAttendance.length > 0 ? (
                    <div className="space-y-3">
                      {todayAttendance.slice(0, 5).map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{record.studentName}</p>
                            <p className="text-sm text-muted-foreground">
                              {record.department} {record.className && `• ${record.className}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {record.timestamp.toLocaleTimeString('en-US', { 
                                hour: 'numeric', 
                                minute: '2-digit',
                                hour12: true 
                              })}
                            </p>
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              Present
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No attendance records for today
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <StudentManagement />
          </TabsContent>

          <TabsContent value="classes">
            <ClassManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <AttendanceChart isAdmin={true} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};