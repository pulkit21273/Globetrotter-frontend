"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Confetti from "react-confetti";

import { useUserStore } from "@/hooks/user-store";
import ClueBox from "./ClueBox";
import OptionsList from "./OptionsList";
import Feedback from "./Feedback";
import PlayAgain from "./PlayAgain";
import HintButton from "./HintButton";

type ResultState = {
  isCorrect: boolean;
  correctOptionId: number;
  funFact: string;
} | null;

export default function GameContainer() {
  const { updateScore, userId } = useUserStore();
  const [clues, setClues] = useState<{ id: number; text: string }[]>([]);
  const [options, setOptions] = useState<{ id: number; option: string }[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<ResultState>(null);
  const [answeredIds, setAnsweredIds] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  // ✅ Memoize fetchNewQuestion with useCallback
  const fetchNewQuestion = useCallback(async () => {
    try {
      const response = await fetch("https://globetrotter-l7o0.onrender.com/game/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination_ids: answeredIds }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setClues(data.clues_list);
      setOptions(data.options);
      setSelectedOption(null);
      setResult(null);
      setShowConfetti(false);
      setHintUsed(false);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  }, [answeredIds]); // ✅ Only re-run when answeredIds change

  useEffect(() => {
    fetchNewQuestion();
  }, [fetchNewQuestion]); // ✅ Warning Fixed

  // ✅ Memoize checkAnswer with useCallback
  const checkAnswer = useCallback(
    async (optionId: number) => {
      if (selectedOption) return;
      setSelectedOption(optionId);

      try {
        const response = await fetch("https://globetrotter-l7o0.onrender.com/game/correct_answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            clue_id: clues[0]?.id,
            selected_option_id: optionId,
            no_of_hints_used: hintUsed ? 1 : 0,
          }),
        });

        if (!response.ok) throw new Error("Failed to validate answer");

        const data = await response.json();

        setResult({
          isCorrect: data.correct,
          correctOptionId: data.correct_option_id,
          funFact: data.fun_fact,
        });

        if (data.correct) {
          setShowConfetti(true);
        }

        updateScore(data.user_score, data.correct_answers, data.incorrect_answers);
        setAnsweredIds((prev) => [...prev, clues[0]?.id]);
      } catch (error) {
        console.error("Error validating answer:", error);
      }
    },
    [clues, hintUsed, selectedOption, updateScore, userId]
  );

  return (
    <Card className="w-full max-w-lg">
      {showConfetti && <Confetti />}
      <CardContent className="p-6">
        <ClueBox clues={clues} />
        <HintButton clueId={clues[0]?.id} onHintUsed={() => setHintUsed(true)} />
        <Separator className="my-4" />
        {result && <Feedback result={result} />}
        <Separator className="my-4" />
        <OptionsList options={options} checkAnswer={checkAnswer} selectedOption={selectedOption} result={result} />
        {result && <PlayAgain fetchNewQuestion={fetchNewQuestion} />}
      </CardContent>
    </Card>
  );
}
