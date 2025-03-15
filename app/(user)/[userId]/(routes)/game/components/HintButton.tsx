import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/mod/alert-modal";

const API_URL = "http://0.0.0.0:8000/game/hint"; 


interface HintButtonProps {
  clueId?: number;
  onHintUsed: () => void; 
}

export default function HintButton({ clueId, onHintUsed }: HintButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchHint() {
    if (!clueId) return;

    setLoading(true);
    try {
      const response = await fetch(`http://0.0.0.0:8000/game/hint?clue_id=${clueId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch hint");

      const data = await response.json();
      setHint(data.trivia || "No hint available.");
      onHintUsed(); // Update the hintUsed state in GameContainer
    } catch (error) {
      console.error("Error fetching hint:", error);
      setHint("Error fetching hint.");
    } finally {
      setLoading(false);
      setIsOpen(true);
    }
  }

  return (
    <>
      <Button onClick={fetchHint} variant="outline" className="mt-3">
        💡 Get a Hint
      </Button>

      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => setIsOpen(false)}
        loading={loading}
      >
        <p className="text-lg font-medium">{hint}</p>
      </AlertModal>
    </>
  );
}

