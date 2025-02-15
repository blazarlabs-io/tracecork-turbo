import { SanityDocument } from "@sanity/client";
import { client } from "../../lib/sanity/client";
import {
  cleanedObj,
  setLanguageObject,
  setMainLanguages,
  setObjectContent,
} from "../utils/objectHandlres";

export const useSetSanityMessages = async () => {
  // const sanityData = await client.fetch<SanityDocument>(
  //   `*[_type in ["publicPages"]]`,
  // );
  // // const sanityData = await client.fetch<SanityDocument>(
  // //   `*[_type in ["publicPages", "publicComponents"] && language == ${JSON.stringify(locale)}]`,
  // // );

  const sanityData = await client.fetch<SanityDocument>("*");

  const mainData: { [key: string]: any } = {};

  const langObject: { [key: string]: Set<string> } = {};

  sanityData.forEach((page: any) => {
    if (!page["language"]) return;
    if (page["_type"] === "pages") return;
    const lang = page["language"];
    const cleanedData = cleanedObj(page);
    const formatedData = setObjectContent(cleanedData);
    mainData[`${lang}`] = {
      ...mainData[`${lang}`],
      [`${page["_type"]}`]: {
        ...formatedData,
      },
    };
    setLanguageObject(page["_type"], lang, langObject);
  });

  setMainLanguages(mainData, langObject);

  return mainData;
};
