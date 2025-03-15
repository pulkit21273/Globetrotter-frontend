"use client";

import { useUserStore } from "@/hooks/user-store";
import { useState, useEffect } from "react";


function UserButton() {
  const { username } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; 
  }
  return (
    <div className="ml-auto flex items-center space-x-4">
      <div className="bg-primary text-white rounded-full flex items-center justify-center m-2 p-4 w-10 h-10 cursor-pointer hover:bg-primary/80 transition duration-300">
        {username?.charAt(0) || "MD"}
      </div>
    </div>
  );
}

export default UserButton;
