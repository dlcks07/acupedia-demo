import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useForm } from 'react-hook-form';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import axiosInstance from './AxiosInstance';

function ChangePassword({ onBackClick }: any) {
  const navigation = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [passwordType1, setPasswordType1] = useState('password');
  const [passwordType2, setPasswordType2] = useState('password');
  const [passwordType3, setPasswordType3] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const email = sessionStorage.getItem('email');
  const jwtToken = sessionStorage.getItem('jwtToken');

  const clickPasswordIcon1 = () => {
    setPasswordType1(passwordType1 === 'password' ? 'text' : 'password');
  };
  const clickPasswordIcon2 = () => {
    setPasswordType2(passwordType2 === 'password' ? 'text' : 'password');
  };
  const clickPasswordIcon3 = () => {
    setPasswordType3(passwordType3 === 'password' ? 'text' : 'password');
  };
  const onValid = async (validForm: any) => {
    console.log(validForm);
    if (validForm.newPassword !== validForm.checkPassword) {
      if (isMobile) {
        alert('비밀번호를 다시 확인해주세요.');
      } else {
        toast('비밀번호를 다시 확인해주세요.');
      }
      return;
    }
    setIsLoading(true);
    const response = await axiosInstance
      .post(
        `/user/password/change?&email=${email}&currentPassword=${validForm.originPassword}&changePassword=${validForm.newPassword}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        }
      )
      .finally(() => setIsLoading(false));
    if (response.status === 200) {
      reset();
      if (isMobile) {
        alert('비밀번호를 변경하였습니다.');
      } else {
        toast('비밀번호를 변경하였습니다.');
      }
      // navigation('/');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onValid)}>
        <div className="mypage__row">
            <span className="mypage__label">기존 비밀번호</span>
            <div className="mypage__pwinputWrap">
              <input
                {...register('originPassword', { required: true })}
                type={passwordType1}
                placeholder="기존 비밀번호를 입력해주세요."
                className="mypage__passwordInput"
              ></input>
              {passwordType1 === 'password' ? (
                <BsEyeSlash onClick={clickPasswordIcon1} className="password" />
              ) : (
                <BsEye onClick={clickPasswordIcon1} className="password" />
              )}
            </div>
        </div>  
        
        <div className="mypage__row">
            <span className="mypage__label">신규 비밀번호</span>
            <div className="mypage__pwinputWrap">
              <input
                {...register('newPassword', { required: true })}
                type={passwordType2}
                placeholder="신규 비밀번호를 입력해주세요."
                className="mypage__passwordInput"
              ></input>
              {passwordType2 === 'password' ? (
                <BsEyeSlash onClick={clickPasswordIcon2} className="password" />
              ) : (
                <BsEye onClick={clickPasswordIcon2} className="password" />
              )}
            </div>
        </div>
        
        <div className="mypage__row">
            <span className="mypage__label">비밀번호 확인</span>
            <div className="mypage__pwinputWrap">
              <input
                {...register('checkPassword', { required: true })}
                type={passwordType3}
                placeholder="비밀번호를 다시 입력해주세요."
                className="mypage__passwordInput"
              ></input>
              {passwordType3 === 'password' ? (
                <BsEyeSlash onClick={clickPasswordIcon3} className="password" />
              ) : (
                <BsEye onClick={clickPasswordIcon3} className="password" />
              )}
            </div>
        </div>

        <div className="mypage__btn-row">
          <button className="btn blue01">
            {isLoading ? <ClipLoader size={20} color="white" /> : '확인'}
          </button>
          <div
            onClick={onBackClick}
            className="btn grey"
          >
            돌아가기
          </div>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
