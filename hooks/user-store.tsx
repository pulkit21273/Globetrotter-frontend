import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  userId: string | null;
  username: string | null;
  isOpen: boolean;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;

  setUser: (userId: string, username: string) => void;
  onOpen: () => void;
  onClose: () => void;
  fetchUserStats: () => Promise<void>;

  updateScore: (newScore: number, correctAnswers: number, incorrectAnswers: number) => Promise<void>;
}


export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userId: null,
      username: null,
      isOpen: true,
      score: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,

      setUser: (userId, username) => {
        set({ userId, username, isOpen: false });
      },

      onOpen: () => {
        set({ isOpen: true });
      },

      onClose: () => {
        set({ isOpen: false });
      },

      fetchUserStats: async () => {
        const { userId } = get();
        if (!userId) return;
      
        try {
          const response = await fetch(`https://globetrotter-l7o0.onrender.com/game/score?user_id=${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
      
          set({
            score: data.total_score || 0,
            correctAnswers: data.correct_answers || 0,
            incorrectAnswers: data.incorrect_answers || 0,
          });
        } catch (error) {
          console.error("Error fetching user stats:", error);
        }
      },
      
      
      updateScore: async (newScore: number, correctAnswers: number, incorrectAnswers: number) => {
        const { userId } = get();
        if (!userId) return;
      
        try {      
          set({
            score: newScore,
            correctAnswers: correctAnswers,
            incorrectAnswers: incorrectAnswers,
          });
        } catch (error) {
          console.error("Error updating score:", error);
        }
      },
      
    }),
    {
      name: "user-storage",
    }
  )
);
