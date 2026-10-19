import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Fab, Footer, Header, Page404, SideComponent } from 'components';
import {
  Acupoints,
  Admin,
  FindAccount,
  Home,
  Login,
  Mypage,
  Prescription,
  Privacy,
  ResetAccount,
  SearchResult,
  Library,
  Terms,
  Wiki,
  WikiCompare,
  WikiDetail,
  WikiEdit,
  WikiHistory,
  LibraryEdit,
  LibraryDetail,
  AcupediaIntro,
  WikiGuide,
  WikiNeeded,
  Kcd,
} from 'pages';
import CreateAccount from 'pages/CreateAccount';
import LibraryEditWyisygs from 'pages/LibraryEditWyisygs';
import { cls } from 'libs/utils';
import { isMobile } from 'react-device-detect';

function RootRouter() {
  const location = useLocation();
  const [headerButtonText, setHeaderButtonText] = useState('');

  useEffect(() => {
    if (location.pathname === '/login') {
      setHeaderButtonText('회원가입');
    } else if (location.pathname === '/createAccount') {
      setHeaderButtonText('로그인');
    } else {
      setHeaderButtonText('로그인');
    }
  }, [location]);

  const showSideComponent = ![
    '/login',
    '/createAccount',
    '/findAccount',
    '/resetAccount',
    '/mypage',
    '/terms',
    '/privacy',
    '/wikiEdit',
    '/wikiCompare',
    '/libraryEdit',
    '/libraryEditWyisygs',
    '/acupediaAdmin',
    '/acupediaIntro',
  ].includes(location.pathname);

  const showFab = [
    '/libraryDetail',
    '/searchResult',
    '/wiki',
    '/acupoints',
    '/prescription',  
    '/kcd',
  ].some(path => location.pathname.includes(path));

  return (
    <>
      <div className="wrapper">
        {location.pathname === '/' ? (
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        ) : (
          <div>
            <Header buttonTitle={headerButtonText} />
            {location.pathname.includes('/acupediaAdmin') ? (
              <Routes>
                <Route path="/acupediaAdmin/:id" element={<Admin />} />
                <Route path="/acupediaAdmin/library/search" element={<Admin />} />
              </Routes>
            ) : (
              <div className="containerWrap">
                <div className="containerBox row">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/findAccount" element={<FindAccount />} />
                    <Route path="/resetAccount" element={<ResetAccount />} />
                    <Route path="/createAccount" element={<CreateAccount />} />
                    <Route path="/searchResult" element={<SearchResult />} />
                    <Route path="/wikiDetail" element={<WikiDetail />} />
                    <Route path="/wiki" element={<Wiki />} />
                    <Route path="/acupoints" element={<Acupoints />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/prescription" element={<Prescription />} />
                    <Route path="/kcd" element={<Kcd />} />
                    <Route path="/wikiEdit" element={<WikiEdit />} />
                    <Route path="/wikiHistory" element={<WikiHistory />} />
                    <Route path="/WikiCompare" element={<WikiCompare />} />
                    <Route path="/libraryEdit" element={<LibraryEdit />} />
                    <Route path="/libraryEditWyisygs" element={<LibraryEditWyisygs />} />
                    <Route path="/libraryDetail" element={<LibraryDetail />} />
                    <Route path="/mypage" element={<Mypage />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/acupediaIntro" element={<AcupediaIntro />} />
                    <Route path="/wikiGuide" element={<WikiGuide />} />
                    <Route path="/wikiNeeded" element={<WikiNeeded />} />
                    <Route path="*" element={<Page404 />} />
                  </Routes>
                  {showSideComponent && <SideComponent />}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative">
        {showFab && <Fab />}
      </div>

      <Footer />
    </>
  );
}

export default RootRouter;
