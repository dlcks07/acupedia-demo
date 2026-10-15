import React from 'react';
import { introductionApi } from 'libs/api';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';
import { Viewer } from '@toast-ui/react-editor';
import '../styles/acupedia.css';

function WikiGuide() {
  const { data, isLoading } = useQuery(
    ['wikiGuide'],
    introductionApi.wikiGuide
  );

  const html = data?.data?.introInfo?.content?.replace(/\\n/g, '\n') || '';

  return (
    <div className="subLeft__container">
      <Helmet>
        <title>위키 작성 가이드 - 아큐피디아</title>
        <meta name="description" content="아큐피디아 위키 작성 방법과 이용 안내를 확인할 수 있습니다."/>
        <link rel="canonical" href="https://www.acupedia.net/wikiGuide"/>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="아큐피디아" />
        <meta property="og:title" content="위키 작성 가이드 - 아큐피디아"/>
        <meta property="og:description" content="아큐피디아 위키 작성 방법과 이용 안내를 확인할 수 있습니다."/>
        <meta property="og:url" content="https://www.acupedia.net/wikiGuide"/>
        <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png"/>
      </Helmet>

      <div className="subLeft__titleBox w-full">
        <span className="subLeft__title">위키 작성 가이드</span>
      </div>

      <div className="acuIntroWrap">
        {isLoading ? null : (
          <div>
            <div className="subLeft__viewer" data-color-mode="light">
              <Viewer initialValue={html} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WikiGuide;