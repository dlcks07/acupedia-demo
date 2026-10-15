import React from 'react';
import styled from 'styled-components';
import privacy from 'components/privacy';
import { Helmet } from 'react-helmet-async';
import '../styles/terms.css';

function Privacy() {
  return (
    <div className="termsWrap">
      <Helmet>
        <title>개인정보처리방침 - 아큐피디아</title>
        <meta name="description" content="아큐피디아 개인정보처리방침입니다." />
        <link rel="canonical" href="https://www.acupedia.net/privacy" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="아큐피디아" />
        <meta property="og:title" content="개인정보처리방침 - 아큐피디아" />
        <meta property="og:description" content="아큐피디아 개인정보처리방침입니다." />
        <meta property="og:url" content="https://www.acupedia.net/privacy" />
        <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
      </Helmet>
      <div className="subLeft__titleBox w-full">
        <span className="subLeft__title">개인정보처리방침</span>
      </div>  
      <div className="termsWrap__Box" style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: privacy }} />
    </div>
  );
}

export default Privacy;

