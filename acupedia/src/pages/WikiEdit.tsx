//import TUI from '../components/TUI';
import TinyMCEEditor from 'components/TinyMCEEditor';
import { useEffect, useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import { useLocation, useNavigate } from 'react-router-dom';
import { WikiRule } from 'components';
// import emailjs from '@emailjs/browser';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { md } from 'components/md';
import { useQuery } from 'react-query';
import { wikiApi } from 'libs/api';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-toastify';
import axiosInstance from 'components/AxiosInstance';
import { ClipLoader } from 'react-spinners';
import dayjs from 'dayjs';
import { useAppDispatch } from 'store';
import settingSlice from 'slices/setting';
import { Helmet } from 'react-helmet-async';


function WikiEdit() {
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const location = useLocation();
  const [newString, setNewString] = useState('');
  const title = decodeURI(
    location?.search?.split('?')[1].split('&')[0].split('=')[1]
  );
  const curSearch =
    location.search.split('?')[location.search.split('?').length - 1];
  const curLocation = location.pathname + location.search;
  const [curTitle, setCurTitle] = useState('');
  const authority = sessionStorage.getItem('authority');
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem('jwtToken'));
  const [isLoading, setIsLoading] = useState(false);
  const locationState = location.state as String;
  const { data, isLoading: wikiLoading } = useQuery(
    ['wikiDetail', title],
    wikiApi.wikiDocument,
    {
      enabled: title !== 'newWiki',
      onSuccess: (data) => setCurTitle(data?.data?.title),
    }
  );
  const content = data?.data?.content?.replace(/\\n/g, '\n') || '';
  // console.log(location.state);

  const onReadClick = () => {
    navigation({
      pathname: '/wikiDetail',
      search: `?title=${title}`,
    });
  };
  const onHistoryClick = () => {
    navigation({
      pathname: '/wikiHistory',
      search: `?title=${title}&index=1`,
    });
  };

  // const templateParams = {
  //   title: `${curTitle}`,
  // };

  const onSubmitClick = async () => {
    // 새 위키 작성
    if (curTitle === 'newWiki') {
      if (isMobile) {
        alert('해당 제목으로 만들 수 없습니다.');
        return;
      } else {
        toast('해당 제목으로 만들 수 없습니다.');
        return;
      }
    }
    if (
      curTitle.length === 0 ||
      (newString.length === 0 && content.length === 0)
    ) {
      if (isMobile) {
        alert('제목 또는 내용을 입력해주세요.');
        return;
      } else {
        toast('제목 또는 내용을 입력해주세요.');
        return;
      }
    }
    const time = new Date();
    setIsLoading(true);
    const response = await axiosInstance
      .post(
        `/history/submit`,
        {
          content: newString.length === 0 ? content : newString,
          createdAt: time.toISOString(),
          title: curTitle,
          previousTitle: curTitle !== title ? title : null,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
      .finally(() => setIsLoading(false));
    console.log(response);
    if (response.status === 200) {
      if (isMobile) {
        alert('저장되었습니다. ');
      } else {
        toast('저장되었습니다. ');
      }
      if (title === 'newWiki') {
        navigation('/');
      } else {
        navigation({
          pathname: '/wikiDetail',
          search: `?title=${curTitle}`,
        });
      }
    }
  };

  const onCancelClick = () => {
    navigation(-1);
  };

  const checkEnter = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const refreshJwtToken = () => {
    setJwtToken(sessionStorage.getItem('jwtToken'));
  };

  useEffect(() => {
    if (title === 'newWiki') {
      setCurTitle(String(locationState));
    }
    window.addEventListener('storage', refreshJwtToken);

    return () => {
      window.removeEventListener('storage', refreshJwtToken);
    };
  }, []);

  useEffect(() => {
    if (!jwtToken) {
      dispatch(
        settingSlice.actions.setLastPageBeforeLogin({
          lastPageBeforeLogin: curLocation,
        })
      );
      navigation('/login');
    }
  }, [jwtToken]);

  // useEffect(() => {
  //   if (data?.status === 'BAD_REQUEST') {
  //     navigation('/404');
  //   }
  // }, [data]);

  if (data?.status === 'BAD_REQUEST') {
    return null;
  }

  return wikiLoading ? null : (
    <div className="subLeft__container">
      <Helmet>
        <title>{`${title === 'newWiki' ? (location.state as string || '새 위키 작성') : title} - 아큐피디아 위키 편집`}</title>
        <meta name="description" content="아큐피디아 위키 문서 편집 페이지입니다." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`https://www.acupedia.net/wikiEdit?title=${encodeURIComponent(title)}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="아큐피디아" />
        <meta property="og:title" content={`${title === 'newWiki' ? (location.state as string || '새 위키 작성') : title} - 아큐피디아 위키 편집`} />
        <meta property="og:description" content="아큐피디아 위키 문서 편집 페이지입니다." />
        <meta property="og:url" content={`https://www.acupedia.net/wikiEdit?title=${encodeURIComponent(title)}`} />
        <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
      </Helmet>
      {curSearch !== 'admin' ? (
        <div className="subLeft_pageTit">편집하기</div>
      ) : null}
      <div className="subLeft__header">

          <div className="subLeft__titleBox">
            {title === 'newWiki' ? (
              // <textarea
              //   maxLength={40}
              //   className="w-full resize-none pr-16 tracking-tighter font-semibold"
              //   placeholder="제목을 입력하세요."
              //   onChange={(e) => setCurTitle(e.target.value)}
              //   value={curTitle}
              //   onKeyPress={checkEnter}
              //   autoFocus
              // />
              <span className="subLeft__title">{location.state as String}</span>
            ) : (
              <>
                {authority === 'ADMIN' ? (
                  <textarea
                    maxLength={40}
                    className="subLeft__title"
                    placeholder="제목을 입력하세요."
                    value={curTitle}
                    onChange={(e) => setCurTitle(e.target.value)}
                    onKeyPress={checkEnter}
                    autoFocus
                  />
                ) : (
                  <span className="subLeft__title">{title}</span>
                )}
              </>
            )}
          </div>

        <div className="subLeft__tools">
          {title !== 'newWiki' ? (
            <div className="subLeft__toolbar">
              <span onClick={onReadClick} className="subLeft__btn">읽기</span>
              <span className="subLeft__btn current">편집</span>
              <span onClick={onHistoryClick} className="subLeft__btn">히스토리</span>
            </div>
          ) : null}
          {title !== 'newWiki' ? (
            <div className="subLeft__editInfo">
              <p className="subLeft__editRow">
                <span className="subLeft__editLabel"> 최종 편집자</span>
                <span className="subLeft__editorName">{data?.data?.nickname}</span>
                <span className="subLeft__editRole">
                  {data?.data?.authority === 'ADMIN'
                    ? '어드민'
                    : data?.data?.authority === 'DOCTOR'
                    ? '한의사'
                    : data?.data?.authority === 'STUDENT'
                    ? '한의대생'
                    : '일반회원'}
                </span>
              </p>
              <p className="subLeft__editRow">
                <span className="subLeft__editLabel">최종 편집일시</span>
                <span>
                  {data?.data?.lastModifiedAt
                    ? dayjs(data?.data?.lastModifiedAt).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )
                    : ''}
                </span>
              </p>
            </div>
          ) : null}
        </div>
      </div>
      {title !== 'newWiki' ? (
        <>
          <div className="diffHeader">
            <span>최신판</span>
            <span>당신의 편집</span>
          </div>

          <div className="diffContainer">
            <ReactDiffViewer
              showDiffOnly={false}
              oldValue={content}
              newValue={newString}
              splitView={true}
            />
          </div>
        </>
      ) : null}

      <div className="wikiEdit__link" style={{ display: 'none' }}>
          <button
            onClick={() =>
              window.open(
                'https://gist.github.com/ihoneymon/652be052a0727ad59601'
              )
            }
            className="wikiEdit__link-btn"
          >
            아큐피디아 편집기 사용설명서
          </button>        
      </div>

      <div className="wickEditor-wrap">
        {/* { <TUI oldString={content} setNewString={setNewString} />} */}
        {<TinyMCEEditor oldString={content} setNewString={setNewString} />}
      </div>        
      
      <div className="wikiEdit__btm-btns">
        <span onClick={onSubmitClick} className="btn blue02">
          {isLoading ? <ClipLoader size={20} /> : '완료'}
        </span>
        <span onClick={onCancelClick} className="btn grey">취소</span>
      </div>

      <div className="subLeft__rules">
        <WikiRule />
      </div>

    </div>
  );
}

export default WikiEdit;
