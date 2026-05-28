import type { IPricing } from "../types";

export const pricingData: IPricing[] = [
  {
    name: "Basic",
    price: 299,
    period: "month",
    features: [
      "50 AI Tumbnails/mo",
      "Basic Templates",
      "Standard Resolution",
      "No Watermark",
      "Email Support",
    ],
    mostPopular: false,
  },
  {
    name: "Pro",
    price: 799,
    period: "month",
    features: [
      "Unlimited AI Tumbnails",
      "Premium Templates",
      "4K Resolution",
      "A/B Testing Tools",
      "Priority Support",
      "Custom Fonts",
      "Brand Kit Analysis",
    ],
    mostPopular: true,
  },
  {
    name: "Enterprise",
    price: 1499,
    period: "month",
    features: [
      "Everything in Pro",
      "API Access",
      "Team Collaboration",
      "Custom Branding",
      "Dedicated Account Manager",
    ],
    mostPopular: false,
  },
];
