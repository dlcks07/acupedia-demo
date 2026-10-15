import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from './AxiosInstance';

function Exit({ onBackClick }: any) {
  const navigation = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const email = sessionStorage.getItem('email');
  const jwtToken = sessionStorage.getItem('jwtToken');

  const onCheckClick = () => {
    setIsChecked((prev) => !prev);
  };
  const onExitClick = async () => {
    if (!isChecked) {
      if (isMobile) {
        alert('동의사항에 체크해주세요.');
      } else {
        toast('동의사항에 체크해주세요.');
      }
      return;
    }
    if (window.confirm('정말 탈퇴하시겠습니까?')) {
      const response = await axiosInstance.post(
        `/user/withdrawal`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        }
      );
      if (response.status === 200) {
        if (isMobile) {
          alert('탈퇴되었습니다.');
        } else {
          toast('탈퇴되었습니다.');
        }
      }
      sessionStorage.clear();
      navigation('/');
    }
  };
  return (
    <div className="exit__container">
      <div className="exit__box">
        <div className="exit__intro-text">
          {`아큐피디아 사용에 진심으로 감사드립니다.
            회원탈퇴 전 반드시 유의사항을 확인하고 진행부탁드립니다.`}
        </div>
        <div className="exit__underline" />
        <div className="exit__section first:mt-[35px]">
          <p className="exit__section-title">개인정보 및 서비스 이용기록 삭제</p>
          <p className="exit__section-desc">
            개인정보 및 개인 서비스 이용기록이 모두 삭제 되어 삭제된 데이터는 복구되지
            않습니다. 필요한 데이터는 미리 백업해 주시기 바랍니다.
          </p>
        </div>

        <div className="exit__section">
          <p className="exit__section-title">소셜 계정 연결 정보 삭제</p>
          <p className="exit__section-desc">
            소셜 계정에 ID를 연결한 경우 탈퇴 시 연결 정보도 함께 삭제됩니다.
          </p>
        </div>
        <div className="exit__section">
          <p className="exit__section-title">위키 등록 게시물 유지</p>
          <p className="exit__section-desc">
            회원가입 이후 등록하신 게시물들은 회원탈퇴 후에도 삭제 되지 않고 유지됩니다.
          </p>
        </div>
        <div className="exit__section">
          <p className="exit__section-title">탈퇴 후 제한</p>
          <p className="exit__section-desc">
            회원탈퇴 처리 후에는 회원님의 개인정보를 복원할 수 없으며, 회원탈퇴 진행 시
            해당 아이디는 영구적으로 삭제되어 재가입이 불가합니다.
          </p>
        </div>
      </div>

      <div className="exit__agreement">
        <input
          required
          checked={isChecked}
          onChange={onCheckClick}
          type={'checkbox'}
          className="exit__checkbox"
        />
        <span className="exit__agreement-text">
          회원탈퇴 시 유의사항을 확인하였으며, 모두 동의합니다.
        </span>
      </div>
      <div className="exit__button-row">
        <div
          onClick={onExitClick}
          className="btn grey"
        >
          탈퇴하기
        </div>
        <div
          onClick={onBackClick}
          className="btn"
        >
          취소
        </div>
      </div>
    </div>
  );
}

export default Exit;
