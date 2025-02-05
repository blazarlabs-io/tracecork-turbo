import ReactMarkdown from "react-markdown";

const MarkdownPreviewer = ({ content }: { content: any }) => {
  return <ReactMarkdown>{content}</ReactMarkdown>;
};

export default MarkdownPreviewer;
