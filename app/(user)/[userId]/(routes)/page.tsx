"use client";

import { useEffect} from "react";
import { redirect, useRouter } from "next/navigation";
import { useUserStore } from "@/hooks/user-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InviteFriend from "@/components/invite-friend";
import InfoBox from "@/components/infoBox";

export default function GamePage() {
  const { userId, username, onOpen, onClose } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!userId) {
      onOpen();
    } else {
      onClose();
      router.push(`/${userId}`);
    }
  }, [userId, onOpen, onClose, router]);


  return (
    <Card className="w-full shadow-lg rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-gray-800">
          Welcome, {username || "Player"}! 🎮
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-gray-700">
        <p className="text-lg text-center">
          Test your knowledge with a fun guessing game! Use the hints wisely to score maximum points.
        </p>
        <InfoBox 
          title="Game Rules" 
          icon="📜" 
          color="blue" 
          items={[ 
            "You will be given clues to guess a destination.",
            "You can use 1 hint.",
            "Select the correct answer from multiple options."
          ]} 
        />
        <InfoBox 
          title="Scoring System" 
          icon="🏆" 
          color="green" 
          items={[ 
            "+10 points if you guess correctly without additional hint.",
            "+5 points if you guess correctly with 1 hint.",
            "-5 points if you answer incorrectly."
          ]} 
        />

        <InviteFriend />

        <div className="flex justify-center">
          <Button onClick={() =>(redirect(`/${userId}/game`))} className="text-lg px-6 py-3 cursor-pointer">Start Game 🚀</Button>
        </div>
      </CardContent>
    </Card>
  );
}
