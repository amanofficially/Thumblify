import type { IFooter } from "../types";

export const footerData: IFooter[] = [
  {
    title: "Product",
    links: [
      { name: "Home", href: "/" },
      { name: "Generate", href: "/generate" },
      { name: "My Generation", href: "/my-generation" },
      { name: "Login", href: "/login" },
    ],
  },
  {
    title: "Features",
    links: [
      { name: "AI Thumbnail Generator", href: "/generate" },
      { name: "Style Customization", href: "#styles" },
      { name: "Aspect Ratio Control", href: "#aspect-ratio" },
      { name: "Instant Download", href: "#download" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Contact", href: "#contact" },
      { name: "Help Center", href: "#contact" },
      { name: "Feedback", href: "#contact" },
    ],
  },
];