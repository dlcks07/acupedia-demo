import { useGoogleLogin } from '@react-oauth/google';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'store';
import axiosInstance from './AxiosInstance';
import '../styles/login.css';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: any;
}

function SignUpModal({ isModalOpen, setIsModalOpen }: Props) {
  const { lastPageBeforeLogin } = useAppSelector((state) => state.setting);
  const navigation = useNavigate();

  const onSignUpClick = () => {
    setIsModalOpen(false);

    navigation('/createAccount');
  };

  const successGoogle = async (res: any) => {
    setIsModalOpen(false);

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

        const response3 = await axiosInstance.post('/authenticate/google', {
          email: response2.data.email,
          nickname: response2.data.name
        });
        console.log(response3);

        if (response3.status === 200) {
          sessionStorage.setItem('jwtToken', response3.data.data.jwtToken);
          sessionStorage.setItem('nickname', response3.data.data.nickname);
          sessionStorage.setItem('email', response3.data.data.email);
          sessionStorage.setItem('authority', response3.data.data.authority);
          if (response3.status === 200) {
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

  const onGoogleClick = useGoogleLogin({
    onSuccess: successGoogle,
    onError: () => setIsModalOpen(false),
    flow: 'auth-code'
  });

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      className="Modal__contents signupModal"
      overlayClassName="Modal__overlay"
      ariaHideApp={false}
    >
      <div className="signupModal__wrap">
        <div
          onClick={onSignUpClick}
          className="signupModal__signupButton"
        >
          아큐피디아 계정 생성하기
        </div>
        <div
          onClick={onGoogleClick}
          className="signupModal__googleButton"
        >
          <div className="signupModal__googleButton__inner">
            <FcGoogle className="signupModal__googleButton__icon" />
            <span className="signupModal__googleButton__text">
              Continue with Google
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default SignUpModal;
