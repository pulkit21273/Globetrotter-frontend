import { useState } from "react";
import Image from "next/image";
import { useUserStore } from "@/hooks/user-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Function to create a user by making an API request
const createUser = async (name: string) => {
  try {
    const response = await fetch("http://localhost:8000/users/create_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: name }),
    });

    const data = await response.json();
    if (!response.ok) {
      if (data?.details) {
        data.details.forEach((detail: any) => {
          if (detail.loc?.some((loc: string) => loc === "username")) {
            throw new Error(detail.msg); // Throw error for username validation
          }
        });
        throw new Error(data.error || "Something went wrong!");
      } else {
        throw new Error(data.error || "API request failed");
      }
    }

    return data?.id || Date.now().toString(); // Return the created user ID
  } catch (error: unknown) {
    // Narrow the type of `error` to `Error`
    if (error instanceof Error) {
      alert(error.message || "Something went wrong!");
    } else {
      alert("Unknown error occurred!");
    }
    throw error; // Re-throw to allow other parts of the code to handle it
  }
};

export default function InviteFriend() {
  const { userId, username, score } = useUserStore();
  const [friendName, setFriendName] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateInvite = async () => {
    if (!friendName.trim()) return;

    try {
      setIsLoading(true);

      // Create a new user (or retrieve their user ID if already exists)
      const invitedUserId = await createUser(friendName);

      // Now generate the invite link with the userId of the inviter (creator)
      const link = `${window.location.origin}/${invitedUserId}/invite?friend=${encodeURIComponent(friendName)}&score=${score}&inviterFriend=${username}`;
      setInviteLink(link);
    } catch (error) {
      console.error("Failed to create user or generate invite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!inviteLink) return;
    const message = `*${username}* is challenging you!\n*Score:* _${score} points_ Can you beat them?\n*Join the game:* ${inviteLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="p-4 bg-purple-100 rounded-lg">
      <h3 className="text-xl font-semibold text-purple-800">Challenge a Friend 🏆</h3>
      <p className="text-purple-700">
        Invite a friend to play and compare scores! Enter their name and generate an invite link.
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-3 w-full cursor-pointer">Invite a Friend 🚀</Button>
        </DialogTrigger>
        <DialogContent className="p-6 bg-white rounded-xl shadow-xl max-w-lg">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-gray-800">Invite a Friend! 🏆</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center p-4">
            <Image
              src="https://github.com/shadcn.png"
              alt="Invite Preview"
              width={300}
              height={200}
              className="rounded-lg shadow-md"
            />
            <p className="text-gray-700 text-center mt-3">
              <strong>{username}</strong> has scored <strong>{score} points</strong>. Can you beat them?
            </p>
          </div>

          <Input
            placeholder="Enter your friend's name"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
          />

          <Button
            className="cursor-pointer"
            onClick={handleGenerateInvite}
            disabled={!friendName.trim() || isLoading}
          >
            {isLoading ? "Generating..." : "Generate Invite Link 🔗"}
          </Button>

          {inviteLink && (
            <div className="p-4 border border-[#191919] rounded-lg text-center transition-all duration-300 hover:shadow-lg">
              <p className="text-sm text-gray-800 font-medium break-words">{inviteLink}</p>

              <div className="flex gap-3 mt-3">
                <Button
                  onClick={() => navigator.clipboard.writeText(inviteLink)}
                  variant="outline"
                  className="flex-1 px-4 py-2 text-gray-700 font-semibold border-gray-400 transition-all duration-200 hover:bg-gray-200 hover:text-gray-900 active:scale-95 cursor-pointer"
                >
                  Copy Link
                </Button>

                <Button
                  onClick={handleShareWhatsApp}
                  className="flex-1 px-4 py-2 bg-green-500 text-white font-semibold transition-all duration-200 hover:bg-green-600 active:scale-95 cursor-pointer"
                >
                  Share on WhatsApp
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
