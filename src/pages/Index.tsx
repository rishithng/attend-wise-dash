import { useState } from "react";
import { StudentPanel } from "@/components/StudentPanel";
import { AdminPanel } from "@/components/AdminPanel";

interface AttendanceRecord {
  id: string;
  name: string;
  timestamp: Date;
}

const Index = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  const handleAttendanceMarked = (studentData: AttendanceRecord) => {
    setAttendanceRecords(prev => [studentData, ...prev]);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8" style={{ background: 'var(--background-gradient)' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Network-Based Attendance Manager
        </h1>
        <p className="text-muted-foreground text-lg">
          Streamlined attendance tracking for educational institutions
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Student Panel */}
          <div className="order-1">
            <StudentPanel onAttendanceMarked={handleAttendanceMarked} />
          </div>

          {/* Admin Panel */}
          <div className="order-2">
            <AdminPanel attendanceRecords={attendanceRecords} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-sm text-muted-foreground">
        <p>Secure • Real-time • Efficient</p>
      </div>
    </div>
  );
};

export default Index;
