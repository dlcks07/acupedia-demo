import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import ReCAPTCHA from 'react-google-recaptcha';
import { useLocation, useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { IoAlertCircleOutline } from 'react-icons/io5';
import CreatableSelect from 'react-select/creatable';
import { isBrowser, isMobile } from 'react-device-detect';
import { cls, publicPath } from 'libs/utils';
import { CheckIcon, XIcon } from '@heroicons/react/outline';
import { useDebounce } from 'use-debounce';
import ClipLoader from 'react-spinners/ClipLoader';
import axiosInstance from 'components/AxiosInstance';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'store';
import settingSlice from 'slices/setting';
import { Helmet } from 'react-helmet-async';

interface EnterForm {
  email?: string;
  phone?: string;
}

function CreateAccount() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const { register, handleSubmit, reset, control, watch } = useForm();
  const observer = watch(['email', 'backEmail', 'nickname']);
  const [isCap, setIsCap] = useState('');
  const [isDirect, setIsDirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [canEmailUse, setCanEmailUse] = useState(false);
  const [canNicknameUse, setCanNicknameUse] = useState(false);
  const [curNickname, setCurNickname] = useState('');
  const [curEmail, setCurEmail] = useState({
    email: '',
    backEmail: '',
  });
  const [debounceValue] = useDebounce(observer, 2000);
  const curLocation = location.pathname + location.search;
  const [code, setCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifySend, setIsVerifySend] = useState(false);
  const initialTime = 180;
  const [remainingTime, setRemainingTime] = useState(0);

  const sendVerificationCode = async () => {
    if (
      debounceValue[0]?.trim().length > 0 &&
      debounceValue[1]?.trim().length > 0
    ) {

      setLoading(true);
      const response = await axiosInstance
        .post(`/user/verifyEmail/send?email=${debounceValue[0]?.trim()}@${debounceValue[1]?.trim()}`)
        .finally(() => setLoading(false));
      if (response.status === 200) {
        if (response.data.data === '이메일 인증 코드전송 성공') {
          if (isMobile) {
            alert('코드가 발송되었습니다.');
          } else {
            toast('코드가 발송되었습니다.');
          }
          setIsVerifySend(true);
    setRemainingTime(initialTime);
  }
      }
    }
  };

  useEffect(() => {

    // useEffect를 사용하여 컴포넌트가 마운트될 때 타이머 시작.
    const timer = setInterval(() => {
      // 남은 시간이 0보다 크면 1초씩 감소시킴.
      if (remainingTime > 0) {
        setRemainingTime((prevTime) => prevTime - 1);
      } else {
        //인증하기 전에 시간 종료되면 메일 발송부터 다시 해야함.
        if(!isVerified){
          setIsVerifySend(false);
        }
        // 남은 시간이 0이 되면 타이머 정지.
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
        
  }, [remainingTime]);

  const verifyCode = async () => {

    if (isVerified) {

      if (isMobile) {
        alert('이미 이메일 인증을 완료하셨습니다.');
      } else {
        toast('이미 이메일 인증을 완료하셨습니다.');
      }

    }else{

      setLoading(true);
      const response = await axiosInstance
        .post(`/user/verifyEmail/confirm?email=${debounceValue[0]?.trim()}@${debounceValue[1]?.trim()}&code=${code}`)
        .finally(() => setLoading(false));
      if (response.status === 200) {
        if (response.data.data === '코드가 일치합니다.') {
          setIsVerified(true);
    setRemainingTime(0);
          if (isMobile) {
            alert('이메일 인증이 완료되었습니다.');
          } else {
            toast('이메일 인증이 완료되었습니다.');
          }
  }else{
          if (isMobile) {
            alert('인증 코드를 다시 확인해주세요.');
          } else {
            toast('인증 코드를 다시 확인해주세요.');
          }
  }
      }
    }
  };

  const formatTime =  () => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  const options = useMemo(
    () => [
      { value: 'naver.com', label: 'naver.com' },
      { value: 'hanmail.net', label: 'hanmail.net' },
      { value: 'daum.net', label: 'daum.net' },
      { value: 'nate.com', label: 'nate.com' },
      { value: 'gmail.com', label: 'gmail.com' },
      { value: 'yahoo.com', label: 'yahoo.com' },
      { value: '직접입력', label: '직접입력' },
    ],
    []
  );

  const customStyles = useMemo(
    () => ({
      option: (provided: any, state: any) => ({
        ...provided,
      }),
      control: (provided: any) => ({
        ...provided,
        width: 254,
        height: 48,
        border: '1px solid  #cfd9fe',
        borderRadius: 6,
        textIndent: 5,
        outline: 'none',
        boxShadow: 'none',
        '&:hover': {
          outline: 'none',
          borderColor: '#0A2996',
        },
        '&:focus-within': {
          outline: 'none',
          borderColor: '#0A2996',
        },
      }),
      singleValue: (provided: any, state: any) => ({
        ...provided,
        color: '#84AED3',
      }),
      menu: (provided: any, state: any) => ({
        ...provided,
        marginTop: -20,
      }),
      placeholder: (defaultStyles: any, state: any) => ({
        ...defaultStyles,
        color: '#84AED3',
        fontSize: 16,
        fontWeight: 400,
      }),
      input: (defaultStyles: any) => ({
        ...defaultStyles,
        marginLeft: 7,
        color: '#84AED3',
      }),
    }),
    []
  );

  const onChangeRecap = (value: any) => {
    setIsCap(value);
    console.log('Captcha value:', value);
  };
  const onBackClick = () => {
    navigation('/');
  };
  const onValid = async (validForm: any) => {
    console.log(validForm);
    if (loading) return;
    if (
      curEmail?.email?.trim().length === 0 ||
      curEmail?.backEmail?.trim().length === 0
    ) {
      if (isMobile) {
        alert('이메일을 다시 확인해주세요.');
      } else {
        toast('이메일을 다시 확인해주세요.');
      }
      return;
    }
    if (!canEmailUse) {
      if (isMobile) {
        alert('이메일을 다시 확인해주세요.');
      } else {
        toast('이메일을 다시 확인해주세요.');
      }
      return;
    }
    if (!isVerified) {
      if (isMobile) {
        alert('이메일 인증을 진행해주세요.');
      } else {
        toast('이메일 인증을 진행해주세요.');
      }
      return;
    }
    if (curNickname?.trim().length === 0) {
      if (isMobile) {
        alert('닉네임을 다시 확인해주세요.');
      } else {
        toast('닉네임을 다시 확인해주세요.');
      }
      return;
    }
    if (!canNicknameUse) {
      if (isMobile) {
        alert('닉네임을 다시 확인해주세요.');
      } else {
        toast('닉네임을 다시 확인해주세요.');
      }
      return;
    }
    if (validForm.password.trim().length === 0) {
      if (isMobile) {
        alert('비밀번호를 다시 확인해주세요.');
      } else {
        toast('비밀번호를 다시 확인해주세요.');
      }
      return;
    }
    if (validForm.password.trim() !== validForm.rePassword.trim()) {
      if (isMobile) {
        alert('비밀번호를 다시 확인해주세요.');
      } else {
        toast('비밀번호를 다시 확인해주세요.');
      }
      return;
    }
    if (
      /[`\-=\\\[\];',\./~!@#\$%\^&\*\(\)_\+|\{\}:"<>\?]/g.test(validForm.password.trim())
    ) {
      if (isMobile) {
        alert(
          '비밀번호는 특수문자를 제외하고 입력해주세요.'
        );
      } else {
        toast(
          '비밀번호는 특수문자를 제외하고 입력해주세요.'
        );
      }
      return;
    }
    if (
      !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(validForm.password.trim())
    ) {
      if (isMobile) {
        alert(
          '비밀번호는 최소 8자, 하나의 문자 및 하나의 숫자를 포함해주세요.'
        );
      } else {
        toast(
          '비밀번호는 최소 8자, 하나의 문자 및 하나의 숫자를 포함해주세요.'
        );
      }
      return;
    }
    if (isCap?.length === 0 || isCap === null) {
      if (isMobile) {
        alert("'로봇이 아닙니다'를 체크해주세요.");
      } else {
        toast("'로봇이 아닙니다'를 체크해주세요.");
      }
      return;
    }
    setLoading(true);
    const response = await axiosInstance
      .post('/user', {
        email: validForm.email.trim() + '@' + validForm.backEmail.trim(),
        password: validForm.password.trim(),
        nickname: validForm.nickname.trim(),
        isGoogleLogin: false,
        recaptchaCode: isCap,
      })
      .finally(() => setLoading(false));
    console.log(response);
    if (response.status === 200) {
      setIsModalOpen(true);
    }
  };
  const onConfirmClick = () => {
    setIsModalOpen(false);
    dispatch(
      settingSlice.actions.setLastPageBeforeLogin({
        lastPageBeforeLogin: curLocation,
      })
    );
    navigation('/login');
  };

  const onDebounceCall = async () => {
    if (
      debounceValue[0]?.trim().length > 0 &&
      debounceValue[1]?.trim().length > 0 &&
      (curEmail.email !== debounceValue[0] ||
        curEmail.backEmail !== debounceValue[1])
    ) {
      // 메일주소 변경되면 이메일 인증 초기화
      setIsVerifySend(false);
      setIsVerified(false);
      setCode('');
      // api호출
      const response = await axiosInstance.get(
        `/user/duplicate/email?email=${debounceValue[0]?.trim()}@${debounceValue[1]?.trim()}`
      );
      console.log(response);
      if (response.status === 200) {
        if (response.data.data === '사용가능한 이메일입니다.') {
          setCanEmailUse(true);
        } else {
          setCanEmailUse(false);
        }
      }
    }

    // 닉네임
    if (
      debounceValue[2]?.trim().length > 0 &&
      curNickname !== debounceValue[2]
    ) {
      // api호출
      console.log(debounceValue);

      const response = await axiosInstance.get(
        `/user/duplicate/nickname?nickname=${debounceValue[2]?.trim()}`
      );
      console.log(response);
      if (response.status === 200) {
        if (response.data.data === '사용가능한 닉네임입니다.') {
          setCanNicknameUse(true);
        } else {
          setCanNicknameUse(false);
        }
      }
    }
  };

  useEffect(() => {
    setCurEmail({
      email: debounceValue[0]?.trim(),
      backEmail: debounceValue[1]?.trim(),
    });
    setCurNickname(debounceValue[2]?.trim());
    onDebounceCall();
  }, [debounceValue]);

  return (
    <>
      <Helmet>
        <title>회원가입 - 아큐피디아</title>
        <meta name="description" content="아큐피디아 회원가입 페이지입니다." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://www.acupedia.net/createAccount" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="아큐피디아" />
        <meta property="og:title" content="회원가입 - 아큐피디아" />
        <meta property="og:description" content="아큐피디아 회원가입 페이지입니다." />
        <meta property="og:url" content="https://www.acupedia.net/createAccount" />
        <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
      </Helmet>
      <div className='ctAccount__container'>
        <div>
          <div className='ctAccount__contentWrap'>
            <div className='ctAccount__title pageTitle'>회원가입</div>
            <div className='ctAccount__subTitleWrap pageTitleText'>
                아큐피디아에 오신 것을 환영합니다.<br/>
                아큐피디아에 가입해 자유롭게 문서를 편집/열람해 보세요.
            </div>
            
            <form onSubmit={handleSubmit(onValid)} className='ctAccount__form'>
              <div className='ctAccount__inputWrap'>
                <span className='inputTit'>E-mail 입력하기</span>
                <div className='inputCnts emailInput'>
                  <input    
                    className="inputText"                
                    {...register('email', { required: true })}
                    required
                  ></input>
                <span className="at">@</span>
                {isDirect ? (
                  <input
                    {...register('backEmail', { required: true })}
                    type="text"
                    className="etcInput inputText"
                  />
                ) : (                  
                  <Controller
                    name="backEmail"                   
                    control={control}
                    rules={{ required: true }}                  
                    render={({ field: { onChange, value, ref } }) => {
                      return (
                        <CreatableSelect
                          className="controllerInput"
                          ref={ref}
                          onChange={(val) => {
                            if (val?.value === '직접입력') {
                              setIsDirect(true);
                              return;
                            }
                            onChange(val?.value);
                          }}
                          options={options}
                          styles={customStyles}
                          placeholder={'선택하세요.'}
                          components={{ IndicatorSeparator: () => null }}
                          formatCreateLabel={(value) =>
                            `${"'" + value + "'"} 선택`
                          }
                        />
                      );
                    }}
                  />
                )}
                {curEmail.backEmail &&
                curEmail.backEmail.trim().length > 0 &&
                curEmail.email &&
                curEmail.email.trim().length > 0 ? (
                  <div className="chcekText">
                    {canEmailUse ? (
                      <>
                        <CheckIcon className="h-6 text-green-400" />
                        <span className='ml-1'>사용가능한 메일입니다.</span>
                      </>
                    ) : (
                      <>
                        <XIcon className="h-6 text-red-400" />
                        <span className='ml-1'>이미 등록된 메일입니다.</span>
                      </>
                    )}
                  </div>
                ) : null}
                </div>
              </div>

              {curEmail.backEmail &&
                curEmail.backEmail.trim().length > 0 &&
                curEmail.email &&
                curEmail.email.trim().length > 0 &&
              canEmailUse ? (
                <>                  
                  <div className='ctAccount__inputWrap' >
                      <span className='inputTit blank'></span>
                      <div className='inputCnts'>
                      <input
                       className="inputText"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        readOnly={isVerified || !isVerifySend ? true : false}                        
                      ></input>
                      { isVerifySend ? (
                        <button type="button"
                          onClick={verifyCode}
                          className='certiBtn'
                      >{ isVerified ? '인증완료' : '인증하기'}</button>
                      ) : (
                        <button type="button"
                          onClick={sendVerificationCode}
                          className='certiBtn'
                        >이메일 인증</button>
                      )}
          { isVerifySend && !isVerified ? formatTime() : '' }
                    </div>
                    </div>
                </>
              ) : (
                <>
                </>
              )}

              <div className='ctAccount__inputWrap'>
                <span className='inputTit'>닉네임 입력하기</span>
                <div className='inputCnts'>
                <input
                  className="inputText"
                  {...register('nickname', {
                    required: true,
                    maxLength: 12,
                  })}
                  maxLength={12}
                  required
                ></input>
                <div className='alertTextWrap'>
                  <IoAlertCircleOutline className="alert" />
                  <span className="idAlert">
                  12자 이내의 한글, 영어, 숫자만 가능
                </span>
                </div>
                {curNickname && curNickname.trim().length > 0 ? (
                  <div className="chcekText">
                    {canNicknameUse ? (
                      <>
                        <CheckIcon className="h-7 text-green-400" />
                        <span className='ml-1'>사용가능한 닉네임입니다.</span>
                      </>
                    ) : (
                      <>
                        <XIcon className="h-7 text-red-400" />
                        <span className='ml-1'>이미 등록된 닉네임입니다.</span>
                      </>
                    )}
                  </div>                  
                ) : null}
                </div>
              </div>
              <div className='ctAccount__inputWrap'>
                <span className='inputTit'>Password 입력하기</span>
                <div className='inputCnts'>
                  <input
                    className="inputText"
                    {...register('password', { required: true })}
                    type="password"
                    required
                  ></input>
                  <div className='alertTextWrap'>
                    <IoAlertCircleOutline className="alert" />
                    <span className="idAlert">
                      최소 8자, 하나의 문자 및 하나의 숫자를 포함해주세요.
                    </span>
                  </div>
                </div>
              </div>

              <div className='ctAccount__inputWrap'>
                <span className='inputTit'>Password 확인</span>
                <div className='inputCnts'>
                  <input
                    className="inputText"
                    {...register('rePassword', { required: true })}
                    type="password"
                    required
                  ></input>
                </div>
              </div>

              <div className='ctAccount__policyWrap'>
                <input
                  {...register('checkbox', { required: true })}                  
                  className='checkBox mr-1'
                  required
                  type={'checkbox'}
                />
                <span className="font-bold">
                  <a
                    href={publicPath('/terms')}
                    className="ctAccount__highlight"
                  >
                    이용약관
                  </a>{' '}
                  및{' '}
                  <a
                    href={publicPath('/privacy')}
                    className="ctAccount__highlight"
                  >
                    개인정보취급방침
                  </a>
                  을 읽었으며 이에 동의합니다.
                </span>
              </div>

              <ReCAPTCHA
                className="recap"
                sitekey={process.env.REACT_APP_RECAP_API_KEY!!}
                onChange={(value) => onChangeRecap(value)}
              />

              <div className='ctAccount__buttonWrap'>
                <Confirm className="confirm btn blue01">
                  {loading ? <ClipLoader size={20} color="white" /> : '확 인'}
                </Confirm>
                <Cancel onClick={onBackClick} className="cancel btn grey">
                  돌아가기
                </Cancel>             
              </div>
            </form>
          </div>
          {/* <SideWrap>
            <SideComponent />
          </SideWrap> */}
        </div>
      </div>

      <Modal
        ariaHideApp={false}
        className="Modal__contents welcomeMember"
        overlayClassName="Modal__overlay"
        isOpen={isModalOpen}
      >
        <p className="welcomeMember__tit">
          아큐피디아 가입을 환영합니다!
        </p>
        <div className="wecomeMember_text mt-5">
          <p>문서편집 권한은 한의사, 한의대생 회원에게 있습니다.</p>
          <p>한의사, 한의대생 등급으로 변경을 원하시면<br/>       
            <span className="text-blue">admin@acupedia.net</span>으로 하단의 내용을 기입하여{' '}<br/> 
            <span className="text-orange">추가 인증 자료</span>를
            보내주시길 바랍니다.
          </p>
          <p>(닉네임, 가입 이메일, 면허증/학생증 사본)</p>
        </div>
        <div
          onClick={onConfirmClick}
          className="btn blue01 small w-full mt-8"
        >
          확인
        </div>
      </Modal>
    </>
  );
}

export default CreateAccount;

const Confirm = styled.button`
  cursor: pointer;
`;
const Cancel = styled.div`  
  cursor: pointer;
`;