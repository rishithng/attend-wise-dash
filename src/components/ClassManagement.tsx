import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Users } from "lucide-react";
import { useAttendance } from "@/context/AttendanceContext";
import { DEPARTMENTS, DEPARTMENT_COLORS, Department } from "@/types/attendance";
import { useToast } from "@/hooks/use-toast";

export const ClassManagement = () => {
  const [newClassName, setNewClassName] = useState("");
  const [selectedDept, setSelectedDept] = useState<Department | "">("");
  const { classes, addClassToDepartment, getClassesByDepartment } = useAttendance();
  const { toast } = useToast();

  const handleAddClass = () => {
    if (!newClassName.trim() || !selectedDept) {
      toast({
        title: "Missing Information",
        description: "Please enter class name and select department",
        variant: "destructive",
      });
      return;
    }

    addClassToDepartment(newClassName.trim(), selectedDept);
    toast({
      title: "Class Added!",
      description: `${newClassName} added to ${selectedDept} department`,
    });
    setNewClassName("");
    setSelectedDept("");
  };

  return (
    <div className="space-y-6">
      {/* Add New Class */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add New Class
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="className">Class Name</Label>
              <Input
                id="className"
                placeholder="e.g., Data Structures, Physics Lab"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classDept">Department</Label>
              <Select value={selectedDept} onValueChange={(value) => setSelectedDept(value as Department)}>
                <SelectTrigger className="h-12">
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
          </div>
          <Button 
            onClick={handleAddClass} 
            disabled={!newClassName.trim() || !selectedDept}
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </CardContent>
      </Card>

      {/* Classes by Department */}
      <div className="grid gap-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Classes by Department
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPARTMENTS.map((dept) => {
            const deptClasses = getClassesByDepartment(dept);
            
            return (
              <Card key={dept} className="animate-slide-up">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: DEPARTMENT_COLORS[dept] }}
                    />
                    {dept}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {deptClasses.length} {deptClasses.length === 1 ? 'class' : 'classes'}
                  </div>
                </CardHeader>
                <CardContent>
                  {deptClasses.length > 0 ? (
                    <div className="space-y-2">
                      {deptClasses.map((cls) => (
                        <Badge 
                          key={cls.id} 
                          variant="outline" 
                          className="mr-2 mb-2"
                          style={{ 
                            borderColor: DEPARTMENT_COLORS[dept], 
                            color: DEPARTMENT_COLORS[dept] 
                          }}
                        >
                          {cls.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No classes added yet
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};