import React from 'react';
import { useLocation } from 'react-router-dom';
import HighlightText from './HighlightText';

interface Props {
  highlight?: string;
  item: string;
}

function PrescriptionItem({ highlight = '', item }: Props) {
  const location = useLocation();
  return (
    <div className="Prescription__content_row">
      {item.split('\\n').map((item: string, index: number) => {
        if (location.pathname.includes('/searchResult')) {
          if (index > 2) return;
          if (index > 1) {
            return <span key={index}>...</span>;
          }
        }
        return (
          <React.Fragment key={index}>
            <p className="">
              <HighlightText text={item} highlight={highlight} />
            </p>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default PrescriptionItem;
