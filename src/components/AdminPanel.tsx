import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, Search, Eye, Clock } from "lucide-react";

interface AttendanceRecord {
  id: string;
  name: string;
  timestamp: Date;
}

interface AdminPanelProps {
  attendanceRecords: AttendanceRecord[];
}

export const AdminPanel = ({ attendanceRecords }: AdminPanelProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch = 
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateFilter || 
      record.timestamp.toDateString() === new Date(dateFilter).toDateString();

    return matchesSearch && matchesDate;
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="h-full shadow-lg border-0 bg-background-panel">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Admin Panel
        </CardTitle>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Live Updates
          </div>
          <Badge variant="outline" className="bg-primary-soft text-primary border-primary/20">
            {attendanceRecords.length} Records
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-medium text-foreground">
                Search by Student ID or Name
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-foreground">
                Filter by Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-10 bg-background border-border focus:border-primary"
                />
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full">
            <Eye className="h-4 w-4" />
            View Full Attendance Log
          </Button>
        </div>

        <Separator />

        {/* Live Attendance List */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Recent Attendance ({filteredRecords.length})
          </h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No attendance records found</p>
                {searchTerm || dateFilter ? (
                  <p className="text-sm">Try adjusting your filters</p>
                ) : (
                  <p className="text-sm">Students will appear here when they mark attendance</p>
                )}
              </div>
            ) : (
              filteredRecords
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((record, index) => (
                  <div
                    key={`${record.id}-${record.timestamp.getTime()}`}
                    className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                        <p className="font-medium text-foreground">{record.name}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">ID: {record.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {formatTime(record.timestamp)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(record.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};