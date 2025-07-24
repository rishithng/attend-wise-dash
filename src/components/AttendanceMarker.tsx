import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, Calendar, Wifi, Building2 } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { useToast } from "@/hooks/use-toast";

export const AttendanceMarker = () => {
  const { currentUser, markAttendance, getStudentAttendance, getClassesByDepartment } = useAttendance();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isMarking, setIsMarking] = useState(false);
  const { toast } = useToast();

  // Check if already marked today
  const todayAttendance = getStudentAttendance(currentUser?.id || "");
  const today = new Date().toDateString();
  const alreadyMarked = todayAttendance.some(
    record => record.timestamp.toDateString() === today
  );

  // Get classes for current user's department
  const userClasses = currentUser?.department ? getClassesByDepartment(currentUser.department) : [];

  const handleMarkAttendance = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "User not logged in",
        variant: "destructive",
      });
      return;
    }

    setIsMarking(true);

    try {
      await markAttendance({
        studentId: currentUser.id,
        studentName: currentUser.name || "",
        department: currentUser.department!,
        className: selectedClass || undefined,
      });

      toast({
        title: "Attendance Marked!",
        description: "Your attendance has been recorded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to mark attendance",
        variant: "destructive",
      });
    } finally {
      setIsMarking(false);
    }
  };

  if (alreadyMarked) {
    const todayRecord = todayAttendance.find(record => 
      record.timestamp.toDateString() === today
    );

    return (
      <Card className="animate-fade-in border-success/20 bg-success/5">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <CardTitle className="text-xl text-success">
            Attendance Already Marked
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {todayRecord && (
            <div className="space-y-3 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Marked at {todayRecord.timestamp.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </div>
              
              {todayRecord.className && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Class: {todayRecord.className}
                </div>
              )}

              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Present Today
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <Calendar className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl">
          Mark Today's Attendance
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Network Disclaimer */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Wifi className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary">Network Requirements</p>
              <p className="text-xs text-muted-foreground mt-1">
                Please ensure you are connected to the college network and physically present on campus to mark attendance.
              </p>
            </div>
          </div>
        </div>

        {/* Class Selection */}
        {userClasses.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Class (Optional)</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose a class" />
              </SelectTrigger>
              <SelectContent>
                {userClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.name}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Mark Attendance Button */}
        <Button
          onClick={handleMarkAttendance}
          disabled={isMarking}
          variant="attendance"
          size="xl"
          className="w-full"
        >
          {isMarking ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Marking Attendance...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Mark Attendance
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Attendance will be recorded with current date and time
        </p>
      </CardContent>
    </Card>
  );
};