import { toCamelCase } from "@/utils/data-handlers";
import {
  SanityBlockType,
  SanityLinkType,
  SanityStatCardType,
} from "../models/sanityModels";

/* This function parse the fields that are block data to string in markdown format
 */
export function sanityBlockToMarkdown(blocks: SanityBlockType[]) {
  const mkTextArray = blocks.map((block) => {
    if (!block.children) return ""; // Skip if no children

    const markDefs = block.markDefs || []; // Store link definitions

    const text = block.children
      .map((child) => {
        let content = child.text;

        if (child.marks) {
          child.marks.forEach((mark) => {
            const markDef = markDefs.find((m) => m._key === mark); // Find link definition
            if (markDef && markDef._type === "link") {
              content = `[${content}](${markDef.href})`;
            }
            if (mark === "strong") content = `**${content}**`;
            if (mark === "em") content = `*${content}*`;
          });
        }

        return content;
      })
      .join("");

    // Handle different block types
    switch (block.style) {
      case "h1":
        return `# ${text}`;
      case "h2":
        return `## ${text}`;
      case "h3":
        return `### ${text}`;
      case "h4":
        return `#### ${text}`;
      case "blockquote":
        return `> ${text}`;
      case "normal":
        return text;
      default:
        return text;
    }
  });
  const isEmptyData = mkTextArray.every((v) => !v);
  if (isEmptyData) return;
  return mkTextArray.join("\n\n"); // Separate blocks with new lines
}

type LinksObjType = { [key: string]: { label: string; url: string } };

export function parseLinkSanityData(data: SanityLinkType[]) {
  const linksObj: LinksObjType = {};
  data.forEach((d, i) => {
    if (d._type !== "link") return;
    if (!d.label) return;
    const pathName = d.url.split("//")[1]?.split("/")[1];
    const newKey = toCamelCase(pathName || `${i}`);
    linksObj[`${newKey}`] = {
      label: d.label,
      url: d.url,
    };
  });
  if (!Object.keys(linksObj).length) return;
  return linksObj;
}

type StatCardType = { [key: string]: { [key: string]: string } };

export function parseStatCardSanityData(data: SanityStatCardType[]) {
  const linksObj: StatCardType = {};
  data.forEach((d, i) => {
    if (d._type !== "statCard") return;
    const newKey = `${i}`;
    linksObj[`${newKey}`] = {
      ...d,
    };
  });
  if (!Object.keys(linksObj).length) return;
  return linksObj;
}
