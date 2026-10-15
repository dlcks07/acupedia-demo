import React from 'react';

const HighlightTextTitle = ({ text, highlight }: any) => {
  const content = text?.split(new RegExp(`(${highlight})`, 'gi'));

  return content?.map((part: string, index: number) => {
    if (part.toLowerCase() === highlight.toLowerCase()) {
      return (
        <React.Fragment key={index}>
          <span className="highlight__text">{part}</span>
        </React.Fragment>
      );
    } else {
      return <React.Fragment key={index}>{part}</React.Fragment>;
    }
  });
};

export default HighlightTextTitle;
