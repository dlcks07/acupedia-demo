import { LibraryItem, PaginationBox, SearchItem } from 'components';
import { searchApi } from 'libs/api';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/wiki.css';

const LIMIT = 20;

function Library() {
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
    ['searchLibraries', word, (+offset - 1) * LIMIT],
    searchApi.searchLibrary,
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
    }
  }, [location]);

  return (
    <div className="subLeft__container">
      <Helmet>
        <title>{`${word} - 아큐피디아 학술자료 검색`}</title>
        <meta name="description" content={`아큐피디아 학술자료 검색 결과 - '${word}' 관련 학술자료를 제공합니다.`} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`https://www.acupedia.net/library?search=${encodeURIComponent(word)}&index=${offset}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="아큐피디아" />
        <meta property="og:title" content={`${word} - 아큐피디아 학술자료 검색`} />
        <meta property="og:description" content={`아큐피디아 학술자료 검색 결과 - '${word}' 관련 학술자료를 제공합니다.`} />
        <meta property="og:url" content={`https://www.acupedia.net/library?search=${encodeURIComponent(word)}&index=${offset}`} />
        <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
      </Helmet>
      <div>
        {isLoading ? null : (
          <SearchItem title="학술 자료庫" subtitle="Acupedia Library">
            {data.data.libraries.length === 0 ? (
              <span className="no-data">
                학술 자료庫 검색 결과가 없습니다.
              </span>
            ) : (
              data.data.libraries.map((item: any, index: number) => {
                return <LibraryItem key={index} highlight={word} item={item} />;
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

export default Library;
