import { create } from "zustand";

interface GameState {
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  setScore: (correct: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  setScore: (correct) =>
    set((state) => ({
      score: state.score + (correct ? 1 : 0),
      correctAnswers: state.correctAnswers + (correct ? 1 : 0),
      incorrectAnswers: state.incorrectAnswers + (correct ? 0 : 1),
    })),
  resetGame: () => set({ score: 0, correctAnswers: 0, incorrectAnswers: 0 }),
}));
