"use client";

import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

interface MathContentProps {
  content: string;
}

export function MathContent({ content }: MathContentProps) {
  // Parse content and replace $...$ with InlineMath and $$...$$ with BlockMath
  const parseContent = (text: string) => {
    const parts: (string | JSX.Element)[] = [];
    let key = 0;

    // First handle block math ($$...$$)
    const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;
    const textWithoutBlocks: string[] = [];
    const blockMaths: { index: number; content: string }[] = [];

    let lastIndex = 0;
    let blockMatch;
    while ((blockMatch = blockMathRegex.exec(text)) !== null) {
      textWithoutBlocks.push(text.slice(lastIndex, blockMatch.index));
      blockMaths.push({
        index: textWithoutBlocks.length,
        content: blockMatch[1].trim(),
      });
      lastIndex = blockMatch.index + blockMatch[0].length;
    }
    textWithoutBlocks.push(text.slice(lastIndex));

    // Now process each text segment for inline math
    textWithoutBlocks.forEach((segment, segmentIndex) => {
      const inlineMathRegex = /\$([^$]+)\$/g;
      let inlineMatch;
      let segmentLastIndex = 0;

      while ((inlineMatch = inlineMathRegex.exec(segment)) !== null) {
        // Add text before the math
        if (inlineMatch.index > segmentLastIndex) {
          const textBefore = segment.slice(segmentLastIndex, inlineMatch.index);
          if (textBefore.trim()) {
            parts.push(textBefore);
          }
        }

        // Add inline math
        parts.push(
          <span key={`inline-${key++}`} className="inline-flex items-center mx-1 text-lg">
            <InlineMath math={inlineMatch[1].trim()} />
          </span>
        );

        segmentLastIndex = inlineMatch.index + inlineMatch[0].length;
      }

      // Add remaining text
      if (segmentLastIndex < segment.length) {
        const remainingText = segment.slice(segmentLastIndex);
        if (remainingText.trim()) {
          parts.push(remainingText);
        }
      }

      // Add block math if exists after this segment
      const blockMath = blockMaths.find((bm) => bm.index === segmentIndex);
      if (blockMath) {
        parts.push(
          <div key={`block-${key++}`} className="my-6 flex justify-center">
            <BlockMath math={blockMath.content} />
          </div>
        );
      }
    });

    return parts;
  };

  // Process markdown-style bold (**text**)
  const processMarkdown = (text: string) => {
    return text.split(/(\*\*[^*]+\*\*)/g).map((segment, i) => {
      if (segment.startsWith("**") && segment.endsWith("**")) {
        return (
          <strong key={`bold-${i}`} className="font-bold text-white">
            {segment.slice(2, -2)}
          </strong>
        );
      }
      return segment;
    });
  };

  // Split content by newlines first to preserve paragraph structure
  const paragraphs = content.split('\n').filter(p => p.trim());

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, pIndex) => (
        <div key={`para-${pIndex}`} className="text-primary-100 leading-relaxed">
          {parseContent(paragraph).map((part, index) =>
            typeof part === "string" ? (
              <span key={`text-${index}`}>
                {processMarkdown(part)}
              </span>
            ) : (
              part
            )
          )}
        </div>
      ))}
    </div>
  );
}
