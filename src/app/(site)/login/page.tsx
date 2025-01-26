import React from "react";
import { signIn, auth } from "~/auth";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  const handleSignIn = async (formData: FormData) => {
    "use server";
    await signIn("resend", formData);
  };

  if (user) {
    redirect("/");
  }

  return (
    <section className="section section-padding min-h-96 bg-muted">
      <div className="content flex flex-col items-center justify-center border">
        <form action={handleSignIn} className="flex flex-col gap-4">
          <Input type="text" name="email" placeholder="Email" />
          <Button type="submit">Signin with Resend</Button>
        </form>
      </div>
    </section>
  );
}
