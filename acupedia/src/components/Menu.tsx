import { persistor } from 'index';
import React, { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Menu({ props, forwardedRef, setIsMenuRightVisible }: any) {
  const navigation = useNavigate();

  const nickname = sessionStorage.getItem('nickname');
  const email = sessionStorage.getItem('email');
  const authority = sessionStorage.getItem('authority');

  const purge = async () => {
    await persistor.purge();
  };

  const onLogoutClick = async () => {
    // sessionStorage.removeItem('jwtToken');
    // sessionStorage.removeItem('nickname');
    // sessionStorage.removeItem('email');
    // sessionStorage.removeItem('authority');
    sessionStorage.clear();
    window.dispatchEvent(new Event('storage'));
    setIsMenuRightVisible(false);
    // await setTimeout(() => purge(), 200);
  };
  const onMypageClick = () => {
    setIsMenuRightVisible(false);
    navigation('/mypage');
  };
  const onAdminClick = () => {
    setIsMenuRightVisible(false);
    navigation({
      pathname: '/acupediaAdmin/account',
      search: '?index=1'
    });
  };
  return (
    <div
      {...props}
      ref={forwardedRef}
      className="menu-dropdown__container right-0"
    >
      <p className="menu-dropdown__title">
        메뉴
      </p>
      <div className="menu-dropdown__user">
        <p className="menu-dropdown__user-nickname">{nickname}</p>
        <p className="menu-dropdown__user-member">
          {authority === 'ADMIN'
            ? '관리자'
            : authority === 'DOCTOR'
            ? '한의사'
            : authority === 'STUDENT'
            ? '한의대생'
            : '일반회원'}
        </p>
        <p className="menu-dropdown__user-email">{email}</p>
      </div>
      <div
        onClick={onMypageClick}
        className="menu-dropdown__item"
      >
        <p className="menu-dropdown__item-text">마이페이지</p>
      </div>
      {authority === 'ADMIN' ? (
        <div
          onClick={onAdminClick}
          className="menu-dropdown__item"
        >
          <p className="menu-dropdown__item-text">어드민페이지</p>
        </div>
      ) : null}
      <div
        onClick={onLogoutClick}
        className="menu-dropdown__item"
      >
        <p className="menu-dropdown__item-text">로그아웃</p>
      </div>
    </div>
  );
}

export default forwardRef(Menu);
