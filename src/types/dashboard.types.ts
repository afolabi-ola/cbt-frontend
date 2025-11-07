export interface Course {
  subject: string;
  score: string;
  date: string;
  status: 'passed' | 'failed';
}

export interface ActiveTestCourse {
  title: string;
}

export interface ActiveTest {
  id: number;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  course: ActiveTestCourse;
}

export interface StudentClass {
  id: number;
  className: string;
}

export interface Student {
  id: number;
  name: string;
  class: StudentClass;
}

export interface OverallStats {
  totalCourses: number;
  totalTests: number;
  testsCompleted: number;
  averageScore: number;
}

export interface RecentResults {
  student: Student;
  courses: Course[];
  overallStats: OverallStats;
}

export interface TotalScore {
  _sum: {
    score: number | null;
  };
}

export interface Notification {
  id: number;
  message: string;
  time: string;
}

export interface DashboardData {
  className: string;
  totalTests: number;
  activeTests: ActiveTest[];
  recentResults: RecentResults;
  completedTests: number;
  inProgressTests: number;
  totalScore: TotalScore;
  notifications?: Notification[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}
