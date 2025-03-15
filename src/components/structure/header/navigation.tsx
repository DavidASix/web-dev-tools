"use client";

import UserNav from "./user-nav";
import ApplicationSwitcher from "./application-switcher";

export default function Navigation({ noAuth }: { noAuth?: boolean }) {
  return (
    <nav className="w-full bg-background py-4 flex justify-between px-2">
      <ApplicationSwitcher noAuth={noAuth} />
      <UserNav noAuth={noAuth} />
    </nav>
  );
}
