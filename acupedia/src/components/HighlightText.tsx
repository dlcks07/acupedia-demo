import React from 'react';

const HighlightText = ({ text, highlight }: any) => {
  const content = text?.split(highlight);
  return content?.map((normal: string, i: number) => (
    <React.Fragment key={i}>
      {i > 0 ? (
        <>
          <span className="highlight__tit">{highlight}</span>
          <span className="">{normal}</span>
        </>
      ) : (
        <span>{normal}</span>
      )}
    </React.Fragment>
  ));
};

export default HighlightText;
