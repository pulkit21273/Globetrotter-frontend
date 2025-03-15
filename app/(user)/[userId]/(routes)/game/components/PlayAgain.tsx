import React from "react";
import { Button } from "@/components/ui/button";

interface PlayAgainProps {
  fetchNewQuestion: () => void;
}

export default function PlayAgain({ fetchNewQuestion }: PlayAgainProps) {
  return (
    <Button onClick={fetchNewQuestion} className="w-full mt-4 cursor-pointer">
      Next Destination ➡️
    </Button>
  );
}