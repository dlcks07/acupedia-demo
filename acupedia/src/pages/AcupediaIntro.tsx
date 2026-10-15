import React from 'react';
import { Link } from 'react-router-dom';
import { introductionApi } from 'libs/api';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';
import { Viewer } from '@toast-ui/react-editor';
import '../styles/acupedia.css';

function AcupediaIntro() {
  const { data, isLoading } = useQuery(
    ['introduction'],
    introductionApi.introduction
  );

  const html = data?.data?.introInfo?.content?.replace(/\\n/g, '\n') || '';
  return (
    <div className="subLeft__container">
      <Helmet>
        <title>아큐피디아(ACUPEDIA) 소개</title>
        <meta name="description" content="아큐피디아는 침구의학 관련 위키, 학술자료, 경혈주치 및 침구처방 정보를 제공하는 전문 지식 플랫폼입니다." />
        <link rel="canonical" href="https://www.acupedia.net/acupediaIntro" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="아큐피디아" />
        <meta property="og:title" content="아큐피디아(ACUPEDIA) 소개" />
        <meta property="og:description" content="아큐피디아는 침구의학 관련 위키, 학술자료, 경혈주치 및 침구처방 정보를 제공하는 전문 지식 플랫폼입니다." />
        <meta property="og:url" content="https://www.acupedia.net/acupediaIntro" />
        <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
      </Helmet>
      <div className="subLeft__titleBox w-full">
        <span className="subLeft__title">아큐피디아(ACUPEDIA) 소개</span>
      </div>  
      <div className="acuIntroWrap">
        {isLoading ? null : (
          <div>
            <div className="subLeft__viewer" data-color-mode="light">
              <Viewer
                initialValue={html}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AcupediaIntro;
