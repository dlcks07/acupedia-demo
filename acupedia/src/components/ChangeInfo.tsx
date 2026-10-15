import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import axiosInstance from './AxiosInstance';

function ChangeInfo({ onBackClick, nickname }: any) {
  const jwtToken = sessionStorage.getItem('jwtToken');
  const email = sessionStorage.getItem('email');
  const [text, setText] = useState(nickname || '');
  const [isLoading, setIsLoading] = useState(false);
  console.log(nickname);

  const onSubmitClick = async () => {
    /*if (text.length === 0) {
      if (isMobile) {
        alert('변경할 닉네임을 입력해주세요.');
        return;
      } else {
        toast('변경할 닉네임을 입력해주세요.');
        return;
      }
    }
    if (text === nickname) {
      if (isMobile) {
        alert('같은 닉네임으로 변경할 수 없습니다.');
        return;
      } else {
        toast('같은 닉네임으로 변경할 수 없습니다.');
        return;
      }
    }
    setIsLoading(true);
    const response = await axiosInstance
      .post(
        `/user/nickname?email=${email}&currentNickname=${nickname}&changeNickname=${text}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
      .finally(() => setIsLoading(false));
    if (response.status === 200) {
      sessionStorage.setItem('nickname', text);
      window.dispatchEvent(new Event('storage'));
      // setText('');
      if (isMobile) {
        alert('변경되었습니다.');
        return;
      } else {
        toast('변경되었습니다.');
        return;
      }
    }*/
  };

  return (
    <div>
       <div className="mypage__row">
        <span className="mypage__label">E-Mail</span>
        <div className="mypage__inputWrap">
          <div className="mypage__email-box">{email?.split('@')[0]}</div>
          <span className="mypage__email-divider">@</span>
          <div className="mypage__email-box">{email?.split('@')[1]}</div>
        </div>
      </div>

      <div className="mypage__row">
        <span className="mypage__label">닉네임</span>
        <div className="mypage__inputWrap">
          <div className="mypage__nickname-box">{text}</div>
          {/*<input
            autoFocus
            required
            maxLength={12}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mypage__nickname-box"
          />
          <div className="mypage__nickname-rule">
            <ExclamationCircleIcon className="mypage__nickname-icon" />
            <span className="mypage__nickname-desc">
              12자 이내의 한글, 영어, 숫자만 가능
            </span>
          </div>*/}
        </div>  
      </div>

      <div className="mypage__btn-row">
        <div
          onClick={onSubmitClick}
          className="btn blue01"
        >
          {isLoading ? <ClipLoader size={20} color="white" /> : '확인'}
        </div>
        <div
          onClick={onBackClick}
          className="btn grey"
        >
          돌아가기
        </div>
      </div>

      <div className="mypage__notice-box">
      <p className="mypage__notice-title">회원 등급 인증 안내</p>
      <div className="mypage__notice-content">
        한의사, 한의대생 등급으로 변경을 원하시면{' '}
        <a href="mailto:admin@acupedia.net"><span className="text-[#188aef]">admin@acupedia.net</span></a>으로 {' '}
        <span className="text-[#fb6c05]">추가 인증 자료</span>(면허증/학생증 사본)와 함께 
        <span className="text-[#fb6c05]">닉네임, 가입 이메일</span>을 기입하여 보내 주시면 확인 후 진행해 드립니다. 자세한 내용은 이용약관을 참고해 주세요.
      </div>
    </div>

    </div>
  );
}

export default ChangeInfo;
