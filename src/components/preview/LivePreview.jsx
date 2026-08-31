import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export const LivePreview = ({ markdown }) => {
  return (
    <div className="w-full p-5 sm:p-7 min-h-[480px]">
      <div className="github-markdown max-w-full overflow-hidden">
        {markdown ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              ),
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  loading="lazy"
                  className="inline-block max-w-full h-auto rounded-xs my-0.5"
                />
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        ) : (
          <div className="text-center py-20 text-muted-foreground text-xs">
            Add blocks on the left to start building your GitHub Profile README.
          </div>
        )}
      </div>
    </div>
  );
};
