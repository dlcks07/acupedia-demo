import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { FiArrowRight } from 'react-icons/fi';
import { isBrowser } from 'react-device-detect';
import axiosInstance from 'components/AxiosInstance';
import GoogleAdvertise from 'components/GoogleAdvertise';
import { HORIZONTAL } from 'constants/GoogleAds';
import { useForm } from 'react-hook-form';
import { useAppSelector } from 'store';
import { SignUpModal } from 'components';
import { Helmet } from 'react-helmet-async';
import '../styles/login.css';

function Login() {
  const { lastPageBeforeLogin, accessToken } = useAppSelector((state) => state.setting);
  const location = useLocation();
  const navigation = useNavigate();
  const { register, handleSubmit } = useForm();
  const [passwordType, setPasswordType] = useState('password');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onValid = async (validForm: any) => {
    console.log();

    if (loading) return;
    setLoading(true);
    console.log(validForm);

    const response = await axiosInstance
      .post('/authenticate/login', {
        email: validForm.email,
        password: validForm.password
      })
      .finally(() => setLoading(false));
    if (response.status === 200) {
      sessionStorage.setItem('jwtToken', response.data.data.jwtToken);
      sessionStorage.setItem('nickname', response.data.data.nickname);
      sessionStorage.setItem('email', response.data.data.email);
      sessionStorage.setItem('authority', response.data.data.authority);
      if (response.status === 200) {
        console.log(lastPageBeforeLogin);

        if (lastPageBeforeLogin === '/createAccount') {
          navigation('/');
          return;
        }
        if (lastPageBeforeLogin) {
          navigation(lastPageBeforeLogin);
        } else {
          navigation('/');
        }
      }
    }

    console.log(response);
  };

  const successGoogle = async (res: any) => {
    console.log(res);
    const formData = new FormData();
    formData.append('code', res?.code);
    formData.append(
      'client_id',
      '350409008095-sfstjhbcmv7g7te156d5p2c18l13u1eg.apps.googleusercontent.com'
    );
    formData.append(
      'redirect_uri',
      process.env.NODE_ENV == 'production'
        ? 'https://www.acupedia.net'
        : 'http://localhost:3000'
    );
    formData.append('grant_type', 'authorization_code');

    const response = await axiosInstance.post(
      'https://oauth2.googleapis.com/token',
      formData
    );
    console.log(response);

    if (response.status === 200) {
      const response2 = await axiosInstance.get(
        `https://www.googleapis.com/userinfo/v2/me?access_token=${response.data.access_token}`
      );
      if (response2.status === 200) {
        console.log(response2);

        const response3 = await axiosInstance
          .post('/authenticate/google', {
            email: response2.data.email,
            nickname: response2.data.name
          })
          .finally(() => setLoading(false));
        console.log(response3);

        if (response3.status === 200) {
          sessionStorage.setItem('jwtToken', response3.data.data.jwtToken);
          sessionStorage.setItem('nickname', response3.data.data.nickname);
          sessionStorage.setItem('email', response3.data.data.email);
          sessionStorage.setItem('authority', response3.data.data.authority);
          if (response3.status === 200) {
            if (lastPageBeforeLogin === '/createAccount') {
              navigation('/');
              return;
            }
            if (lastPageBeforeLogin) {
              navigation(lastPageBeforeLogin);
            } else {
              navigation('/');
            }
          }
        }
      }
      console.log(response2);
    }
  };

  const failGoogle = (response: any) => {
    console.log(response);
  };

  const createAccount = () => {
    navigation(`/createAccount`);
    //setIsModalOpen(true);
  };
  const clickPasswordIcon = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  const login = useGoogleLogin({
    onSuccess: successGoogle,
    flow: 'auth-code'
  });

  return (
  <div className="login__container">
    <Helmet>
      <title>로그인 - 아큐피디아</title>
      <meta name="description" content="아큐피디아 로그인 페이지입니다." />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href="https://www.acupedia.net/login" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="아큐피디아" />
      <meta property="og:title" content="로그인 - 아큐피디아" />
      <meta property="og:description" content="아큐피디아 로그인 페이지입니다." />
      <meta property="og:url" content="https://www.acupedia.net/login" />
      <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
    </Helmet>
    <div className="login__titleWrap">
      <span className="login__titleWrap__loginTitle pageTitle">로그인</span>
      <div className="login__titleWrap__signUpTitle">
        회원가입
        <div className="login__titleWrap__signUpButton" onClick={createAccount}>
          <FiArrowRight className="login__titleWrap__rightArrow" />
        </div>
      </div>
      
    </div>

    <div className="login__subTitleWrap"><p className='pageTitleText'>아큐피디아에 오신 것을 환영합니다.</p></div>

    <div className="login__formWrap">
      <form onSubmit={handleSubmit(onValid)} className="login__formWrap__form">
        <input
          {...register('email', { required: true })}
          placeholder="이메일을 입력해주세요."
          className="inputText"
        />
        <div className="login__formWrap__passwordWrap">
          <input
            {...register('password', { required: true })}
            type={passwordType}
            placeholder="비밀번호를 입력해주세요."
            className="inputText"
          />
          {passwordType === 'password' ? (
            <BsEyeSlash onClick={clickPasswordIcon} className="login__formWrap__passwordIcon" />
          ) : (
            <BsEye onClick={clickPasswordIcon} className="login__formWrap__passwordIcon" />
          )}
        </div>
        <button className="login__formWrap__loginButton btn blue01 w-full">
          {loading ? <ClipLoader size={20} color="white" /> : '로그인 하기'}
        </button>
      </form>
    </div>

    <div className="login__splitLine" />

    {/* <div className="login__googleButton" onClick={login}>
      <FcGoogle className="login__googleButton__icon" />
      Continue with Google
    </div> */}

    <div className="login__forgetButton">
      <Link to={'/findAccount'}>비밀번호를 잊으셨나요?</Link>
    </div>

    {/* <div className="w-full h-[1px] bg-[#dddddd] mt-[50px] mb-[103px] invisible" /> */}

    <SignUpModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
  </div>
);

}

export default Login;