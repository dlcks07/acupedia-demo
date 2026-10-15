import HighlightLibrary from 'components/HighlightLibrary';
import HighlightTextTitle from 'components/HighlightTextTitle';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  item: any;
  highlight?: string;
}

function LibraryItem({ item, highlight = '' }: Props) {
  const location = useLocation();
  const navigation = useNavigate();
  const word = decodeURIComponent(
    location?.search?.split('?')[1].split('&')[0].split('=')[1]
  );
  const content = item.content?.replace('\n', '');
  const onLibraryClick = () => {
    navigation({
      pathname: '/libraryDetail',
      search: `?title=${item.libraryTitle}`,
    });
  };
  /*
<div className="space-y-[20px] mt-6 pl-[20px] ">
        {location.pathname !== '/library' ? null : (
          <HighlightLibrary text={content} highlight={highlight} />
        )}
      </div>
*/
  return (
    <div className="libraryItem__row ">
        <div className="libraryItem__titleWrapper">
          <div onClick={onLibraryClick} className="libraryItem__titleClickArea">
            {location.pathname !== '/library' ? (
              <span className="libraryItem__titleBullet">{'·  '}</span>
            ) : null}
            
            <span className="libraryItem__titleText">
              <HighlightTextTitle
                text={item.libraryTitle.replace(/ /g, '\u00a0')}
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

export default LibraryItem;
