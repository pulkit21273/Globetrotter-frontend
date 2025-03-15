import React from "react";
import { Button } from "@/components/ui/button";

interface Option {
  id: number;
  option: string;
}

interface OptionsListProps {
  options: Option[];
  checkAnswer: (optionId: number) => void;
  selectedOption: number | null;
  result: { isCorrect: boolean; correctOptionId: number } | null;
}

export default function OptionsList({ options, checkAnswer, selectedOption, result }: OptionsListProps) {
  return (
    <div className="mt-4 space-y-2">
      {options.map((opt) => {
        let variant: "default" | "secondary" | "destructive" = "default";

        if (selectedOption !== null) {
          if (opt.id === selectedOption) {
            variant = "secondary"; 
          }
          if (result) {
            if (opt.id === result.correctOptionId) {
              variant = "default"; 
            } else if (opt.id === selectedOption) {
              variant = "destructive"; 
            }
          }
        }

        return (
          <Button
            key={opt.id}
            variant={variant}
            className={`w-full text-lg cursor-pointer transition-all duration-300 ${
              opt.id === result?.correctOptionId ? "bg-green-500 text-white" : ""
            } ${opt.id === selectedOption && result && !result.isCorrect ? "bg-red-500 text-white" : ""}`}
            disabled={!!selectedOption}
            onClick={() => checkAnswer(opt.id)}
          >
            {opt.option}
          </Button>
        );
      })}
    </div>
  );
}
