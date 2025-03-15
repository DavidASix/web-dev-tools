import { cn } from "@/lib/utils";
import { House, Star, WandSparkles } from "lucide-react";
import React from "react";

function IconBase({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full",
        color ? color : "bg-gray-300"
      )}
    >
      {children}
    </div>
  );
}

function HomeIcon() {
  return (
    <IconBase color="bg-red-300">
      <House />
    </IconBase>
  );
}

function GoogleReviewsIcon() {
  return (
    <IconBase color="bg-blue-300">
      <Star />
    </IconBase>
  );
}

function BlogGeneratorIcon() {
  return (
    <IconBase color="bg-green-300">
      <WandSparkles />
    </IconBase>
  );
}

export const applications = [
  {
    id: "dashboard",
    name: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    id: "google-reviews",
    name: "Google Reviews",
    url: "/google-reviews",
    icon: GoogleReviewsIcon,
  },
  {
    id: "blog-generator",
    name: "Blog Generator",
    url: "/blog-generator",
    icon: BlogGeneratorIcon,
  },
];
