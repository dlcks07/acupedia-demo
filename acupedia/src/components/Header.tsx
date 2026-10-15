import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BiSearchAlt2 } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import { GiHamburgerMenu } from 'react-icons/gi';
import { isBrowser, isMobile } from 'react-device-detect';
import Menu from './Menu';
import useComponentVisible from 'libs/useComponentVisible';
import settingSlice from 'slices/setting';
import { useAppDispatch } from 'store';
import SignUpModal from './SignUpModal';
import { toast } from 'react-toastify';

interface IHeader {
  buttonTitle?: string;
}

function Header({ buttonTitle }: IHeader) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigation = useNavigate();
  const jwtToken = sessionStorage.getItem('jwtToken');
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [isEmptyWord, setIsEmptyWord] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const searchObserver = watch();
  const curLocation = location.pathname + location.search;
  console.log(location);
  const curSearch = location.search.split('&')[0].split('=')[1]
    ? decodeURIComponent(location.search.split('&')[0].split('=')[1])
    : '';

  const onLogoClick = () => {
    navigation('/');
  };
  const onButtonClick = () => {
    if (buttonTitle === '회원가입') {
      //setIsModalOpen(true);

       navigation('/createAccount');
    } else {
      dispatch(
        settingSlice.actions.setLastPageBeforeLogin({
          lastPageBeforeLogin: curLocation,
        })
      );
      navigation('/login');
    }
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
    console.log(encodeURIComponent(validForm.search));
    // reset();
    navigation({
      pathname: 'searchResult',
      search: `?search=${encodeURIComponent(validForm.search)}`,
    });
  };

  const [isMenuRightVisible, setIsMenuRightVisible] = useState(false);

  const onMenuClick = () => {
    setIsMenuRightVisible((prev) => !prev);
  };

  // const onMenuClick = () => {
  //   setIsComponentVisible(true);
  // };

  useEffect(() => {
    if (searchObserver?.search?.length > 0) {
      setIsEmptyWord(false);
    } else {
      setIsEmptyWord(true);
    }
  }, [searchObserver]);

  useEffect(() => {
    if (/[\{\}\[\]\/?.|\*~`!^\_+<>@\#$%&\\\=\'\"]/g.test(curSearch.trim())) {
      if (isMobile) {
        alert('특수문자를 포함할 수 없습니다.');
      } else {
        toast('특수문자를 포함할 수 없습니다.');
      }
      navigation('/');
      return;
    }
    setValue('search', curSearch);
  }, []);

  return (
  <nav className="header__container">
    <div className="header__content row">
      <div className='header__content__left'>
        <div className="header__logo" onClick={onLogoClick}>
          ACUPEDIA
        </div>
        <div className="header__inputWrap">
          <form onSubmit={handleSubmit(onValid)}>
            <input
              {...register('search')}
              placeholder="검색어를 입력해주세요."
              className="header__inputWrap__input"
            />
          </form>

          {!isEmptyWord && (
            <IoClose
              onClick={() => reset()}
              className="header__inputWrap__close"
              color="white"
              fontWeight="bold"
            />
          )}

          <div
            onClick={handleSubmit(onValid)}
            className="header__inputWrap__searchBtn"
          >
            <BiSearchAlt2 className="mr-1 text-[18px]" color="#CFD9FE" />
            <span>검색</span>
          </div>
        </div>
      </div>

      {jwtToken || !buttonTitle ? (
        <div className="header__menuWrap">
          <GiHamburgerMenu
            onClick={onMenuClick}
            className="header__menuWrap__icon"
            color="white"
          />
          {isMenuRightVisible && (
            <Menu setIsMenuRightVisible={setIsMenuRightVisible} />
          )}
        </div>
      ) : (
        <div className="header__button btn small" onClick={onButtonClick}>
          {buttonTitle}
        </div>
      )}
    </div>

  <SignUpModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
</nav>

  );
}

export default Header;