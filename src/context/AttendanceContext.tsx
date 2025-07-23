import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Student, AttendanceRecord, User, Department } from '../types/attendance';

interface AttendanceContextType {
  // Auth state
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  
  // Students management
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'dateAdded'>) => void;
  getStudentsByDepartment: (department: Department) => Student[];
  
  // Attendance management
  attendanceRecords: AttendanceRecord[];
  markAttendance: (record: Omit<AttendanceRecord, 'id' | 'timestamp'>) => void;
  getStudentAttendance: (studentId: string) => AttendanceRecord[];
  getWeeklyAttendance: (studentId: string) => { date: string; present: boolean }[];
  
  // Statistics
  getTodayAttendance: () => AttendanceRecord[];
  getDepartmentStats: () => { department: Department; totalStudents: number; presentToday: number }[];
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([
    // Sample data
    { id: 'ST001', name: 'Alice Johnson', department: 'CSE', dateAdded: new Date('2024-01-15') },
    { id: 'ST002', name: 'Bob Smith', department: 'ISE', dateAdded: new Date('2024-02-01') },
    { id: 'ST003', name: 'Carol Davis', department: 'EC', dateAdded: new Date('2024-02-10') },
    { id: 'ST004', name: 'David Wilson', department: 'EEE', dateAdded: new Date('2024-02-15') },
    { id: 'ST005', name: 'Eva Brown', department: 'CSBS', dateAdded: new Date('2024-03-01') },
  ]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'dateAdded'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `ST${String(students.length + 1).padStart(3, '0')}`,
      dateAdded: new Date(),
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const getStudentsByDepartment = (department: Department) => {
    return students.filter(student => student.department === department);
  };

  const markAttendance = (recordData: Omit<AttendanceRecord, 'id' | 'timestamp'>) => {
    // Check if already marked today
    const today = new Date().toDateString();
    const alreadyMarked = attendanceRecords.some(
      record => 
        record.studentId === recordData.studentId && 
        record.timestamp.toDateString() === today
    );

    if (alreadyMarked) {
      throw new Error('Attendance already marked for today');
    }

    const newRecord: AttendanceRecord = {
      ...recordData,
      id: `ATT${Date.now()}`,
      timestamp: new Date(),
    };
    setAttendanceRecords(prev => [newRecord, ...prev]);
  };

  const getStudentAttendance = (studentId: string) => {
    return attendanceRecords.filter(record => record.studentId === studentId);
  };

  const getWeeklyAttendance = (studentId: string) => {
    const studentRecords = getStudentAttendance(studentId);
    const weekDates = [];
    const today = new Date();
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      weekDates.push(date.toDateString());
    }

    return weekDates.map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      present: studentRecords.some(record => record.timestamp.toDateString() === date)
    }));
  };

  const getTodayAttendance = () => {
    const today = new Date().toDateString();
    return attendanceRecords.filter(record => record.timestamp.toDateString() === today);
  };

  const getDepartmentStats = () => {
    const todayAttendance = getTodayAttendance();
    
    return ['CSE', 'ISE', 'EC', 'EEE', 'CSBS', 'EI'].map(dept => {
      const deptStudents = getStudentsByDepartment(dept as Department);
      const presentToday = todayAttendance.filter(record => record.department === dept).length;
      
      return {
        department: dept as Department,
        totalStudents: deptStudents.length,
        presentToday
      };
    });
  };

  const value: AttendanceContextType = {
    currentUser,
    login,
    logout,
    students,
    addStudent,
    getStudentsByDepartment,
    attendanceRecords,
    markAttendance,
    getStudentAttendance,
    getWeeklyAttendance,
    getTodayAttendance,
    getDepartmentStats,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};