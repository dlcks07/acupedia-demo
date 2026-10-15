import { useEffect, useState, useRef } from 'react';
import {
  AcupointsItem,
  PrescriptionItem,
  SearchItem,
  WikiItem,
} from 'components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { searchApi } from 'libs/api';
import { useAppDispatch } from 'store';
import settingSlice from 'slices/setting';
import LibraryItem from 'components/LibraryItem';
import SearchItemPrescription from 'components/SearchItemPrescription';
import clsx from 'clsx';
import { Helmet } from 'react-helmet-async';

function SearchResult() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigation = useNavigate();
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem('jwtToken'));
  const curSearch = decodeURI(location.search.split('=')[1]);
  const curSearchdecode = decodeURIComponent(location.search.split('=')[1]);
  const [highlight, setHighlight] = useState(curSearch);
  const curLocation = location.pathname + location.search;
  const { data, isLoading } = useQuery(
    ['search', curSearch],
    searchApi.searchWord
  );
  // console.log(curSearch);
  console.log(data);

  const onWikiClick = () => {
    navigation({
      pathname: '/wiki',
      search: `?search=${curSearch}&index=1`,
    });
  };
  const onAcupointsClick = () => {
    navigation({
      pathname: '/acupoints',
      search: `?search=${curSearch}&index=1`,
    });
  };
  const onLibraryClick = () => {
    navigation({
      pathname: '/library',
      search: `?search=${curSearch}&index=1`,
    });
  };
  const onPrescriptionClick = () => {
    navigation({
      pathname: '/prescription',
      search: `?search=${curSearch}&index=1`,
    });
  };
  const onNewWikiClick = () => {
    dispatch(
      settingSlice.actions.setLastPageBeforeLogin({
        lastPageBeforeLogin: curLocation,
      })
    );
    navigation({
      pathname: jwtToken ? '/wikiEdit' : '/login',
      search: jwtToken ? '?title=newWiki' : '',
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

  useEffect(() => {
    setHighlight(curSearch);
  }, [curSearch]);

  const WikiRef = useRef<HTMLDivElement>(null);
  const LibraryRef = useRef<HTMLDivElement>(null);
  const AcupointRef = useRef<HTMLDivElement>(null);
  const PrescriptionRef = useRef<HTMLDivElement>(null); 

  const SearchTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('all');

    return (
      <div className="schResultTabWrap subLeft__container">
        {/* 탭 버튼 */}
        <div className="schResultTabs">
          <div onClick={() => setActiveTab('all')} className={clsx('schResultTabs__tab-btn', activeTab === 'all' && 'active')}>
            전체
          </div>
          <div onClick={() => setActiveTab('wiki')} className={clsx('schResultTabs__tab-btn', activeTab === 'wiki' && 'active')}>
            위키항목
          </div>
          <div onClick={() => setActiveTab('library')} className={clsx('schResultTabs__tab-btn', activeTab === 'library' && 'active')}>
            학술 자료庫
          </div>
          <div onClick={() => setActiveTab('acupoint')} className={clsx('schResultTabs__tab-btn', activeTab === 'acupoint' && 'active')}>
            경혈주치
          </div>
          <div onClick={() => setActiveTab('prescription')} className={clsx('schResultTabs__tab-btn', activeTab === 'prescription' && 'active')}>
            침구처방
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        {!isLoading && (
          <>
            {(activeTab === 'all' || activeTab === 'wiki') && (
              <div className="schResultTab_container">
                <SearchItem title="위키항목" subtitle="Acupedia Wiki">
                  <>
                    {!data.data.hasExactlyMath && (
                      <div className="searchitem__listRow">
                        <div className="searchitem__list-item subject">
                          <span
                            onClick={() =>
                              navigation({ pathname: '/wikiDetail', search: `?title=${curSearch}` })
                            }
                            className="cursor-pointer"
                          >
                            {location.pathname !== '/wiki' && (
                              <span className="libraryItem__titleBullet">{'·  '}</span>
                            )}
                            <span className="searchitem__item-link">{curSearchdecode}</span>
                          </span>
                        </div>
                        <span className="searchitem__list-item no-srcData bg-[#FFFCE4]">
                          작성된 위키가 없습니다.
                        </span>
                      </div>
                    )}
                    {data.data.wikis.slice(0, 4).map((item: any, index: number) => (
                      <WikiItem key={index} item={item} />
                    ))}
                  </>
                </SearchItem>
                {data.data.wikis.length > 0 && (
                  <div className="searchitem__list-more">
                    <span className="searchitem__more-btn" onClick={onWikiClick}>
                      [more..]
                    </span>
                  </div>
                )}
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'library') && (
              <div className="schResultTab_container">
                <SearchItem title="학술 자료庫" subtitle="Acupedia Library">
                  {data.data.libraries.length === 0 ? (
                    <div className="mt-4">
                      <span className="searchitem__list-item no-srcData">
                        작성된 학술 자료庫가 없습니다.
                      </span>
                    </div>
                  ) : (
                    data.data.libraries.slice(0, 4).map((item: any, index: number) => (
                      <LibraryItem key={index} item={item} highlight={highlight} />
                    ))
                  )}
                </SearchItem>
                {data.data.libraries.length > 0 && (
                  <div className="searchitem__list-more">
                    <span className="searchitem__more-btn" onClick={onLibraryClick}>
                      [more..]
                    </span>
                  </div>
                )}
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'acupoint') && (
              <div className="schResultTab_container">
                <SearchItem title="경혈주치" subtitle="Acupoint indication">
                  {data.data.acupoints.length === 0 ? (
                    <div className="mt-4">
                      <span className="searchitem__list-item no-srcData">
                        경혈주치 검색 결과가 없습니다.
                      </span>
                    </div>
                  ) : (
                    data.data.acupoints.slice(0, 3).map((item: any, index: number) => (
                      <AcupointsItem key={index} item={item} highlight={highlight} />
                    ))
                  )}
                </SearchItem>
                {data.data.acupoints.length > 0 && (
                  <div className="searchitem__list-more">
                    <span className="searchitem__more-btn" onClick={onAcupointsClick}>
                      [more..]
                    </span>
                  </div>
                )}
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'prescription') && (
              <div className="schResultTab_container">
                <SearchItemPrescription
                  title="대혈 및 침구처방"
                  subtitle="Acupoints combination & Acupuncture prescription"
                >
                  {!data.data.prescriptions.quotes ? (
                    <div className="mt-4">
                      <span className="searchitem__list-item no-srcData">
                        대혈 및 침구처방 검색 결과가 없습니다.
                      </span>
                    </div>
                  ) : (
                    data.data.prescriptions.quotes.slice(0, 3).map((item: any, index: number) => (
                      <PrescriptionItem key={index} item={item} highlight={highlight} />
                    ))
                  )}
                </SearchItemPrescription>
                {data.data.prescriptions.quotes && (
                  <div className="searchitem__list-more">
                    <span className="searchitem__more-btn" onClick={onPrescriptionClick}>
                      [more..]
                    </span>
                  </div>
                )}
              </div>
            )}

          </>
        )}

      </div>
    );
  };
  return (
    <>
      <Helmet>
        <title>{`${curSearchdecode} - 아큐피디아 통합검색`}</title>
        <meta name="description" content={`아큐피디아 통합검색 결과 - '${curSearchdecode}' 관련 위키, 학술자료, 경혈주치 및 침구처방 정보를 제공합니다.`} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`https://www.acupedia.net/searchResult?search=${encodeURIComponent(curSearchdecode)}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="아큐피디아" />
        <meta property="og:title" content={`${curSearchdecode} - 아큐피디아 통합검색`} />
        <meta property="og:description" content={`아큐피디아 통합검색 결과 - '${curSearchdecode}' 관련 위키, 학술자료, 경혈주치 및 침구처방 정보를 제공합니다.`} />
        <meta property="og:url" content={`https://www.acupedia.net/searchResult?search=${encodeURIComponent(curSearchdecode)}`} />
        <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
      </Helmet>
      <SearchTabs />
    </>
  );
}

export default SearchResult;
