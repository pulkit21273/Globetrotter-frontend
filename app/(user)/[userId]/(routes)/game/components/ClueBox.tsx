interface Clue {
  id: number;
  text: string;
}

interface ClueBoxProps {
  clues: Clue[];
}

export default function ClueBox({ clues }: ClueBoxProps) {
  return (
    <div className="bg-purple-100 p-4 rounded-lg">
      <h2 className="text-lg font-semibold">🕵️‍♂️ Clues:</h2>
      <ul className="list-disc list-inside mt-2">
        {clues.slice(0, 2).map((clue) => (
          <li key={clue.id} className="text-purple-700">{clue.text}</li>
        ))}
      </ul>
    </div>
  );
}
