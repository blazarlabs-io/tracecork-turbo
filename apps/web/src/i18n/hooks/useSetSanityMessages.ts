import { SanityDocument } from "@sanity/client";
import { client } from "../../lib/sanity/client";
import { cleanedObj, setObjectContent } from "../utils/objectHandlres";

export const useSetSanityMessages = async (locale: string) => {
  const sanityData = await client.fetch<SanityDocument>(
    `*[_type in ["publicPages", "publicComponents"]]`,
  );
  // const sanityData = await client.fetch<SanityDocument>(
  //   `*[_type in ["publicPages", "publicComponents"] && language == ${JSON.stringify(locale)}]`,
  // );

  // const publicPages = await client.fetch("*");

  const mainData: any = {
    LocaleSwitcher: {
      label: "Language",
    },
  };

  sanityData.forEach((page: any) => {
    if (!page["language"]) return;
    const lang = page["language"];
    // console.log(lang);
    mainData["LocaleSwitcher"][`${lang}`] = page["language"];
    const cleanedData = cleanedObj(page);
    const formatedData = setObjectContent(cleanedData);
    mainData[`${lang}`] = {
      ...mainData[`${lang}`],
      ...formatedData,
    };
  });

  return mainData;
};
