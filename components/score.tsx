"use client";

import { useEffect } from "react";
import { useUserStore } from "@/hooks/user-store";

function Score() {
  const { score, correctAnswers, incorrectAnswers, fetchUserStats } = useUserStore();

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  return (
    <div className="flex items-center justify-center space-x-6 bg-[#191919] px-4 py-2 rounded-xl shadow-md border border-[#121212] text-white h-14 min-w-100">
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-400">Score</span>
        <span className="text-lg font-semibold text-white">{score}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-400">Correct</span>
        <span className="text-lg font-semibold text-green-400">{correctAnswers}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-400">Incorrect</span>
        <span className="text-lg font-semibold text-red-400">{incorrectAnswers}</span>
      </div>
    </div>
  );
}

export default Score;
