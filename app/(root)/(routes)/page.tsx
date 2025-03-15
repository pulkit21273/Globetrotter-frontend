"use client";

import { useEffect } from "react";
import { useUserStore } from "@/hooks/user-store";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { userId, onOpen, onClose } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!userId) {
      onOpen();
    } else {
      onClose();
      router.push(`/${userId}`);
    }
  }, [userId, onOpen, onClose, router]);

  return null;
}
