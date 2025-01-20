"use client";

import { useAuth } from "@/context/auth";
import { changePasswordFormSchema } from "@/data/form-schemas";
import { toast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase/client";
import { firebaseAuthErrors } from "@/utils/firebaseAuthErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  User,
} from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@repo/ui/components/ui/button";
import { DialogClose } from "@repo/ui/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";

export const ChangePasswordForm = () => {
  // * HOOKS
  const { user } = useAuth();
  const router = useRouter();
  const form = useForm<z.infer<typeof changePasswordFormSchema>>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // * STATES
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);

  // * HANDLERS
  const onSubmit = (values: z.infer<typeof changePasswordFormSchema>) => {
    // * login and change password
    signInWithEmailAndPassword(
      auth,
      user?.email as string,
      values.currentPassword,
    )
      .then((userCredential) => {
        // Signed in
        const updatedUser = userCredential.user;
        updatePassword(updatedUser as User, values.newPassword)
          .then(() => {
            // Password updated
            signOut(auth).then(() => {
              // Sign-out successful
              router.replace("/home");
            });
            toast({
              description: "Password changed successfully",
              title: "Success",
              variant: "default",
            });
          })
          .catch((error) => {
            console.log(error.code);
            toast({
              description: firebaseAuthErrors[error.code],
              title: "Error",
              variant: "destructive",
            });
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        toast({
          description: firebaseAuthErrors[errorCode],
          title: "Error",
          variant: "destructive",
        });
      });
  };

  const handlePaswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name={"currentPassword"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <div className="relative flex items-center rounded-md border border-border bg-background text-foreground">
                  <Input
                    type={passwordVisibility ? "text" : "password"}
                    placeholder="Current Password"
                    {...field}
                    className="border-0 bg-transparent px-4 py-3 text-sm shadow-none"
                  />
                  <button
                    onClick={handlePaswordVisibility}
                    type="button"
                    className="absolute right-2"
                  >
                    {passwordVisibility ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"newPassword"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className="relative flex items-center rounded-md border border-border bg-background text-foreground">
                  <Input
                    type={passwordVisibility ? "text" : "password"}
                    placeholder="New Password"
                    {...field}
                    className="border-0 bg-transparent px-4 py-3 text-sm shadow-none"
                  />
                  <button
                    onClick={handlePaswordVisibility}
                    type="button"
                    className="absolute right-2"
                  >
                    {passwordVisibility ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"confirmNewPassword"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <div className="relative flex items-center rounded-md border border-border bg-background text-foreground">
                  <Input
                    type={passwordVisibility ? "text" : "password"}
                    placeholder="Confirm New Password"
                    {...field}
                    className="border-0 bg-transparent px-4 py-3 text-sm shadow-none"
                  />
                  <button
                    onClick={handlePaswordVisibility}
                    type="button"
                    className="absolute right-2"
                  >
                    {passwordVisibility ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full items-center justify-end gap-4">
          <DialogClose className="px-4 py-2 text-sm">Cancel</DialogClose>
          <Button size="lg" type="submit" className="">
            Confirm
          </Button>
        </div>
      </form>
    </Form>
  );
};
