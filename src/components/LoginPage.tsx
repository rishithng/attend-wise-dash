import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, GraduationCap, LogIn, Building2 } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { DEPARTMENTS, Department } from "@/types/attendance";
import { useToast } from "@/hooks/use-toast";

export const LoginPage = () => {
  const [loginType, setLoginType] = useState<'admin' | 'student' | null>(null);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [department, setDepartment] = useState<Department | "">("");
  const [adminPassword, setAdminPassword] = useState("");
  const { login, students } = useAttendance();
  const { toast } = useToast();

  const handleAdminLogin = () => {
    if (adminPassword === "admin123") { // Simple demo password
      login({ type: 'admin', id: 'admin' });
      toast({
        title: "Login Successful!",
        description: "Welcome to Admin Dashboard",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid admin password",
        variant: "destructive",
      });
    }
  };

  const handleStudentLogin = () => {
    if (!studentId || !studentName || !department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Check if student exists in admin's database
    const student = students.find(s => 
      s.id === studentId && 
      s.name.toLowerCase() === studentName.toLowerCase() && 
      s.department === department
    );

    if (student) {
      login({ 
        type: 'student', 
        id: studentId, 
        name: studentName, 
        department: department as Department 
      });
      toast({
        title: "Login Successful!",
        description: `Welcome ${studentName}!`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Student not found. Please contact admin.",
        variant: "destructive",
      });
    }
  };

  if (!loginType) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background-gradient)' }}>
        <div className="text-center animate-fade-in">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center shadow-glow">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2 gradient-text">
              Smart Attendance System
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose your login type to continue
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Admin Login */}
            <Card 
              className="card-hover cursor-pointer border-2 hover:border-primary/50 animate-slide-up"
              onClick={() => setLoginType('admin')}
              style={{ animationDelay: '0.1s' }}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Admin Portal</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage students and view analytics
                </p>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="w-full justify-center">
                  Full Access
                </Badge>
              </CardContent>
            </Card>

            {/* Student Login */}
            <Card 
              className="card-hover cursor-pointer border-2 hover:border-primary/50 animate-slide-up"
              onClick={() => setLoginType('student')}
              style={{ animationDelay: '0.2s' }}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-xl">Student Portal</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Mark attendance and view records
                </p>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="w-full justify-center bg-success/10 text-success border-success/20">
                  Student Access
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background-gradient)' }}>
      <Card className="w-full max-w-md animate-bounce-in shadow-card-hover">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center shadow-glow">
            {loginType === 'admin' ? 
              <Shield className="h-8 w-8 text-white" /> : 
              <GraduationCap className="h-8 w-8 text-white" />
            }
          </div>
          <CardTitle className="text-2xl">
            {loginType === 'admin' ? 'Admin Login' : 'Student Login'}
          </CardTitle>
          <p className="text-muted-foreground">
            {loginType === 'admin' ? 
              'Enter admin credentials to continue' : 
              'Enter your details to mark attendance'
            }
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {loginType === 'admin' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button 
                onClick={handleAdminLogin} 
                className="w-full" 
                size="lg"
                disabled={!adminPassword}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login as Admin
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={(value) => setDepartment(value as Department)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: `var(--dept-${dept.toLowerCase()})` }}
                          />
                          {dept}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  type="text"
                  placeholder="Enter your Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="h-12"
                />
              </div>

              <Button 
                onClick={handleStudentLogin} 
                className="w-full" 
                size="lg"
                disabled={!studentId || !studentName || !department}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login as Student
              </Button>
            </>
          )}

          <Button 
            variant="ghost" 
            onClick={() => setLoginType(null)} 
            className="w-full"
          >
            Back to Selection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};