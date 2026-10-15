import axiosInstance from 'components/AxiosInstance';
import React, { useState } from 'react';
import { isBrowser, isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import '../styles/login.css';

function FindAccount() {
  const [isSend, setIsSend] = useState(false);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onResetClick = async () => {
    if (text.length === 0 || !text.includes('@')) {
      if (isMobile) {
        alert('이메일을 입력해주세요.');
        return;
      } else {
        toast('이메일을 입력해주세요.');
        return;
      }
    }
    setIsLoading(true);
    const response = await axiosInstance
      .post(`/user/password/link?email=${text}`)
      .finally(() => setIsLoading(false));
    if (response.status === 200) {
      setIsSend(true);
    }
  };

  return (
  <div className="fdAccount__container">
    <Helmet>
      <title>계정 찾기 - 아큐피디아</title>
      <meta name="description" content="아큐피디아 계정 찾기 페이지입니다." />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href="https://www.acupedia.net/findAccount" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="아큐피디아" />
      <meta property="og:title" content="계정 찾기 - 아큐피디아" />
      <meta property="og:description" content="아큐피디아 계정 찾기 페이지입니다." />
      <meta property="og:url" content="https://www.acupedia.net/findAccount" />
      <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
    </Helmet>
    <div className="fdAccount__contentWrap">
      <span className="fdAccount__title pageTitle">계정 찾기</span>

      {!isSend ? (
        <div className="fdAccount__inputWrap">
          <div className="fdAccount__emailInputWrap">
            <span>E-mail</span>
            <input
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="이메일을 입력해주세요."
              className="fdAccount__emailInputWrap__input"
            />
          </div>
          <div className="fdAccount__resetButton" onClick={onResetClick}>
            {isLoading ? <ClipLoader size={20} color="white" /> : '계정 초기화하기'}
          </div>
        </div>
      ) : (
        <div className="fdAccount__sendTextWrap">
          <p>E-mail로 초기화 링크를 전송하였습니다.</p>
          <p>메일함을 확인해주세요.</p>
        </div>
      )}

      <div className="fdAccount__infoWrap">
        <Link to="/login" className="fdAccount__infoLink">
          로그인 하기로 돌아가기
        </Link>
        <span>/</span>
        <Link to="/createAccount" className="fdAccount__infoLink">
          회원가입
        </Link>
      </div>
    </div>
  </div>
);
}

export default FindAccount;