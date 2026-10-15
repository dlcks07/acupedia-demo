import { Header } from 'components';
import axiosInstance from 'components/AxiosInstance';
import React, { useState } from 'react';
import { isBrowser, isMobile } from 'react-device-detect';
import { useLocation, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import '../styles/login.css';

function ResetAccount() {
  const navigation = useNavigate();
  const location = useLocation();
  const curSearch = decodeURI(location.search.split('=')[1]);
  const [isLoading, setIsLoading] = useState(false);

  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  const onConfirmClick = async () => {
    if (password.length === 0 || rePassword.length === 0 || password !== rePassword) {
      if (isMobile) {
        alert('비밀번호를 다시 확인해주세요.');
      } else {
        toast('비밀번호를 다시 확인해주세요.');
      }
      return;
    }
    setIsLoading(true);
    const response = await axiosInstance
      .post(`/user/password/reset?&token=${curSearch}&changePassword=${password}`)
      .finally(() => setIsLoading(false));
    console.log(response);

    if (response.status === 200) {
      if (isMobile) {
        alert('비밀번호를 변경하였습니다.');
      } else {
        toast('비밀번호를 변경하였습니다.');
      }
      navigation('/');
    }
  };

  return (
    <div className="fdAccount__container">
      <Helmet>
        <title>계정 재설정 - 아큐피디아</title>
        <meta name="description" content="아큐피디아 계정 재설정 페이지입니다." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.acupedia.net/resetAccount" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="아큐피디아" />
        <meta property="og:title" content="계정 재설정 - 아큐피디아" />
        <meta property="og:description" content="아큐피디아 계정 재설정 페이지입니다." />
        <meta property="og:url" content="https://www.acupedia.net/resetAccount" />
        <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
      </Helmet>
      <div className="fdAccount__contentWrap">
        <span className="fdAccount__title pageTitle">계정 재설정</span>
        
        <div className="fdAccount__inputWrap">
          <div className="fdAccount__pwInputWrap">
            <span>비밀번호</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your Password"
              className="fdAccount__pwInputWrap__input"
            ></input>
          </div>
          <div className="fdAccount__pwInputWrap mt-2">
            <span>비밀번호 확인</span>
            <input
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              type="password"
              placeholder="Enter your Password"
              className="fdAccount__pwInputWrap__input"
            ></input>
          </div>          
        </div>

        <div className="fdAccount__resetButton" onClick={onConfirmClick}>
            {isLoading ? <ClipLoader size={20} color="white" /> : '확 인'}
          </div>

      </div>
    </div>
  );
}

export default ResetAccount;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${isBrowser ? '' : '1440px'};
  margin-left: auto;
  margin-right: auto;
`;
const ContentWrap = styled.div`
  width: 575px;
`;
const Title = styled.span`
  font-size: 54px;
  font-weight: 600;
  color: ${(props) => props.theme.fontColor};
`;
const InputWrap = styled.div`
  height: 111px;
  margin-top: 27px;
`;
const PasswordInputWrap = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  margin-left: 5px;
  margin-bottom: 22px;
  span {
    font-size: 18px;
    font-weight: 500;
    color: #acb3b9;
    letter-spacing: 1.04px;
  }
  input {
    margin-left: auto;
    width: 396px;
    height: 48px;
    border-radius: 6px;
    border: 1px solid #cfd9fe;
    text-indent: 16px;

    ::placeholder {
      color: #acb3b9;
      font-size: 14px;
      font-weight: 300;
    }

    &:focus {
      outline: none;
      border-color: ${(props) => props.theme.main};
    }
  }
`;
const ResetButton = styled.div`
  width: 107px;
  height: 43px;
  background-color: ${(props) => props.theme.main};
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 16px;
  font-weight: 500;
  margin-left: auto;
  cursor: pointer;
`;
