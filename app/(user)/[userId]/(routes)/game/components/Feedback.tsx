import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Confetti from "react-confetti";

interface ResultState {
  isCorrect: boolean;
  correctOptionId: number;
  funFact: string;
}

interface FeedbackProps {
  result: ResultState;
}

export default function Feedback({ result }: FeedbackProps) {
  if (!result) return null;

  return (
    <div className="mt-4">
      {result.isCorrect && <Confetti />}
      <Alert variant={result.isCorrect ? "default" : "destructive"}>
        <AlertTitle>
          {result.isCorrect ? "🎉 Correct!" : "😢 Incorrect!"}
        </AlertTitle>
        <AlertDescription><span><strong>Fun Fact:</strong></span> {result.funFact}</AlertDescription>
      </Alert>
    </div>
  );
}
