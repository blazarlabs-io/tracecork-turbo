import { PricingLevel } from "@/types/db";

export const pricingTemplate: PricingLevel[] = [
  {
    name: "bronze",
    price: 0,
    qrCodes: 2,
    language: {
      description: "Availability in all 24 languages",
      available: true,
    },
    editable: {
      description: "Editable labels",
      available: true,
    },
    training: {
      description: "Group training sessions",
      available: false,
    },
    tokenization: {
      description: "Tonenized wine",
      available: false,
    },
    analytics: {
      description: "Analytics dashboard",
      available: false,
    },
    earlyAccess: {
      description: 'Early acces to "Winery Operations Management" Platform',
      available: false,
    },
  },
  {
    name: "silver",
    price: 75,
    qrCodes: 15,
    language: {
      description: "Availability in all 24 languages",
      available: true,
    },
    editable: {
      description: "Editable labels",
      available: true,
    },
    training: {
      description: "Group training sessions",
      available: true,
    },
    tokenization: {
      description: "1 Tonenized wine",
      available: true,
    },
    analytics: {
      description: "Analytics dashboard",
      available: false,
    },
    earlyAccess: {
      description: 'Early acces to "Winery Operations Management" Platform',
      available: false,
    },
  },
  {
    name: "gold",
    price: 120,
    qrCodes: 50,
    language: {
      description: "Availability in all 24 languages",
      available: true,
    },
    editable: {
      description: "Editable labels",
      available: true,
    },
    training: {
      description: "Group training sessions",
      available: true,
    },
    tokenization: {
      description: "2 Tonenized wine",
      available: true,
    },
    analytics: {
      description: "Analytics dashboard",
      available: true,
    },
    earlyAccess: {
      description: 'Early acces to "Winery Operations Management" Platform',
      available: false,
    },
  },
  {
    name: "platinum",
    price: 230,
    qrCodes: "unlimited",
    language: {
      description: "Availability in all 24 languages",
      available: true,
    },
    editable: {
      description: "Editable labels",
      available: true,
    },
    training: {
      description: "Group training sessions",
      available: true,
    },
    tokenization: {
      description: "3 Tonenized wine",
      available: true,
    },
    analytics: {
      description: "Analytics dashboard",
      available: true,
    },
    earlyAccess: {
      description: 'Early acces to "Winery Operations Management" Platform',
      available: true,
    },
  },
];
