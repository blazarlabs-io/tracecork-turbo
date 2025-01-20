"use client";

import { contactFormSchema } from "@/data/form-schemas";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@repo/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";

export const ContactForm = () => {
  // * HOOKS
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email:
        (typeof window !== "undefined" &&
          window.localStorage.getItem("email")) ||
        "",
      message: "",
    },
  });

  // * STATE
  const [sending, setSending] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // * HANDLERS
  const onSubmit = (values: z.infer<typeof contactFormSchema>) => {
    // * Send email

    setSending(true);

    fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        // to: "c.tudorcotruta@gmail.com",
        to: process.env.NEXT_PUBLIC_TRACECORK_EMAIL as string,
        templateId: "d-1fe27ca036c0437c920edd22ab9099d9",
        dynamic_template_data: {
          userEmail: values.email,
          userMessage: values.message,
        },
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then(async (res) => {
        setSending(false);
        setSuccess(true);
      })
      .catch((error) => {
        console.error(error);
        setSending(false);
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Please try again later.",
        });
      });
  };

  return (
    <div className="flex w-[520px] flex-col gap-3">
      {success && (
        <Dialog open={success} onOpenChange={(open) => setSuccess(open)}>
          <DialogTitle className="text-lg">
            Thanks for your message!
          </DialogTitle>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thanks for your message!</DialogTitle>
              <DialogDescription>
                We will get back to you as soon as possible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
                Done
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col items-start justify-start">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Your Email</FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email address"
                      className="w-full shadow-none"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col items-start justify-start">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">
                      How can we help you?
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us more about your needs..."
                      className="min-h-40 w-full shadow-none"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="flex w-full items-center gap-2">
            <span className="text-sm text-muted-foreground">
              By submitting this form, you consent to have read and accepted our{" "}
              <Link
                href="/legal/terms-and-conditions"
                className="font-medium text-primary underline underline-offset-4"
              >
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/legal/privacy-policy"
                className="font-medium text-primary underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </span>
            <div className="flex items-center justify-end">
              <Button size="lg" type="submit" className="">
                {sending ? (
                  <LoaderCircle className="animate-spin text-primary-foreground" />
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
