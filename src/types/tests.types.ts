export interface TestCourse {
  title: string;
}

export interface TestBank {
  _count: {
    questions: number;
  };
}

export interface Test {
  id: number;
  title: string;
  type: string;
  testState: string;
  startTime: string;
  endTime: string;
  duration: number;
  attemptsAllowed: number;
  courseId: number;
  createdAt: string;
  course: TestCourse;
  bank: TestBank;
}

export interface TestsResponse {
  success: boolean;
  message: string;
  data: Test[];
}
