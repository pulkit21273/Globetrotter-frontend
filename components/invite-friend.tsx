import { useState } from "react";
import Image from "next/image";
import { useUserStore } from "@/hooks/user-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


interface APIErrorDetail {
    loc?: string[];
    msg: string;
  }

const createUser = async (name: string) => {
  try {
    const response = await fetch("https://globetrotter-l7o0.onrender.com/users/create_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: name }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Handle validation errors first
      const usernameError = data?.details?.find((detail: APIErrorDetail) => 
        detail.loc?.includes("username")
      );

      if (usernameError) {
        // Return error object instead of throwing
        return { error: usernameError.msg, isValidationError: true };
      }
      // Handle other API errors
      return { error: data.error || "API request failed" };
    }

    return { userId: data?.id || Date.now().toString() };
  } catch (error: unknown) {
    // Handle network errors
    if (error instanceof Error) {
      return { error: error.message.includes("Failed to fetch") 
        ? "Cannot connect to server. Ensure the backend is running."
        : "Something went wrong!" 
      };
    }
    return { error: "Unknown error occurred!" };
  }
};

export default function InviteFriend() {
  const {username, score } = useUserStore();
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
