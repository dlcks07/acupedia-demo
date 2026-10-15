import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { AcupointsItem, Loading, PaginationBox, SearchItem } from 'components';
import { searchApi } from 'libs/api';
import { cls } from 'libs/utils';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/wiki.css';

const LIMIT = 5;

function Acupoints() {
  const navigation = useNavigate();
  const location = useLocation();
  const [curPass, setCurPass] = useState(
    Math.floor(
      (+location?.search?.split('?')[1].split('&')[1].split('=')[1] - 1) / LIMIT
    )
  );
  const [MAX_NUM, setMAX_NUM] = useState(0);
  const word = decodeURIComponent(
    location?.search?.split('?')[1].split('&')[0].split('=')[1]
  );
  const offset = +location?.search?.split('?')[1].split('&')[1].split('=')[1];
  const { data, isLoading } = useQuery(
    ['searchAcupoints', word, (+offset - 1) * 5],
    searchApi.searchAcupoint,
    {
      onSuccess: (data) =>
        setMAX_NUM(
          Math.floor(
            data?.data.totalCount % LIMIT === 0
              ? data?.data.totalCount / LIMIT
              : data?.data.totalCount / LIMIT + 1
          )
        ),
    }
  );
  console.log(offset);

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
      search: `?search=${word}&index=${offset - 1}`,
    });
  };
  const onRightClick = () => {
    if (offset === MAX_NUM) {
      return;
    }
    navigation({
      search: `?search=${word}&index=${offset + 1}`,
    });
  };

  useEffect(() => {
    setCurPass(Math.floor((+offset - 1) / LIMIT));
    if (location.key === 'default') {
      // TODO 네비게이션 변경
      // navigation(-1);
    }
  }, [location]);

  return (
    <div>
      <Helmet>
        <title>{`${word} - 아큐피디아 경혈주치 검색`}</title>
        <meta name="description" content={`아큐피디아 경혈주치 검색 결과 - '${word}' 관련 경혈 정보를 제공합니다.`} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`https://www.acupedia.net/acupoints?search=${encodeURIComponent(word)}&index=${offset}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="아큐피디아" />
        <meta property="og:title" content={`${word} - 아큐피디아 경혈주치 검색`} />
        <meta property="og:description" content={`아큐피디아 경혈주치 검색 결과 - '${word}' 관련 경혈 정보를 제공합니다.`} />
        <meta property="og:url" content={`https://www.acupedia.net/acupoints?search=${encodeURIComponent(word)}&index=${offset}`} />
        <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
      </Helmet>
      <div className="subLeft__container">
        {isLoading ? null : (
          <SearchItem title="경혈주치" subtitle="Acupoint indication">
            {data.data.searchResultAcupoint.length === 0 ? (
              <span className="no-data">
                경혈 검색 결과가 없습니다.
              </span>
            ) : (
              data.data.searchResultAcupoint.map((item: any, index: number) => {
                return (
                  <AcupointsItem key={index} highlight={word} item={item} />
                );
              })
            )}
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
            limit={5}
          />
        </div>
      ) : null}
    </div>
  );
}

export default Acupoints;
