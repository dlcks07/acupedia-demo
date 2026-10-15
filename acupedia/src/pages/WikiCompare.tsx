import { useState, useEffect } from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import { useLocation, useNavigate } from 'react-router-dom';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useQuery } from 'react-query';
import { wikiApi } from 'libs/api';
import dayjs from 'dayjs';
import { Viewer } from '@toast-ui/react-editor';
import { Helmet } from 'react-helmet-async';


function WikiCompare() {
  const navigation = useNavigate();
  const location = useLocation();
  const title = decodeURI(location?.search?.split('?')[1].split('&')[0].split('=')[1]);
  const version = decodeURI(location?.search?.split('?')[1].split('&')[1].split('=')[1]);
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem('jwtToken'));
  const { data: historyData, isLoading: historyLoading } = useQuery(
    ['history', title, version, jwtToken],
    wikiApi.wikiHistory
  );
  const { data: recentAcceptedData, isLoading: AcceptedLoading } = useQuery(
    ['recentAccepted', title, version, jwtToken],
    wikiApi.wikiHistoryRecentAccepted
  );
  const isLoading = historyLoading || AcceptedLoading;
  console.log(historyData);

  const onBeforeClick = () => {
    navigation(-1);
  };

   // 반응형 splitView 처리
  const [isSplitView, setIsSplitView] = useState(window.innerWidth > 768);
  useEffect(() => {
    const resizeHandler = () => {
      setIsSplitView(window.innerWidth > 768);
    };
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  // 스타일 오버라이드
  const customStyles: any = {
    line: {
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      fontSize: '14px',
    },
    gutter: {
      minWidth: '40px',
      textAlign: 'right',
    },
  };

  return isLoading ? null : (
  <div className="subLeft__container">
    <Helmet>
      <title>{`${title} - 아큐피디아 위키 버전 비교`}</title>
      <meta name="description" content={`아큐피디아 위키 - ${title} 항목의 버전 비교 페이지입니다.`} />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={`https://www.acupedia.net/WikiCompare?title=${encodeURIComponent(title)}&version=${encodeURIComponent(version)}`} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="아큐피디아" />
      <meta property="og:title" content={`${title} - 아큐피디아 위키 버전 비교`} />
      <meta property="og:description" content={`아큐피디아 위키 - ${title} 항목의 버전 비교 페이지입니다.`} />
      <meta property="og:url" content={`https://www.acupedia.net/WikiCompare?title=${encodeURIComponent(title)}&version=${encodeURIComponent(version)}`} />
      <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
    </Helmet>
    <div className="subLeft__header">
      <div className="subLeft__titleBox">
        <span className="subLeft__title">{title}</span>
      </div>

      <div className="subLeft__editInfo wikiCompare">
          <p className="subLeft__editRow">
            <span className="subLeft__editLabel">최종 편집자</span>
            <span className="subLeft__editorName">{historyData.data.nickname}</span>
            <span className="subLeft__editRole">
              {historyData.data.authority === 'ADMIN'
                ? '관리자'
                : historyData.data.authority === 'DOCTOR'
                ? '한의사'
                : historyData.data.authority === 'STUDENT'
                ? '한의대생'
                : '일반회원'}
            </span>
          </p>
          <p className="subLeft__editRow">
            <span className="subLeft__editLabel">최종 편집일시</span>
            <span>{dayjs(historyData.data.createdAt).format('YYYY-MM-DD')}</span>
          </p>
        </div>
    </div>

    <div className="diffHeader">
      <span>이전 버전</span>
      <span>당신의 편집</span>
    </div>

    <div className="diffContainer">
      <ReactDiffViewer
        showDiffOnly={false}
        oldValue={recentAcceptedData.data.content || ''}
        newValue={historyData.data.content}
        splitView={true}
      />
    </div>

    <div className="subLeft__viewerBox" data-color-mode="light">
      <Viewer initialValue={historyData.data.content} />
    </div>

    <div className="subLeft__bottomBtnWrap">
      <span onClick={onBeforeClick} className="btn blue02 big">
        이전으로
      </span>
    </div>
  </div>
);
}

export default WikiCompare;
