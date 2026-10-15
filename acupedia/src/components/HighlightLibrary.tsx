import React from 'react';

const HighlightLibrary = ({ text, highlight }: any) => {
  const linkPattern = /\[([^\]]+)\]\((http[s]?:\/\/[^\)]+)\)/g;
  const plainText = text
    // 이미지 링크 제거
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove Markdown syntax
    .replace(/(^|\W)(\*|_){1,2}(\S.*?\S|\S)\2(?!\w)/g, '$1$3')
    .replace(/#/g, '')
    .replace(/\|/g, '')
    .replace(/\*/g, '')
    .replace(linkPattern, '$1')
    // Convert escaped HTML characters to plain text
    .replace(/&[a-z]+;/gi, (match: string) => {
      switch (match) {
        case '&amp;':
          return '&';
        case '&lt;':
          return '<';
        case '&gt;':
          return '>';
        case '&quot;':
          return '"';
        case '&apos;':
          return "'";
        case '&nbsp;':
          return '';
        default:
          return match;
      }
    });

  const content = plainText?.split(highlight);
  let start = 0;
  let end = plainText.length;

  if (content.length === 1) {
    // if no highlight, output up to 120 characters from the front of the text
    end = Math.min(plainText.length, 120);
  } else {
    // if highlight is present, output 60 characters before and after the highlight
    const highlightStart = plainText
      .toLowerCase()
      .indexOf(highlight.toLowerCase());
    start = Math.max(0, highlightStart - 60);
    end = Math.min(plainText.length, highlightStart + highlight.length + 60);

    // 출력되는 내용에 highlight가 또 있는지 확인
    const nextHighlightStart = plainText.indexOf(
      highlight,
      highlightStart + highlight.length
    );
    if (nextHighlightStart !== -1 && nextHighlightStart < end) {
      // if another highlight is found, update the end position to include it
      end = nextHighlightStart + highlight.length + 60;
    }
  }

  // extract the text within the output range
  const truncatedText = plainText.substring(start, end);

  // highlight the search term within the truncated text
  const highlighted = truncatedText
    .split(new RegExp(`(${highlight})`, 'gi'))
    .map((str: string, i: number) => {
      if (str.toLowerCase() === highlight.toLowerCase()) {
        return (
          <React.Fragment key={i}>
            <span className="highlight__tit">{str}</span>
          </React.Fragment>
        );
      } else {
        return <React.Fragment key={i}>{str}</React.Fragment>;
      }
    });

  return <>{highlighted}</>;
};

export default HighlightLibrary;
