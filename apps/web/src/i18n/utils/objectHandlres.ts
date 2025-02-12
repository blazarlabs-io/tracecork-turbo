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
  if (typeof obj !== "object") return obj;
  const baseData: { [k: string]: any } = deepCopyObject(obj);
  Object.keys(obj).forEach((docKey) => {
    const docField = obj[`${docKey}`];
    if (Array.isArray(docField)) {
      baseData[`${docKey}`] = getArrayTypeData(docField);
    } else {
      baseData[`${docKey}`] = setObjectContent(docField);
    }
  });
  return baseData;
};

const getArrayTypeData = (fieldValue: any[]) => {
  const mdData = sanityBlockToMarkdown(fieldValue);
  if (!!mdData) return mdData;
  const linkData = parseLinkSanityData(fieldValue);
  if (!!linkData) return linkData;
  const statCardData = parseStatCardSanityData(fieldValue);
  if (!!statCardData) return statCardData;
  return setArrayContent(fieldValue);
};

export const setArrayContent = (fieldValue: any[]) => {
  const newArray = fieldValue.map((fValue) => {
    const baseData: { [k: string]: any } = deepCopyObject(fValue);
    Object.keys(fValue).forEach((docKey) => {
      const docField = fValue[`${docKey}`];
      if (Array.isArray(docField)) {
        baseData[`${docKey}`] = Object.assign({}, docField);
      }
    });
    return baseData;
  });
  return Object.assign({}, newArray);
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
