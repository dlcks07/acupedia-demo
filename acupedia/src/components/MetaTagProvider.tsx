import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface LocationState {
  pathname: string;
}

function MetaTagProvider() {
  const location = useLocation();

  const setMetaTags = ({
    title = '기본 타이틀',
    description = '기본 설명',
    // imageUrl = '기본 사이트 이미지 경로'
  }) => {
    //set title
    document
      ?.querySelector('meta[property="og:title"]')
      ?.setAttribute('content', `${title}`);

    //set description
    document
      ?.querySelector('meta[property="og:description"]')!
      .setAttribute('content', description);

    //set images
    // document?.querySelector('meta[property="og:image"]')!.setAttribute('content', imageUrl);

    //set url
    document
      ?.querySelector('meta[property="og:url"]')
      ?.setAttribute('content', window.location.href);
  };

  const LocationObserver = (location: LocationState) => {
    if (location.pathname === '/') {
      setMetaTags({
        title: '아큐피디아',
        description:
          '아큐피디아는 경락 경혈 침구 검색사이트입니다. 사용자가 직접 참여하는 아큐피디아위키와 고전침구처방 검색기능을 제공합니다.',
      });
    } else if (location.pathname === '/login') {
      setMetaTags({
        title: '아큐피디아 로그인',
        description: '아큐피디아 로그인을 진행해주세요.',
      });
    } else if (location.pathname === '/createAccount') {
      setMetaTags({
        title: '아큐피디아 계정생성',
        description: '아큐피디아에 가입해 자유롭게 문서를 편집/열람해보세요.',
      });
    } else if (location.pathname.includes('/searchResult')) {
      setMetaTags({
        title: '아큐피디아 검색결과',
        description: '아큐피디아 검색내역입니다.',
      });
    } else if (location.pathname.includes('/wikiDetail')) {
      setMetaTags({
        title: '아큐피디아 위키',
        description: '아큐피디아 위키 상세내용입니다.',
      });
    } else if (location.pathname.includes('/wikiEdit')) {
      setMetaTags({
        title: '아큐피디아 위키수정',
        description: '아큐피디아 위키 수정 페이지입니다.',
      });
    } else if (location.pathname.includes('/libraryEdit')) {
      setMetaTags({
        title: '아큐피디아 학술 자료庫 편집',
        description: '아큐피디아 학술 자료庫 편집 페이지입니다.',
      });
    } else if (location.pathname.includes('/libraryEditWyisygs')) {
      setMetaTags({
        title: '아큐피디아 학술 자료庫 편집',
        description: '아큐피디아 학술 자료庫 편집 페이지입니다.',
      });
    } else if (location.pathname.includes('/libraryDetail')) {
      setMetaTags({
        title: '아큐피디아 학술 자료庫',
        description: '아큐피디아 학술 자료庫 상세내용입니다.',
      });
    } else if (location.pathname.includes('/libraryDetail')) {
      setMetaTags({
        title: '아큐피디아 학술 자료庫',
        description: '아큐피디아 학술 자료庫 상세내용입니다.',
      });
    }
  };

  useEffect(() => {
    LocationObserver(location);
  }, [location]);

  return null;
}

export default MetaTagProvider;
