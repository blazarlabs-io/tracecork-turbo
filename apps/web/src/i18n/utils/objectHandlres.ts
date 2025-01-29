import { sanityBlockToMarkdown } from "./sanityDataParser";

export const deepCopyObject = (obj: object) => JSON.parse(JSON.stringify(obj));

export const cleanedObj = (obj: object) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => !key.startsWith("_")),
  );

/*
This function parse the fields that are block data to string in markdown format

*/
export const setObjectContent = (obj: any) => {
  const baseData: { [k: string]: any } = deepCopyObject(obj);
  Object.keys(obj).forEach((docKey) => {
    const docField = obj[`${docKey}`];
    Object.keys(docField).forEach((fieldKey) => {
      const fieldValue = docField[`${fieldKey}`];
      if (!Array.isArray(fieldValue)) return;
      const mdData = sanityBlockToMarkdown(fieldValue);
      baseData[`${docKey}`][`${fieldKey}`] = mdData;
    });
  });
  return baseData;
};
