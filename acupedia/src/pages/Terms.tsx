import React from 'react';
import styled from 'styled-components';
import terms from 'components/terms';
import { Helmet } from 'react-helmet-async';
import '../styles/terms.css';

function Terms() {
  return (
    <div className="termsWrap">
      <Helmet>
        <title>이용약관 - 아큐피디아</title>
        <meta name="description" content="아큐피디아 서비스 이용약관입니다." />
        <link rel="canonical" href="https://www.acupedia.net/terms" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="아큐피디아" />
        <meta property="og:title" content="이용약관 - 아큐피디아" />
        <meta property="og:description" content="아큐피디아 서비스 이용약관입니다." />
        <meta property="og:url" content="https://www.acupedia.net/terms" />
        <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
      </Helmet>
      <div className="subLeft__titleBox w-full">
        <span className="subLeft__title">이용약관</span>
      </div>
      <div className="termsWrap__Box" dangerouslySetInnerHTML={{ __html: terms }} />
    </div>
  );
}

export default Terms;

