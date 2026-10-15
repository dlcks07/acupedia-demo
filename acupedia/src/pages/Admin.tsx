import { AdminAccount, AdminIntro, AdminPost, LibraryCategory, AdminPopup, PaginationBox } from 'components';
import AdminLibrary from 'components/AdminLibrary';
import AdminPopupEdit from 'components/AdminPopupEdit';
import { adminAPi, categoryAPi } from 'libs/api';
import { cls } from 'libs/utils';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/admin.css';

const LIMIT = 20;

function Admin() {
  const location = useLocation();
  const navigation = useNavigate();
  const [userInput, setUserInput] = useState('');
  const curIndex = +location?.search?.split('?')[1].split('=')[1];
  const curTab =
    location.pathname.split('/')[location.pathname.split('/').length - 1];
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem('jwtToken'));
  const { data: userData, isLoading: userLoading } = useQuery(
    ['user', curIndex - 1, jwtToken],
    adminAPi.adminUser,
    { enabled: curTab === 'account' }
  );
  const { data: introData, isLoading: introLoading } = useQuery(
    ['intro', jwtToken],
    adminAPi.adminIntro,
    { enabled: curTab === 'intro' }
  );
  const { data: wikiGuideData, isLoading: wikiGuideLoading } = useQuery(
    ['adminWikiGuide', jwtToken],
    adminAPi.adminWikiGuide,
    { enabled: curTab === 'wikiGuide' }
  );
  const { data: postData, isLoading: postLoading } = useQuery(
    ['post', curIndex - 1, jwtToken],
    adminAPi.adminPost,
    { enabled: curTab === 'post' }
  );
  const { data: contentData, isLoading: contentLoading } = useQuery(
    ['content', curIndex - 1, jwtToken],
    adminAPi.adminLib,
    { enabled: curTab === 'library' }
  );

  const { data: categoryData, isLoading: categoryLoading } = useQuery(
    'category',
    categoryAPi.categoryList
  );
  
  const { data: popupData, isLoading: popupLoading } = useQuery(
    ['popup', curIndex - 1, jwtToken],
    adminAPi.adminPopup,
    { enabled: curTab === 'popup' }
  );
    const [curPass, setCurPass] = useState(
      Math.floor(
        (+location?.search?.split('?')[1].split('=')[1] - 1) / LIMIT
      )
    );
  const [MAX_NUM, setMAX_NUM] = useState(0);
  const offset = +location?.search?.split('?')[1].split('=')[1];
  const isLoading =
    userLoading || introLoading || wikiGuideLoading || postLoading || contentLoading || categoryLoading || popupLoading;

  const onTabClick = (path: string) => {
    navigation({
      pathname: `/acupediaAdmin/${path}`,
      search: '?index=1',
    });
  };
  const onNumClick = (index: number) => {
  
    if (index > MAX_NUM) return;
  
    navigation({
      search: `?index=${index}`,
    });
  };
  const onLeftClick = () => {
    if (+location?.search?.split('?')[1].split('=')[1] === 1) {
      return;
    }
    navigation({
      search: `?index=${+location?.search?.split('?')[1].split('=')[1] - 1}`,
    });
  };
  const onRightClick = () => {
    if (+location?.search?.split('?')[1].split('=')[1] === MAX_NUM) {
      return;
    }
    navigation({
      search: `?index=${+location?.search?.split('?')[1].split('=')[1] + 1}`,
    });
  };

  useEffect(() => {
    setCurPass(Math.floor((+offset - 1) / LIMIT));
  }, [location]);

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
    if (!jwtToken) {
      navigation('/');
    }
  }, [jwtToken]);

  useEffect(() => {
    if (curTab === 'post') {
      setMAX_NUM(
        Math.floor(
          postData?.data.totalCount % 20 === 0
            ? postData?.data.totalCount / 20
            : postData?.data.totalCount / 20 + 1
        )
      );
    } else if (curTab === 'account') {
      setMAX_NUM(
        Math.floor(
          userData?.data.totalCount % 20 === 0
            ? userData?.data.totalCount / 20
            : userData?.data.totalCount / 20 + 1
        )
      );
    } else if (curTab === 'library') {
      setMAX_NUM(
        Math.floor(
          contentData?.data.totalCount % 20 === 0
            ? contentData?.data.totalCount / 20
            : contentData?.data.totalCount / 20 + 1
        )
      );
    } else if (curTab === 'popup') {
      setMAX_NUM(
        Math.floor(
          popupData?.data.totalCount % 20 === 0
            ? popupData?.data.totalCount / 20
            : popupData?.data.totalCount / 20 + 1
        )
      );
    }
  }, [curTab, isLoading]);

  return isLoading ? null : (
    <div className="admin__wrap">
      <Helmet>
        <title>관리자 설정 - 아큐피디아</title>
        <meta name="description" content="아큐피디아 관리자 설정 페이지입니다." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* 왼쪽 탭 */}
      <div className="admin__left-tab">
        <div className="admin__title">
          관리자 설정
        </div>
        <div
          className={cls(
            curTab === 'account'
              ? 'bg-[#0A2996] text-white'
              : 'text-[#0A2996] text-opacity-50',
            'tab-btn'
          )}
          onClick={() => onTabClick('account')}
        >
          계정 관리
        </div>
        <div
          onClick={() => onTabClick('wikiGuide')}
          className={cls(
            curTab === 'wikiGuide'
              ? 'bg-[#0A2996] text-white'
              : 'text-[#0A2996] text-opacity-50',
            'tab-btn'
          )}
        >
          위키 작성 가이드 관리
        </div>
        <div
          onClick={() => onTabClick('post')}
          className={cls(
            curTab === 'post'
              ? 'bg-[#0A2996] text-white'
              : 'text-[#0A2996] text-opacity-50',
            'tab-btn'
          )}
        >
          위키글 관리
        </div>
        <div
          className={cls(
            curTab === 'library'
              ? 'bg-[#0A2996] text-white'
              : 'text-[#0A2996] text-opacity-50',
            'tab-btn'
          )}
          onClick={() => onTabClick('library')}
        >
          학술 자료庫 관리
        </div>
        <div
          onClick={() => onTabClick('intro')}
          className={cls(
            curTab === 'intro'
              ? 'bg-[#0A2996] text-white'
              : 'text-[#0A2996] text-opacity-50',
            'tab-btn'
          )}
        >
          소개글 관리
        </div>
        <div
          className={cls(
            curTab === 'popup'
              ? 'bg-[#0A2996] text-white'
              : 'text-[#0A2996] text-opacity-50',
            'tab-btn'
          )}
          onClick={() => onTabClick('popup')}
        >
          팝업창 관리
        </div>
      </div>

      <div className="admin__main-wrap">
        {/* 메인 */}
        <div className="admin__main">
          {curTab === 'account' ? (
            <AdminAccount data={userData} />
          ) : curTab === 'wikiGuide' ? (
            <AdminIntro
              key="wikiGuide"
              data={wikiGuideData}
              title="위키(Wiki) 작성하기"
              heading="위키 작성 가이드"
            />
          ) : curTab === 'intro' ? (
            <AdminIntro
              key="intro"
              data={introData}
              title="아큐피디아(ACUPEDIA) 소개"
              heading="아큐피디아(ACUPEDIA) 소개글 관리"
            />
          ) : curTab === 'post' ? (
            <AdminPost data={postData} />
          ) : curTab === 'library' ? (
            <AdminLibrary data={contentData} />
          ) : curTab === 'popup' ? (
            <AdminPopup data={popupData} />
          ) : curTab === 'popupEdit' ? (
            <AdminPopupEdit />
          ) : (
            <LibraryCategory data={categoryData} />
          )}
        </div>
        {/* 페이지 넘김 */}
        {curTab === 'popupEdit' ? null : (
          !isNaN(MAX_NUM) && !isNaN(curPass) && !isNaN(offset) ? (
            <div className="admin__pagination-wrap">
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
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default Admin;
