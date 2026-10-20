import { create } from 'zustand';

interface Question {
  id: number;
  text: string;
  marks: number;
  bankId: number;
  createdAt: string;
  options: string[];
}

interface Answer {
  id: number;
  questionId: number;
  selectedOption: string;
  isCorrect: boolean;
  question: Question;
  correctAnswer: string;
}

interface TestSession {
  id: number;
  studentId: number;
  testId: number;
  attemptNo: number;
  status: string;
  startedAt: string;
  endedAt: string;
  score: number;
  totalMarks: number;
  test: {
    id: number;
    title: string;
    type: string;
    totalQuestions?: number;
  } | null;
  answers: Answer[];
}

interface TestResultStore {
  testResult: TestSession | null;
  endReason: string | null;
  setTestResult: (r: TestSession | null) => void;
  setEndReason: (reason: string | null) => void;
  clearEndReason: () => void;
  clearTestResult: () => void;
}

export const useTestResultStore = create<TestResultStore>((set) => ({
  testResult: null,
  endReason: null,
  setTestResult: (r) => set({ testResult: r }),
  setEndReason: (reason) => set({ endReason: reason }),
  clearEndReason: () => set({ endReason: null }),
  clearTestResult: () => set({ testResult: null }),
}));
