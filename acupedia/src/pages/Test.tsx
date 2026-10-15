// import 'github-markdown-css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Comments, WikiRule } from 'components';
import GoogleAdvertise from 'components/GoogleAdvertise';
import { HORIZONTAL } from 'constants/GoogleAds';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { wikiApi } from 'libs/api';
import dayjs from 'dayjs';
// import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'store';
import settingSlice from 'slices/setting';
import styled from 'styled-components';


function Test() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigation = useNavigate();
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem('jwtToken'));
  const authority = sessionStorage.getItem('authority');
  const curLocation = location.pathname + location.search;
  const title = decodeURIComponent(
    location?.search?.split('?')[1].split('&')[0].split('=')[1]
  );
  const version = location?.search?.split('?')[1].split('&')[1]
    ? decodeURIComponent(
        location?.search?.split('?')[1].split('&')[1].split('=')[1]
      )
    : '';
  const {
    data,
    refetch: detailRefetch,
    isFetching: detailFetching,
  } = useQuery(['wikiDetail', title], wikiApi.wikiDocument);
  const {
    data: historyData,
    refetch: historyRefetch,
    isFetching: historyFetching,
  } = useQuery(['history', title, version, jwtToken], wikiApi.wikiHistory, {
    enabled: !!version,
  });
  const isLoading = detailFetching || historyFetching;

  const onEditClick = () => {
    if (jwtToken) {
      if (
        authority === 'ADMIN' ||
        authority === 'DOCTOR' ||
        authority === 'STUDENT'
      ) {
        navigation({
          pathname: '/wikiEdit',
          search: `?title=${title}`,
        });
      } else {
        toast(
          '일반회원은 위키 편집 권한이 없습니다. 한의사/한의대생은 등업을 통해 편집권한을 얻으시기 바랍니다.'
        );
      }
    } else {
      dispatch(
        settingSlice.actions.setLastPageBeforeLogin({
          lastPageBeforeLogin: curLocation,
        })
      );
      navigation('/login');
    }
  };

  const onHistoryClick = () => {
    navigation({
      pathname: '/wikiHistory',
      search: `?title=${title}&index=1`,
    });
  };
  const onNewWikiClick = () => {
    if (jwtToken) {
      if (
        authority === 'ADMIN' ||
        authority === 'DOCTOR' ||
        authority === 'STUDENT'
      ) {
        dispatch(
          settingSlice.actions.setLastPageBeforeLogin({
            lastPageBeforeLogin: curLocation,
          })
        );
        navigation(
          {
            pathname: '/wikiEdit',
            search: `?title=newWiki`,
          },
          {
            state: title,
          }
        );
      } else {
        toast(
          '일반회원은 위키 작성 권한이 없습니다. 한의사/한의대생은 등업을 통해 편집권한을 얻으시기 바랍니다.'
        );
      }
    } else {
      dispatch(
        settingSlice.actions.setLastPageBeforeLogin({
          lastPageBeforeLogin: curLocation,
        })
      );
      navigation(
        {
          pathname: '/login',
          search: '',
        },
        {
          state: null,
        }
      );
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

  return (
  <div className="subLeft__container">
    {isLoading ? null : (
      <>
        <div className="subLeft__header">
          <div className="subLeft__titleBox">
            <span className="subLeft__title">
              {title.replace(/ /g, '\u00a0')}
            </span>
          </div>
          {data?.status === 'BAD_REQUEST' ? null : (
            <div className="subLeft__tools">
              {version ? null : (
                <div className="subLeft__toolbar">
                  <span className="subLeft__btn current">읽기</span>
                  <span onClick={onEditClick} className="subLeft__btn">편집</span>
                  <span onClick={onHistoryClick} className="subLeft__btn">히스토리</span>
                </div>
              )}
              {isLoading ? null : (
                <div className="subLeft__editInfo">
                  <p className="subLeft__editRow">
                    <span className="subLeft__editLabel">최종 편집자</span>
                    <span className="subLeft__editorName">
                      {historyData?.data?.nickname ?? data.data.nickname}
                    </span>
                    <span className="subLeft__editRole">
                      {(() => {
                        const authority =
                          historyData?.data?.authority ?? data.data.authority;
                        switch (authority) {
                          case 'ADMIN':
                            return '관리자';
                          case 'DOCTOR':
                            return '한의사';
                          case 'STUDENT':
                            return '한의대생';
                          default:
                            return '일반회원';
                        }
                      })()}
                    </span>
                  </p>
                  <p className="subLeft__editRow">
                    <span className="subLeft__editLabel">최종 편집일시</span>
                    <span>
                      {dayjs(
                        historyData?.data?.createdAt ?? data.data.lastModifiedAt
                      ).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {data?.status === 'BAD_REQUEST' ? (
          <div>
            <span className="subLeft__no-entry">
              해당 항목으로 생성된 위키 항목이 없습니다.
            </span>
            <span onClick={onNewWikiClick} className="subLeft__create-link">
              [새 위키 작성하기]
            </span>
          </div>
        ) : null}

        {isLoading ? null : (
          <div>
            <div className="subLeft__viewer" data-color-mode="light">
              <Viewer
                initialValue={
                  historyData?.data?.content ?? data.data.content
                }
              />
            </div>
          </div>
        )}

        {data?.status === 'BAD_REQUEST' ? null : (
          <>
            {!version && <Comments title={title} />}
            <div className="subLeft__rules">
              <WikiRule />
            </div>
          </>
        )}
      </>
    )}
  </div>
);

}

export default Test;

const Div = styled.div`
  @media print {
    display: flex;
    width: 100%;
    height: 100%;
  }
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;

  overflow: hidden;
`;
