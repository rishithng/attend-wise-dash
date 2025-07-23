export interface Student {
  id: string;
  name: string;
  department: Department;
  dateAdded: Date;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  department: Department;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export type Department = 'CSE' | 'ISE' | 'EC' | 'EEE' | 'CSBS' | 'EI';

export interface User {
  type: 'admin' | 'student';
  id: string;
  name?: string;
  department?: Department;
}

export interface WeeklyAttendance {
  date: string;
  present: boolean;
  timestamp?: Date;
}

export interface DepartmentStats {
  department: Department;
  totalStudents: number;
  presentToday: number;
  attendanceRate: number;
}

export const DEPARTMENTS: Department[] = ['CSE', 'ISE', 'EC', 'EEE', 'CSBS', 'EI'];

export const DEPARTMENT_COLORS: Record<Department, string> = {
  CSE: 'hsl(220, 100%, 60%)',
  ISE: 'hsl(280, 100%, 60%)',
  EC: 'hsl(340, 100%, 60%)',
  EEE: 'hsl(45, 100%, 50%)',
  CSBS: 'hsl(160, 100%, 40%)',
  EI: 'hsl(30, 100%, 55%)'
};