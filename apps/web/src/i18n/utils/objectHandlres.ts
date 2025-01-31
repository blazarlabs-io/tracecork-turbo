import {
  parseLinkSanityData,
  parseStatCardSanityData,
  sanityBlockToMarkdown,
} from "./sanityDataParser";

export const deepCopyObject = (obj: object) => JSON.parse(JSON.stringify(obj));

export const cleanedObj = (obj: object) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => !key.startsWith("_")),
  );

export const setObjectContent = (obj: any) => {
  const baseData: { [k: string]: any } = deepCopyObject(obj);
  Object.keys(obj).forEach((docKey) => {
    const docField = obj[`${docKey}`];
    Object.keys(docField).forEach((fieldKey) => {
      const fieldValue = docField[`${fieldKey}`];
      if (!Array.isArray(fieldValue)) return;
      const mdData = sanityBlockToMarkdown(fieldValue);
      if (!!mdData) {
        baseData[`${docKey}`][`${fieldKey}`] = mdData;
        return;
      }
      const linkData = parseLinkSanityData(fieldValue);
      if (!!linkData) {
        baseData[`${docKey}`][`${fieldKey}`] = linkData;
        return;
      }
      const statCardData = parseStatCardSanityData(fieldValue);
      if (!!statCardData) {
        baseData[`${docKey}`][`${fieldKey}`] = statCardData;
        return;
      }
    });
  });
  return baseData;
};

export const setLanguageObject = (
  dataKey: string,
  lang: string,
  langObject: { [key: string]: Set<string> },
) => {
  if (langObject[`${dataKey}`]) {
    langObject[`${dataKey}`]?.add(lang);
  } else {
    const a = new Set([lang]);
    langObject[`${dataKey}`] = new Set([lang]);
  }
};

export const setLanguagesArray = (
  mainData: any,
  langObject: { [key: string]: Set<string> },
) => {
  const sets = Object.values(langObject);
  const commonLang = [...(sets[0] || [])].filter((value) =>
    sets.every((set) => set.has(value)),
  );
  commonLang.forEach((lang) => {
    mainData["LocaleSwitcher"][`${lang}`] = lang;
  });
};
