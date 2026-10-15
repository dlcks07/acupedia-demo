import { persistor } from 'index';
//import React, { forwardRef } from 'react';
import React, { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';


function MenuLeft({ props, forwardedRef, setIsMenuLeftVisible, setIsSearch, isSearch, setIsSearchKcd, isSearchKcd }: any) {
  const navigation = useNavigate();

  const onMenu01Click = () => {
    setIsMenuLeftVisible(false);
    //navigation('/wikiDetail?title=아큐피디아(ACUPEDIA)');
    navigation('/acupediaIntro');
  };
  
  const onMenu02Click = () => {
    setIsMenuLeftVisible(false);
    navigation('/libraryDetail?title=학술자료庫%20목록');
  };

  const onMenu04Click = () => {
    setIsMenuLeftVisible(false);
    navigation('/wikiGuide');
  };

  const onMenu03Click = () => {
    setIsMenuLeftVisible(false);
    setIsSearch(!isSearch);
  };  

  const onMenu05Click = () => {
    setIsMenuLeftVisible(false);
    setIsSearchKcd(!isSearchKcd);
  };
 
  return (
    <div
      {...props}
      ref={forwardedRef}
      className="menu-dropdown__container left-0">
      <p className="menu-dropdown__title">
        메뉴
      </p>
            
      <div
        onClick={onMenu01Click}
        className="menu-dropdown__item">
        <p className="menu-dropdown__item-text">아큐피디아 소개</p>
      </div>
      <div
        onClick={onMenu04Click}
        className="menu-dropdown__item">
        <p className="menu-dropdown__item-text">위키</p>
      </div>
      <div
        onClick={onMenu02Click}
        className="menu-dropdown__item">
        <p className="menu-dropdown__item-text">학술자료庫</p>
      </div>
      <div 
        onClick={onMenu03Click} 
        className="menu-dropdown__item">
        <p className="menu-dropdown__item-text">고전침구처방 검색</p>
      </div> 
      <div 
        onClick={onMenu05Click} 
        className="menu-dropdown__item">
        <p className="menu-dropdown__item-text">KCD지침서 검색</p>
      </div> 

    </div>
  );
}

export default forwardRef(MenuLeft);



