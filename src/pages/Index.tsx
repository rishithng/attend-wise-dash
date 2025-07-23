import { AttendanceProvider, useAttendance } from "@/context/AttendanceContext";
import { LoginPage } from "@/components/LoginPage";
import { AdminDashboard } from "@/components/AdminDashboard";
import { StudentDashboard } from "@/components/StudentDashboard";

const AppContent = () => {
  const { currentUser } = useAttendance();

  if (!currentUser) {
    return <LoginPage />;
  }

  if (currentUser.type === 'admin') {
    return <AdminDashboard />;
  }

  return <StudentDashboard />;
};

const Index = () => {
  return (
    <AttendanceProvider>
      <AppContent />
    </AttendanceProvider>
  );
};

export default Index;
