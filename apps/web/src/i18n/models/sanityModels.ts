export type BlockChildrenType = {
  _key: string;
  _type: string;
  marks: string[];
  text: string;
};

export type MarkRefType = {
  _key: string;
  _type: string;
  href: string;
};

export type SanityBlockType = {
  _key: string;
  _type: "block";
  children: BlockChildrenType[];
  markDefs: MarkRefType[];
  style: string;
};
