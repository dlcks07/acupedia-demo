import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { PaginationBox, SearchItem, WikiItem } from 'components';
import { searchApi } from 'libs/api';
import { cls } from 'libs/utils';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/wiki.css';

const LIMIT = 20;

function Wiki() {
  const navigation = useNavigate();
  const location = useLocation();
  const [curPass, setCurPass] = useState(
    Math.floor((+location?.search?.split('?')[1].split('=')[1] - 1) / LIMIT)
  );

  const [MAX_NUM, setMAX_NUM] = useState(0);
  const word = decodeURIComponent(
    location?.search?.split('?')[1].split('&')[0].split('=')[1]
  );
  const offset = +location?.search?.split('?')[1].split('&')[1].split('=')[1];
  const { data, isLoading } = useQuery(
    ['searchWiki', word, (+offset - 1) * LIMIT],
    searchApi.searchWiki,
    {
      onSuccess: (data) =>
        setMAX_NUM(
          Math.floor(
            data?.data.totalCount % LIMIT === 0
              ? data?.data.totalCount / LIMIT
              : data?.data.totalCount / LIMIT + 1
          )
        )
    }
  );
  console.log(data);

  const onNumClick = (index: number) => {
  
    if (index > MAX_NUM) return;
  
    navigation({
      search: `?search=${word}&index=${index}`,
    });
  };

  const onLeftClick = () => {
    if (offset === 1) {
      return;
    }
    navigation({
      search: `?search=${word}&index=${offset - 1}`
    });
  };
  const onRightClick = () => {
    if (offset === MAX_NUM) {
      return;
    }
    navigation({
      search: `?search=${word}&index=${offset + 1}`
    });
  };

  useEffect(() => {
    setCurPass(Math.floor((offset - 1) / 8));
    if (location.key === 'default') {
      // navigation(-1);
    }
  }, [location]);

  return (
    <div className="subLeft__container">
      <Helmet>
        <title>{`${word} - 아큐피디아 위키 검색`}</title>
        <meta name="description" content={`아큐피디아 위키 검색 결과 - '${word}' 관련 위키 항목을 보여줍니다.`} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`https://www.acupedia.net/wiki?search=${encodeURIComponent(word)}&index=${offset}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="아큐피디아" />
        <meta property="og:title" content={`${word} - 아큐피디아 위키 검색`} />
        <meta property="og:description" content={`아큐피디아 위키 검색 결과 - '${word}' 관련 위키 항목을 보여줍니다.`} />
        <meta property="og:url" content={`https://www.acupedia.net/wiki?search=${encodeURIComponent(word)}&index=${offset}`} />
        <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
      </Helmet>
      <div>
        {isLoading ? null : (
          <SearchItem title="위키항목" subtitle="Wiki">            
            <div className="searchitem__listWrap">
              <div className="searchitem__listRow listhead">
                <div className="searchitem__list-item subject">제목</div>
                <div className="searchitem__list-item writer">수정자</div>
                <div className="searchitem__list-item time">수정시간</div>
              </div>
              {data.data.wikis.map((item: any, index: number) => {
                return <WikiItem key={index} item={item} />;
              })}
            </div>
          </SearchItem>         
        )}
      </div>
      
      {!isNaN(MAX_NUM) && !isNaN(curPass) && !isNaN(offset) ? (
        <div className="paginationWrap">
          <PaginationBox
            MAX_NUM={MAX_NUM}
            curPass={curPass}
            offset={offset}
            onLeftClick={onLeftClick}
            onNumClick={onNumClick}
            onRightClick={onRightClick}
            limit={20}
          />
        </div>
      ) : null}
    </div>
  );
}

export default Wiki;
