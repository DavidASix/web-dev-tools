"use client";
import { type User } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LoadingSpinner } from "@/components/ui/custom/loading-spinner";
import { Button } from "@/components/ui/button";

export default function Navigation({ noLoader }: { noLoader?: boolean }) {
  return (
    <nav className="w-full bg-background py-4 flex justify-between px-2">
      <Link href="/" className="text-2xl font-bold text-center">
        Google Reviews for Devs
      </Link>
      {noLoader ? <LoginButton /> : <UserMenu />}
    </nav>
  );
}

const LoginButton = () => {
  return (
    <Button asChild>
      <Link href="/login">Login</Link>
    </Button>
  );
};

const UserMenu = () => {
  const session = useSession();
  const user = session?.data?.user ?? null;

  if (session.status === "unauthenticated") {
    return <LoginButton />;
  }

  const getUserInitials = (user: User | null) => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    } else if (user?.email) {
      return user.email.split("@")[0].toUpperCase().slice(0, 2);
    } else {
      return "GR";
    }
  };

  const initials = getUserInitials(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={!user}>
        <button className="flex justify-center items-center h-9 w-9 rounded-full bg-primary">
          {session.status === "loading" ? (
            <LoadingSpinner className="text-primary-foreground" />
          ) : (
            <span className="text-md font-bold text-primary-foreground">
              {initials}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-40">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/billing">Billing</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
