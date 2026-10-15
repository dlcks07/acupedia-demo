import { HistoryItem } from 'components';
import { wikiApi } from 'libs/api';
import { cls } from 'libs/utils';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import settingSlice from 'slices/setting';
import { useAppDispatch } from 'store';
import { Helmet } from 'react-helmet-async';

function WikiHistory() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigation = useNavigate();
  const curIndex = +location?.search?.split('?')[1].split('&')[1].split('=')[1];
  const title = decodeURI(location?.search?.split('?')[1].split('&')[0].split('=')[1]);
  const curLocation = location.pathname + location.search;
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem('jwtToken'));
  const [MAX_NUM, setMAX_NUM] = useState(0);
  const { data, isLoading } = useQuery(
    ['history', title, curIndex - 1, jwtToken],
    wikiApi.wikiHistoryAll,
    {
      onSuccess: (data) => setMAX_NUM(Math.floor(data?.data.totalCount / 50) + 1)
    }
  );
  console.log(data);

  const onReadClick = () => {
    navigation({
      pathname: '/wikiDetail',
      search: `?title=${title}`
    });
  };
  const onEditClick = () => {
    if (jwtToken) {
      navigation({
        pathname: '/wikiEdit',
        search: `?title=${title}`
      });
    } else {
      dispatch(
        settingSlice.actions.setLastPageBeforeLogin({ lastPageBeforeLogin: curLocation })
      );
      navigation('/login');
    }
  };
  const onLeftClick = () => {
    if (curIndex === 1) {
      return;
    }
    navigation({
      search: `?title=${title}&index=${curIndex - 1}`
    });
  };
  const onRightClick = () => {
    if (curIndex === MAX_NUM) {
      return;
    }
    navigation({
      search: `?title=${title}&index=${curIndex + 1}`
    });
  };

  const refreshJwtToken = () => {
    setJwtToken(sessionStorage.getItem('jwtToken'));
  };

  useEffect(() => {
    window.addEventListener('storage', refreshJwtToken);

    return () => {
      window.removeEventListener('storage', refreshJwtToken);
    };
  }, []);

  return isLoading ? null : (
  <div className="subLeft__container">
    <Helmet>
      <title>{`${title} - 아큐피디아 위키 히스토리`}</title>
      <meta name="description" content={`아큐피디아 위키 - ${title} 항목의 편집 히스토리입니다.`} />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={`https://www.acupedia.net/wikiHistory?title=${encodeURIComponent(title)}&index=${curIndex}`} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="아큐피디아" />
      <meta property="og:title" content={`${title} - 아큐피디아 위키 히스토리`} />
      <meta property="og:description" content={`아큐피디아 위키 - ${title} 항목의 편집 히스토리입니다.`} />
      <meta property="og:url" content={`https://www.acupedia.net/wikiHistory?title=${encodeURIComponent(title)}&index=${curIndex}`} />
      <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
    </Helmet>
    <div className="subLeft__header">
      <div className="subLeft__titleBox">
        <span className="subLeft__title">
          {title.replace(/ /g, '\u00a0')}
        </span>
      </div>
      <div className="subLeft__tools">
        <div className="subLeft__toolbar">
          <span onClick={onReadClick} className="subLeft__btn">읽기</span>
          <span onClick={onEditClick} className="subLeft__btn"> 편집</span>
          <span className="subLeft__btn current">히스토리</span>
        </div>
      </div>
    </div>

    <div className="historyListNav">
      <div
        onClick={onLeftClick}
        className={cls(
          curIndex === 1 ? 'opacity-20' : 'cursor-pointer',
           'flex-1 justify-center flex'
        )}
      >
        {'< Prev'}
      </div>
      <div className="historyListNav__divider" />
      <div
        onClick={onRightClick}
        className={cls(
          curIndex === MAX_NUM ? 'opacity-20' : 'cursor-pointer',
          'flex-1 justify-center flex'
        )}
      >
        {'Next >'}
      </div>
    </div>

    <div className="historyList">
      {data.data.wikiHistoryResponses.map((item: any, index: number) => (
        <HistoryItem
          key={index}
          index={index}
          curLocation={curLocation}
          curIndex={curIndex}
          title={title}
          item={item}
        />
      ))}
    </div>

    <div className="historyListNav">
      <div
        onClick={onLeftClick}
        className={cls(
          curIndex === 1 ? 'opacity-20' : 'cursor-pointer',
          'flex-1 justify-center flex'
        )}
      >
        {'< Prev'}
      </div>
      <div className="historyListNav__divider" />
      <div
        onClick={onRightClick}
        className={cls(
          curIndex === MAX_NUM ? 'opacity-20' : 'cursor-pointer',
          'flex-1 justify-center flex'
        )}
      >
        {'Next >'}
      </div>
    </div>
  </div>
);
}

export default WikiHistory;
