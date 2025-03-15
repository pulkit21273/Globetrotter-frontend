
"use client";

import { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useUserStore } from "@/hooks/user-store";
import { Button } from "@/components/ui/button"; 

function InvitePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
  const userName = searchParams.get("friend") ?? "";
  const inviterFriend =  searchParams.get("inviterFriend") ?? "";
  const score = searchParams.get("score") ?? "0"; 

  const { setUser } = useUserStore();

  useEffect(() => {
    if (userId && userName) {
      setUser(userId, userName);
    }
  }, [userId, userName, setUser, router]);

  const handlePlayGame = () => {
    router.push(`/${userId}/game`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] bg-purple-100 rounded-2xl text-white">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-purple-300">Welcome, {userName}!</h1>
        <p className="text-lg text-[#191919] mt-2">
          You&apos;re invited by <span className="font-semibold">{inviterFriend}</span> who scored{" "}
          <span className="font-semibold text-[#191919]"><span className="font-semibold">{score}</span></span>.
        </p>
        <p className="text-lg text-[#191919] mt-4">
          Let&apos;s see if you can beat their score! 
        </p>
      </div>

      <div className="mt-6">
        <Button onClick={handlePlayGame} className="w-full text-lg px-6 py-3 cursor-pointe">
          Play Game
        </Button>
      </div>
    </div>
  );
}

export default InvitePage;

