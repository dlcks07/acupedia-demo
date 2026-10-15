// import 'github-markdown-css';
import { useLocation, useNavigate } from 'react-router-dom';
import { LibraryRule } from 'components';
import { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import { libraryApi } from 'libs/api';
import dayjs from 'dayjs';
// import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';
import { useAppDispatch } from 'store';
import settingSlice from 'slices/setting';
import styled from 'styled-components';
import LibraryComments from 'components/LibraryComments';
import { buildMetaDescription } from 'libs/metaDescription';

function LibraryDetail() {
  const hideRuleCategories = [96, 55, 94];  
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigation = useNavigate();
  const authority = sessionStorage.getItem('authority');
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem('jwtToken'));
  const curLocation = location.pathname + location.search;
  const title = decodeURIComponent(
    location?.search?.split('?')[1].split('&')[0].split('=')[1]
  );

  const {
    data: data,
    refetch: detailRefetch,
    isFetching: isLoading,
  } = useQuery(['libraryDetail', title], libraryApi.libraryDocument);
  console.log(data);

  const onEditClick = () => {
    if (jwtToken) {
      navigation({
        pathname: '/libraryEdit',
        search: `?title=${title}`,
      });
    } else {
      dispatch(
        settingSlice.actions.setLastPageBeforeLogin({
          lastPageBeforeLogin: curLocation,
        })
      );
      navigation('/login');
    }
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

  // 본문 기반 meta description 생성
  const rawContent = data?.data?.content;
  const metaDescription = useMemo(
    () =>
      buildMetaDescription(
        rawContent,
        `아큐피디아 학술 자료庫 - ${title} 항목의 상세 내용입니다.`
      ),
    [rawContent, title]
  );

  return (
    <div className="subLeft__container">
      <Helmet>
        <title>{`${title} - 아큐피디아 학술 자료庫`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={`https://www.acupedia.net/libraryDetail?title=${encodeURIComponent(title)}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="아큐피디아" />
        <meta property="og:title" content={`${title} - 아큐피디아 학술 자료庫`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={`https://www.acupedia.net/libraryDetail?title=${encodeURIComponent(title)}`} />
        <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
      </Helmet>
      {isLoading ? null : (
        <>
          {/* <div className="w-full mb-[10px]">
            <p className="text-[20px] font-semibold tracking-tighter text-[#0A2996] ">
              · 학술 자료庫
            </p>
          </div> */}
          <div className="subLeft__header">
            <div className="subLeft__titleBox">
              <span className="subLeft__title">
                {title.replace(/ /g, '\u00a0')}
              </span>
            </div>            

            {data?.status === 'BAD_REQUEST' ? (
              <div className="w-[424px] h-[130px]"></div>
            ) : (
              <>
                {authority === 'ADMIN' ? (
                  
                  <div className="subLeft__tools">
                    <div className="subLeft__toolbar">
                      <span className="subLeft__btn current">읽기</span>
                      <span onClick={onEditClick} className="subLeft__btn">편집</span>
                    </div>
                    {isLoading ? null : (
                      <div className="subLeft__editInfo">
                        <p className="subLeft__editRow">
                          <span className="subLeft__editLabel">최종 편집자</span>
                          <span className="subLeft__editorName">{data.data.nickname}</span>
                          <span className="subLeft__editRole">
                            {data.data.authority === 'ADMIN'
                              ? '관리자'
                              : data.data.authority === 'DOCTOR'
                              ? '한의사'
                              : data.data.authority === 'STUDENT'
                              ? '한의대생'
                              : '일반회원'}
                          </span>
                        </p>
                        <p className="subLeft__editRow">
                          <span className="subLeft__editLabel">최종 편집일시</span>
                          <span className="">
                            {dayjs(data.data.lastModifiedAt).format(
                              'YYYY-MM-DD HH:mm:ss'
                            )}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                ) : null}
              </>
            )}
          </div>

          {data?.status === 'BAD_REQUEST' ? (
            <div className="">
              <span className="subLeft__no-entry">
                해당 항목으로 생성된 학술 자료庫 항목이 없습니다.
              </span>
            </div>
          ) : null}
          {isLoading ? null : (
            <Div>
              <div className="subLeft__viewer" data-color-mode="light">
                <Viewer initialValue={data.data.content} />
              </div>
            </Div>
          )}
          <>
            {hideRuleCategories.includes(Number(data?.data?.category)) ||
            hideRuleCategories.includes(Number(data?.data?.parentId)) ? (
              <div style={{ height: '30px' }}></div>
            ) : (
              <div className="subLeft__rules">
                <LibraryRule />
              </div>
            )}
            <LibraryComments title={title} />
          </>          
        </>
        
      )}
    </div>
    
  );
}

export default LibraryDetail;

const Div = styled.div`
  overflow: auto;
`;
