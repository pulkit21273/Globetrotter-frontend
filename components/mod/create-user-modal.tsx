"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modals";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/hooks/user-store";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});
interface APIErrorDetail {
  loc?: string[];
  msg: string;
}
export const UserModal = () => {
  const { setUser, isOpen, onClose } = useUserStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
  
      const response = await fetch("https://globetrotter-l7o0.onrender.com/users/create_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: values.name }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        if (data?.details) {
          data.details.forEach((detail: APIErrorDetail) => {
            if (detail.loc?.includes("username")) {
              form.setError("name", { type: "manual", message: detail.msg });
            }
          });
          return; // Exit early after handling validation errors
        } else {
          throw new Error(data.error || "Something went wrong!");
        }
      }
  
      if (!data?.id) {
        throw new Error("User ID is missing in the API response.");
      }
  
      setUser(data.id, values.name);
      router.push(`/${data.id}`);
    } catch (error: unknown) {
      console.error("[User-Create-modal] Error:", error);
  
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          alert("Cannot connect to server. Ensure the backend is running.");
        } else {
          alert(error.message);
        }
      } else {
        alert("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <Modal
      title="Create User"
      description="Add a new user"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 flex items-center justify-end space-x-2">
              <Button className="cursor-pointer" disabled={loading} variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button className="cursor-pointer" disabled={loading} type="submit">
                {loading ? "Processing..." : "Continue"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
