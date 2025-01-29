import { SanityBlockType } from "../models/sanityModels";

export function sanityBlockToMarkdown(blocks: SanityBlockType[]) {
  return blocks
    .map((block) => {
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
    })
    .join("\n\n"); // Separate blocks with new lines
}
