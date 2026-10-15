import { ChangeInfo, ChangePassword, Exit } from 'components';
import { cls } from 'libs/utils';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/mypage.css';

function Mypage() {
  const navigation = useNavigate();
  const [curIndex, setCurIndex] = useState(0);

  const onIndexClick = (number: number) => {
    setCurIndex(number);
  };
  const onBackClick = () => {
    navigation('/');
  };

  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem('jwtToken'));
  const [nickname, setNickname] = useState(sessionStorage.getItem('nickname'));
  const refreshJwtToken = () => {
    setJwtToken(sessionStorage.getItem('jwtToken'));
    setNickname(sessionStorage.getItem('nickname'));
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

  return (
    <div className="mypage__wrapper">
      <Helmet>
        <title>마이페이지 - 아큐피디아</title>
        <meta name="description" content="아큐피디아 마이페이지입니다." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.acupedia.net/mypage" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="아큐피디아" />
        <meta property="og:title" content="마이페이지 - 아큐피디아" />
        <meta property="og:description" content="아큐피디아 마이페이지입니다." />
        <meta property="og:url" content="https://www.acupedia.net/mypage" />
        <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
      </Helmet>
      
      <div className="mypage__menuWrap">
        <div className="mypage__menuTitle-box">
          <p className="mypage__menuTitle">
            마이페이지
          </p>
        </div>
        <div className="mypage__menu">
          <div
            onClick={() => onIndexClick(0)}
            className={cls(
              curIndex === 0 ? 'mypage__menu-item mypage__menu-item--active' : 'mypage__menu-item'
            )}
          >
            내 정보
          </div>
          <div
            onClick={() => onIndexClick(1)}
            className={cls(
              curIndex === 1
                ? 'mypage__menu-item mypage__menu-item--not-first mypage__menu-item--active'
                : 'mypage__menu-item mypage__menu-item--not-first'
            )}
          >
            비밀번호 변경
          </div>
          <div
            onClick={() => onIndexClick(2)}
            className={cls(
              curIndex === 2
                ? 'mypage__menu-item mypage__menu-item--not-first mypage__menu-item--active'
                : 'mypage__menu-item mypage__menu-item--not-first'
            )}
          >
            탈퇴하기
          </div>
        </div>
      </div>

      <div className="mypage__content">
        <p className="mypage__content-title">
          {curIndex === 0
            ? '내 정보'
            : curIndex === 1
            ? '비밀번호 변경'
            : '탈퇴하기'}
        </p>
        <div className="mypage__content-box">
          {curIndex === 0 ? (
            <ChangeInfo onBackClick={onBackClick} nickname={nickname} />
          ) : curIndex === 1 ? (
            <ChangePassword onBackClick={onBackClick} />
          ) : (
            <Exit onBackClick={onBackClick} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Mypage;
