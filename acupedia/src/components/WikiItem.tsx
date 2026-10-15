import dayjs from 'dayjs';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  item: any;
}

function WikiItem({ item }: Props) {
  const location = useLocation();
  const navigation = useNavigate();
  const time = dayjs(item.lastUpdatedAt).format('YYYY-MM-DD hh:mm:ss');

  const onWikiClick = () => {
    navigation({
      pathname: '/wikiDetail',
      search: `?title=${item.wikiTitle}`
    });
  };

  return (
    <div className="searchitem__listRow">
      <div className="searchitem__list-item subject">
        <div onClick={onWikiClick} className="cursor-pointer  flex">
          {location.pathname !== '/wiki' ? (
            <span className="text-[18px]">{'·  '}</span>
          ) : null}
          <div className="">
            <span className="searchitem__item-link">
              {item.wikiTitle.replace(/ /g, '\u00a0')}
            </span>
          </div>
        </div>
      </div>
      <span className="searchitem__list-item writer">{item.lastModifierNickname}</span>
      <span className="searchitem__list-item time">{time}</span>
    </div>
  );
}

export default WikiItem;
