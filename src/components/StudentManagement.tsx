import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Users, Building2, Search, Trash2, UserPlus } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { DEPARTMENTS, Department, DEPARTMENT_COLORS } from "@/types/attendance";
import { useToast } from "@/hooks/use-toast";

export const StudentManagement = () => {
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentDept, setNewStudentDept] = useState<Department | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState<Department | "all">("all");
  const { students, addStudent, getStudentsByDepartment } = useAttendance();
  const { toast } = useToast();

  const handleAddStudent = () => {
    if (!newStudentName.trim() || !newStudentDept) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      addStudent({
        name: newStudentName.trim(),
        department: newStudentDept,
      });
      
      toast({
        title: "Student Added!",
        description: `${newStudentName} has been added to ${newStudentDept}`,
      });

      setNewStudentName("");
      setNewStudentDept("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add student",
        variant: "destructive",
      });
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "all" || student.department === selectedDept;
    return matchesSearch && matchesDept;
  }).sort((a, b) => {
    // Sort by department first, then by name
    if (a.department !== b.department) {
      return a.department.localeCompare(b.department);
    }
    return a.name.localeCompare(b.name);
  });

  const getDepartmentCount = (dept: Department) => {
    return getStudentsByDepartment(dept).length;
  };

  return (
    <div className="space-y-6">
      {/* Add Student Form */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Add New Student
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                placeholder="Enter full name"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={newStudentDept} onValueChange={(value) => setNewStudentDept(value as Department)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: DEPARTMENT_COLORS[dept] }}
                        />
                        {dept}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAddStudent}
                disabled={!newStudentName || !newStudentDept}
                className="w-full h-11"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Overview */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Department Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {DEPARTMENTS.map((dept) => (
              <div 
                key={dept}
                className="text-center p-4 rounded-lg border bg-background-panel hover:border-primary/30 transition-colors"
              >
                <div 
                  className="w-8 h-8 rounded-full mx-auto mb-2" 
                  style={{ backgroundColor: DEPARTMENT_COLORS[dept] }}
                />
                <p className="font-semibold text-sm">{dept}</p>
                <p className="text-2xl font-bold text-primary">{getDepartmentCount(dept)}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Student Database ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="min-w-[200px]">
              <Select value={selectedDept} onValueChange={(value) => setSelectedDept(value as Department | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: DEPARTMENT_COLORS[dept] }}
                        />
                        {dept}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Students Grid */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No students found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid gap-2">
                {DEPARTMENTS.map((dept) => {
                  const deptStudents = filteredStudents.filter(s => s.department === dept);
                  if (deptStudents.length === 0) return null;

                  return (
                    <div key={dept} className="space-y-2">
                      <div className="flex items-center gap-2 pt-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: DEPARTMENT_COLORS[dept] }}
                        />
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          {dept} ({deptStudents.length})
                        </h4>
                        <Separator className="flex-1" />
                      </div>
                      
                      <div className="grid gap-2">
                        {deptStudents.map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center justify-between p-3 bg-background rounded-lg border hover:border-primary/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                                style={{ backgroundColor: DEPARTMENT_COLORS[student.department] }}
                              >
                                {student.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-sm text-muted-foreground">{student.id}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                style={{ 
                                  borderColor: DEPARTMENT_COLORS[student.department],
                                  color: DEPARTMENT_COLORS[student.department]
                                }}
                              >
                                {student.department}
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                Added {student.dateAdded.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};