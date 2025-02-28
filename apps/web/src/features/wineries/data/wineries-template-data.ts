import { DynamicQrCode, Settings, Wine, Winery, WineryInfo } from "@/types/db";
import { Timestamp } from "firebase/firestore";

export const initialCoordinates = {
  lat: "47.01107733788858",
  lng: "28.85817396285048",
};

export const wineryInfoTemplate: WineryInfo = {
  name: "",
  avatar: "/images/avatar.svg",
  foundedIn: "",
  createdAt: Timestamp.fromDate(new Date()),
  lastUpdated: Timestamp.fromDate(new Date()),
  wineCollections: "",
  bottlesProduced: "",
  vineyardsSurface: "",
  grapeVarieties: "",
  certifications: [],
  headquarters: initialCoordinates,
  representative: {
    name: "",
    phone: "",
    email: "",
  },
};

export const settingsTemplate: Settings = {
  theme: "light",
  language: "en",
  autosave: true,
};

export const wineryTemplate: Winery = {
  id: "",
  info: wineryInfoTemplate,
  settings: settingsTemplate,
  billing: {
    level: "bronze",
  },
  isVerified: false,
};

export const wineTemplate: Wine = {
  uid: "",
  id: "",
  qrCode: "",
  publicUrl: "",
  status: "draft",
  isReadyToPublish: false,
  createdAt: Timestamp.fromDate(new Date()),
  lastUpdated: Timestamp.fromDate(new Date()),
  generalInfo: {
    image: "/images/wine.jpg",
    wineryName: "",
    collectionName: "",
    volume: "",
    type: "",
    grapeVarieties: [],
    country: "",
    cdo: "",
    collectionSize: "",
  },
  ingredients: {
    rawMaterial: "",
    alcoholByVolume: "",
    sugar: "",
    acidityRegulators: [],
    stabilizers: [],
    finingAgents: [],
    antioxidants: [],
  },
  nutritionalInfo: {
    energy: "",
    fat: "",
    carbohydrates: "",
    protein: "",
    salt: "",
  },
  profile: {
    color: "",
    aromaProfile: [],
    flavorProfile: [],
    perceivedAlcohol: "",
    sweetness: "",
    acidityLevel: "",
    taningLevel: "",
    barrelFermented: [],
    awards: [],
  },
  makingTechnique: {
    vegan: null,
    organic: null,
    bioDynamic: null,
    natural: null,
    fermentationType: [],
    yeastType: [],
    ageingPotential: "",
  },
  terroir: {
    vineyardName: "",
    cdo: "",
    sunExposure: "",
    elevation: "",
    ageOfVines: "",
    soilType: [],
    irrigationPractices: [],
    vineyardLocation: [],
    grapesHarvesing: {
      method: "",
      yieldPerHa: "",
    },
  },
  likes: 0,
};

export const dynamicQrCodeTemplate: DynamicQrCode = {
  uid: "",
  wineId: "",
  imageUrl: "",
  staticUrl: "",
  redirectUrl: "",
  createdAt: Timestamp.fromDate(new Date()),
  lastUpdated: Timestamp.fromDate(new Date()),
};
