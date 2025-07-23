import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Users, BarChart3, Calendar, Settings } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { StudentManagement } from "./StudentManagement";
import { AttendanceChart } from "./AttendanceChart";

export const AdminDashboard = () => {
  const { logout, currentUser } = useAttendance();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage students and track attendance</p>
        </div>
        <Button onClick={logout} variant="outline">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <StudentManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <AttendanceChart isAdmin={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};