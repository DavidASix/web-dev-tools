"use client";

import Link from "next/link";
import UserNav from "./user-nav";

export default function Navigation({ noAuth }: { noAuth?: boolean }) {
  return (
    <nav className="w-full bg-background py-4 flex justify-between px-2">
      <Link href="/" className="text-2xl font-bold text-center">
        Google Reviews for Devs
      </Link>
      <UserNav noAuth={noAuth} />
    </nav>
  );
}
