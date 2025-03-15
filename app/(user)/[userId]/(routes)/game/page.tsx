"use client";

import { useEffect } from "react";
import { useUserStore } from "@/hooks/user-store";
import { redirect } from "next/navigation";
import GameContainer from "./components/GameContainer";

function GamePage() {
  const { userId, username, onOpen } = useUserStore();

  useEffect(() => {
    if (!userId || !username) {
      onOpen();
      redirect('/')
    }
  }, [userId, username, onOpen]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-10">Let&apos;s Play!</h1>
      <GameContainer />
    </div>
  );
}

export default GamePage;
