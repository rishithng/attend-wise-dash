import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, KeyRound, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentPanelProps {
  onAttendanceMarked: (studentData: {
    id: string;
    name: string;
    timestamp: Date;
  }) => void;
}

export const StudentPanel = ({ onAttendanceMarked }: StudentPanelProps) => {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleMarkAttendance = async () => {
    if (!studentId.trim() || !name.trim() || !password.trim()) {
      setStatus({
        type: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const studentData = {
        id: studentId.trim(),
        name: name.trim(),
        timestamp: new Date(),
      };

      onAttendanceMarked(studentData);
      
      setStatus({
        type: "success",
        message: "Attendance Marked Successfully!",
      });

      toast({
        title: "Success!",
        description: `Attendance marked for ${name}`,
      });

      // Clear form
      setStudentId("");
      setName("");
      setPassword("");
      setIsLoading(false);

      // Clear status after 3 seconds
      setTimeout(() => {
        setStatus({ type: null, message: "" });
      }, 3000);
    }, 1000);
  };

  return (
    <Card className="h-full shadow-lg border-0 bg-background-panel">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <User className="h-6 w-6 text-primary" />
          Student Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentId" className="text-sm font-medium text-foreground">
              Student ID
            </Label>
            <Input
              id="studentId"
              type="text"
              placeholder="Enter your Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="h-12 bg-background border-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 bg-background border-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pl-10 bg-background border-border focus:border-primary"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleMarkAttendance}
          disabled={isLoading}
          variant="attendance"
          size="xl"
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Marking Attendance...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              Mark Attendance
            </>
          )}
        </Button>

        {status.message && (
          <div
            className={`
              flex items-center gap-2 p-4 rounded-lg font-medium transition-all duration-300 
              ${
                status.type === "success"
                  ? "bg-success-soft text-success border border-success/20"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }
            `}
          >
            {status.type === "success" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            {status.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
};