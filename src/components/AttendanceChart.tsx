import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Users } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { DEPARTMENT_COLORS } from "@/types/attendance";

interface AttendanceChartProps {
  studentId?: string;
  isAdmin?: boolean;
}

export const AttendanceChart = ({ studentId, isAdmin = false }: AttendanceChartProps) => {
  const { getWeeklyAttendance, getDepartmentStats, currentUser } = useAttendance();

  if (isAdmin) {
    // Admin view - Department statistics
    const departmentStats = getDepartmentStats();
    const totalStudents = departmentStats.reduce((sum, dept) => sum + dept.totalStudents, 0);
    const totalPresent = departmentStats.reduce((sum, dept) => sum + dept.presentToday, 0);

    const pieData = departmentStats.map(dept => ({
      name: dept.department,
      value: dept.totalStudents,
      fill: DEPARTMENT_COLORS[dept.department]
    }));

    const barData = departmentStats.map(dept => ({
      department: dept.department,
      total: dept.totalStudents,
      present: dept.presentToday,
      absent: dept.totalStudents - dept.presentToday,
      attendanceRate: dept.totalStudents > 0 ? (dept.presentToday / dept.totalStudents * 100).toFixed(1) : '0'
    }));

    return (
      <div className="space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <Badge variant="outline" className="mt-1">
                <Users className="h-3 w-3 mr-1" />
                All Departments
              </Badge>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Present Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{totalPresent}</div>
              <Badge variant="outline" className="mt-1 bg-success/10 text-success border-success/20">
                <Calendar className="h-3 w-3 mr-1" />
                {totalStudents > 0 ? ((totalPresent / totalStudents) * 100).toFixed(1) : 0}% Rate
              </Badge>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Absent Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{totalStudents - totalPresent}</div>
              <Badge variant="outline" className="mt-1 bg-destructive/10 text-destructive border-destructive/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                {totalStudents > 0 ? (((totalStudents - totalPresent) / totalStudents) * 100).toFixed(1) : 0}% Rate
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Department Distribution */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Student Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {departmentStats.map((dept) => (
                  <div key={dept.department} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: DEPARTMENT_COLORS[dept.department] }}
                    />
                    <span className="text-sm">{dept.department}: {dept.totalStudents}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="department" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Bar dataKey="present" fill="#10b981" name="Present" />
                    <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Student view - Weekly attendance
  const weeklyData = getWeeklyAttendance(studentId || currentUser?.id || "");
  const presentDays = weeklyData.filter(day => day.present).length;
  const attendanceRate = (presentDays / weeklyData.length * 100).toFixed(1);

  const chartData = weeklyData.map(day => ({
    date: day.date,
    status: day.present ? 1 : 0,
    present: day.present ? 1 : null,
    absent: !day.present ? 1 : null
  }));

  return (
    <div className="space-y-6">
      {/* Weekly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentDays}/7</div>
            <Badge variant="outline" className="mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Days Present
            </Badge>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${parseFloat(attendanceRate) >= 75 ? 'text-success' : 'text-warning'}`}>
              {attendanceRate}%
            </div>
            <Badge 
              variant="outline" 
              className={`mt-1 ${
                parseFloat(attendanceRate) >= 75 
                  ? 'bg-success/10 text-success border-success/20' 
                  : 'bg-warning/10 text-warning border-warning/20'
              }`}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              {parseFloat(attendanceRate) >= 75 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {(() => {
                let streak = 0;
                for (let i = weeklyData.length - 1; i >= 0; i--) {
                  if (weeklyData[i].present) {
                    streak++;
                  } else {
                    break;
                  }
                }
                return streak;
              })()}
            </div>
            <Badge variant="outline" className="mt-1 bg-primary/10 text-primary border-primary/20">
              Current Days
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Chart */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Weekly Attendance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 1]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value === 1 ? 'Present' : 'Absent'}
                />
                <Bar 
                  dataKey="present" 
                  fill="#10b981" 
                  name="Present"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="absent" 
                  fill="#ef4444" 
                  name="Absent"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Daily Status */}
          <div className="grid grid-cols-7 gap-2 mt-4">
            {weeklyData.map((day, index) => (
              <div key={index} className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-medium ${
                  day.present 
                    ? 'bg-success text-success-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {day.present ? '✓' : '×'}
                </div>
                <p className="text-xs text-muted-foreground">{day.date.split(' ')[0]}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};