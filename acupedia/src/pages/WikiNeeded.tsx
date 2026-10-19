import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'store';
import settingSlice from 'slices/setting';
import {
  loadWikiNeededCategories,
  pickRandomItems,
  WikiNeededItem,
} from 'libs/wikiNeeded';
import '../styles/wiki.css';

function WikiNeeded() {
  const navigation = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [shuffleKey, setShuffleKey] = useState(0);

  const columns = useMemo(
    () =>
      loadWikiNeededCategories().map((category) => ({
        ...category,
        items: pickRandomItems(category.items),
      })),
    [shuffleKey]
  );

  const onItemClick = (item: WikiNeededItem) => {
    const jwtToken = sessionStorage.getItem('jwtToken');
    const authority = sessionStorage.getItem('authority');

    if (!jwtToken) {
      dispatch(
        settingSlice.actions.setLastPageBeforeLogin({
          lastPageBeforeLogin: location.pathname + location.search,
        })
      );
      navigation('/login');
      return;
    }

    if (
      authority !== 'ADMIN' &&
      authority !== 'DOCTOR' &&
      authority !== 'STUDENT'
    ) {
      toast(
        '일반회원은 위키 작성 권한이 없습니다. 한의사/한의대생은 등업을 통해 편집권한을 얻으시기 바랍니다.'
      );
      return;
    }

    navigation(
      { pathname: '/wikiEdit', search: '?title=newWiki' },
      { state: item.title }
    );
  };

  return (
    <div className="subLeft__container">
      <Helmet>
        <title>작성이 필요한 문서 - 아큐피디아</title>
        <meta name="description" content="아큐피디아에서 작성이 필요한 위키 문서 목록을 확인할 수 있습니다."/>
        <link rel="canonical" href="https://www.acupedia.net/wikiNeeded"/>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="아큐피디아" />
        <meta property="og:title" content="작성이 필요한 문서 - 아큐피디아"/>
        <meta property="og:description" content="아큐피디아에서 작성이 필요한 위키 문서 목록을 확인할 수 있습니다."/>
        <meta property="og:url" content="https://www.acupedia.net/wikiNeeded"/>
        <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png"/>
      </Helmet>

      <div className="subLeft__titleBox w-full">
        <span className="subLeft__title">작성이 필요한 문서</span>
      </div>

      <div className="wikiNeeded">
        <div className="wikiNeeded__top">
          <p className="wikiNeeded__desc">
            아직 작성되지 않은 문서입니다. 문서명을 누르면 바로 새 위키
            작성을 시작할 수 있습니다.
          </p>
          <button
            type="button"
            className="wikiNeeded__shuffle"
            onClick={() => setShuffleKey((prev) => prev + 1)}
          >
            다른 문서 보기
          </button>
        </div>

        {columns.length === 0 ? (
          <p className="wikiNeeded__empty">등록된 문서가 없습니다.</p>
        ) : (
          <div className="wikiNeeded__grid">
            {columns.map((column) => (
              <section key={column.id} className="wikiNeeded__column">
                <h3 className="wikiNeeded__columnTitle">{column.name}</h3>
                {column.items.length === 0 ? (
                  <p className="wikiNeeded__columnEmpty">
                    등록된 문서가 없습니다.
                  </p>
                ) : (
                  <ul className="wikiNeeded__list">
                    {column.items.map((item) => (
                      <li key={item.id} className="wikiNeeded__item">
                        <button
                          type="button"
                          className="wikiNeeded__link"
                          onClick={() => onItemClick(item)}
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WikiNeeded;
