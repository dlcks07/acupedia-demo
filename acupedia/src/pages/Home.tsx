import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsQuestionLg } from 'react-icons/bs';
import { FiArrowDown } from 'react-icons/fi';
import { isBrowser, isMobile } from 'react-device-detect';
import { SearchIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';
import { GiHamburgerMenu } from 'react-icons/gi';
import useComponentVisible from 'libs/useComponentVisible';
import { FAQContent, Menu, SignUpModal } from 'components';
import { useAppDispatch } from 'store';
import settingSlice from 'slices/setting';
import { userPopupAPi } from 'libs/api';
import { publicPath } from 'libs/utils';
import { toast } from 'react-toastify';
import { useQuery } from 'react-query';
import MenuLeft from 'components/MenuLeft';
import SearchPrescriptionLayer from 'components/SearchPrescriptionLayer';
import Popup2 from 'components/Popup2'; 
import '../styles/home.css';

function Home() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigation = useNavigate();
  const { register, handleSubmit } = useForm();
  const jwtToken = sessionStorage.getItem('jwtToken');
  const [faqOpen, setFaqOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const curLocation = location.pathname + location.search;

  const { data: popupList, isLoading: isLoading  } = useQuery(
    ['popupList', jwtToken],
    userPopupAPi.popupList
  );

  const onLogInClick = () => {
    dispatch(
      settingSlice.actions.setLastPageBeforeLogin({
        lastPageBeforeLogin: curLocation,
      })
    );
    navigation('/login');
  };
  const onSignUpClick = () => {
    //setIsModalOpen(true);
     navigation('/createAccount');
  };
  const onFaqClick = () => {
    setFaqOpen((prev) => !prev);
  };
  const onValid = (validForm: any) => {
    if (validForm.search.trim().length === 0) return;
    if (
      /[\{\}\[\]\/?.|\*~`!^\_+<>@\#$%&\\\=\'\"]/g.test(validForm.search.trim())
    ) {
      if (isMobile) {
        alert('특수문자를 포함할 수 없습니다.');
      } else {
        toast('특수문자를 포함할 수 없습니다.');
      }
      return;
    }
    console.log(validForm);
    navigation({
      pathname: 'searchResult',
      search: `?search=${encodeURIComponent(validForm.search)}`,
    });
  };

  const [isMenuRightVisible, setIsMenuRightVisible] = useState(false);
  const [isMenuLeftVisible, setIsMenuLeftVisible] = useState(false);

  const onMenuClick = () => {
    setIsMenuRightVisible((prev) => !prev);
  };
  
  const [isSearch, setIsSearch] = useState(false);

  // KCD용 상태 추가
const [isSearchKcd, setIsSearchKcd] = useState(false);


return (
  <>
    <div className={`homeWrap ${faqOpen ? 'faq-open' : ''}`}>
      <Helmet>
        <title>아큐피디아 - 경락 경혈 침구 검색사이트</title>
        <meta name="description" content="아큐피디아는 경락 경혈 침구 검색사이트입니다. 사용자가 직접 참여하는 아큐피디아위키와 고전침구처방 검색기능을 제공합니다." />
        <link rel="canonical" href="https://www.acupedia.net/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="아큐피디아" />
        <meta property="og:title" content="아큐피디아 - 경락 경혈 침구 검색사이트" />
        <meta property="og:description" content="아큐피디아는 경락 경혈 침구 검색사이트입니다. 사용자가 직접 참여하는 아큐피디아위키와 고전침구처방 검색기능을 제공합니다." />
        <meta property="og:url" content="https://www.acupedia.net/" />
        <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
      </Helmet>
      <nav className="header row">
        {isLoading ? null : <Popup2 data={popupList} />}

        {jwtToken ? (
          <>
            <div className="header__left">
              <div className="relative">
                <GiHamburgerMenu
                  onClick={() => setIsMenuLeftVisible(!isMenuLeftVisible)}
                  className="menuBtn"
                  id="menuLeft"
                />
                {isMenuLeftVisible && (
                  <MenuLeft
                    setIsMenuLeftVisible={setIsMenuLeftVisible}
                    setIsSearch={setIsSearch}
                    isSearch={isSearch}
                    setIsSearchKcd={setIsSearchKcd}
                    isSearchKcd={isSearchKcd}
                  />
                )}
              </div>
              <img src={publicPath('/images/new1.jpg')} alt="logo" className='logo'/>
            </div>

            <div className="searchLayer">
            {/* 고전침구처방 레이어 */}
            <SearchPrescriptionLayer
              isSearch={isSearch}
              setIsSearch={setIsSearch}
            />
            
            {/* KCD 레이어 */}
            <SearchPrescriptionLayer 
              isSearch={isSearchKcd} 
              setIsSearch={setIsSearchKcd}
              title="한의사를 위한 KCD지침서 검색"
              placeholder="KCD지침서 검색하기..."
              searchPath="/kcd"
              // searchParamKey="search"
            />
          </div>

            <div className="relative">
              <GiHamburgerMenu
                onClick={onMenuClick}
                className="menuBtn"
                id="menuRight"
              />
              {isMenuRightVisible && (
                <Menu setIsMenuRightVisible={setIsMenuRightVisible} />
              )}
            </div>
          </>
        ) : (
          <>
            <div className="header__left">
              <div className="relative">
                <GiHamburgerMenu
                  onClick={() => setIsMenuLeftVisible(!isMenuLeftVisible)}
                  className="menuBtn"
                  id="menuLeft"
                />
                {isMenuLeftVisible && (
                  <MenuLeft
                    setIsMenuLeftVisible={setIsMenuLeftVisible}
                    setIsSearch={setIsSearch}
                    isSearch={isSearch}
                    setIsSearchKcd={setIsSearchKcd}
                    isSearchKcd={isSearchKcd}
                  />
                )}
              </div>
              <img src={publicPath('/images/new1.jpg')} alt="logo" className='logo'/>
            </div>

            <div className="searchLayer">
            {/* 고전침구처방 레이어 */}
            <SearchPrescriptionLayer
              isSearch={isSearch}
              setIsSearch={setIsSearch}
            />
            
            {/* KCD 레이어 */}
            <SearchPrescriptionLayer 
              isSearch={isSearchKcd} 
              setIsSearch={setIsSearchKcd}
              title="한의사를 위한 KCD지침서 검색"
              placeholder="KCD지침서 검색하기..."
              searchPath="/kcd"
              //searchParamKey="search"
            />
          </div>

            <div className="header__right">
              <div
                className="btn blue01 small login"
                onClick={onLogInClick}
              >
                로그인
              </div>
              <div className="btn white small join"
              onClick={onSignUpClick}>
                회원가입
              </div>
            </div>
          </>
        )}
      </nav>

      <main className="main-content row">
        <img
          className="logo"
          src={publicPath('/images/Acupedia_logo.png')}
          alt="logo"
        />

        <form onSubmit={handleSubmit(onValid)}>
          <div className="searchBox">
            <input
              {...register('search')}
              placeholder="검색어를 입력해주세요."
              className="input"
            />
            <div
              onClick={handleSubmit(onValid)}
              className="searchBtn"
            >
              <SearchIcon className="h-6 text-white" />
            </div>
          </div>
        </form>
      </main>
    </div>

    <SignUpModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
  </>
);
}

export default Home;