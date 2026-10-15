import React from 'react';
import { publicPath } from 'libs/utils';
import { isBrowser } from 'react-device-detect';
import styled from 'styled-components';

function Footer() {
  return (
    <div className='footer row'>
      <div className='footer__content'>
        <div className="footer__inner">
          <span className="footer__logo">
            ACUPEDIA
          </span>
          <div className="footer__columns">
            <div className="footer__about">
              <p className="footer__sectionTit">About Us</p>
              <div className="footer__sectionCont">
                <p>대전대학교 한의학과 경락경혈학교실 동문회</p>
                <p>국제한의학회 (ISTKM) : 대표 임윤경</p>
                <p>사업자번호 : 618-82-61992</p>
                <p>Copyright © acupedia All right Reserved</p>                
              </div>
            </div>
            <div className="footer__contact">
              <p className="footer__sectionTit">Contact Us</p>
              <div className="footer__sectionCont">
                <a href="mailto:admin@acupedia.net">admin@acupedia.net</a>
                <p className='footer_address'>                  
                경기도 용인시 기흥구
                동백죽전대로 527번길
                98-2, 302호
                </p>
              </div>
            </div>
            <div className="footer__policy">
              <p className="footer__sectionTit">Policy</p>
              <div className="footer__sectionLink">
                <a className="footer__link" href={publicPath('/terms')}>
                  이용약관
                </a>
                <a className="footer__link" href={publicPath('/privacy')}>
                  개인정보처리방침
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;



