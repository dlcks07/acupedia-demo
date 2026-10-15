import HighlightLibrary from 'components/HighlightLibrary';
import HighlightTextTitle from 'components/HighlightTextTitle';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  highlight?: string;
  item: {
    kcdTitle: any;
    content: any;
  };
}

function KcdItem({ item, highlight = '' }: Props) {
  const location = useLocation();
  const navigation = useNavigate();
  const word = decodeURIComponent(
    location?.search?.split('?')[1].split('&')[0].split('=')[1]
  );
  const content = item.content?.replace('\n', '');
  const onLibraryClick = () => {
    navigation({
      pathname: '/libraryDetail',
      search: `?title=${item.kcdTitle}`,
    });
  };
  return (
    <div className="libraryItem__row ">
        <div className="libraryItem__titleWrapper">
          <div onClick={onLibraryClick} className="libraryItem__titleClickArea">            
            
            <span className="libraryItem__titleText">
              <HighlightTextTitle
                text={item.kcdTitle.replace(/ /g, '\u00a0')}
                highlight={highlight || ''}
              />
            </span>

          </div>
        </div>

        <div className="libraryItem__content">
          <HighlightLibrary text={content} highlight={highlight} />
        </div>

    </div>
  );
}

export default KcdItem;
