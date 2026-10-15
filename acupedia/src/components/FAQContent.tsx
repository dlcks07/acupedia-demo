import React from 'react';
import { isBrowser } from 'react-device-detect';
import styled from 'styled-components';

function FAQContent() {
  return (
    <Container>
      {/* <span className="faq ">FAQ</span> */}
      <span className="title">아큐피디아에 오신 것을 환영합니다!</span>
      {/* <span className="subtitle">도움이 필요하신가요?</span> */}

      <div className="w-[760px] mt-12 0 flex">
        <div className="mr-[78px]">
          <div className=" flex pl-[10px] border-l-4 border-[#ffa63d] w-[150px] text-lg text-[#182f43] font-semibold">
            아큐피디아 위키
          </div>
        </div>
        <div>
          <div className="whitespace-pre-line text-[#182f43] w-[590px]">
            {`아큐피디아 위키는 여러분의 참여로 완성되는 위키공간입니다.
            문서작성은 회원가입 후 가능하며, 회원인증은 마이페이지에서 확인하실 수 있습니다. 편집하신 내용은 관리자의 승인 후 게시됩니다. `}
          </div>
        </div>
      </div>

      <div className="w-[760px] mt-12  flex">
        <div className="mr-[78px]">
          <div className="flex pl-[10px] border-l-4 border-[#ffa63d] w-[150px] text-lg text-[#182f43] font-semibold">
            침구처방검색
          </div>
        </div>
        <div>
          <div className="text-[#182f43] w-[625px]">
            <p>
              아큐피디아는 침구처방 검색기능이 탑재되어 있습니다. 주치 병증(예:
              咳嗽)을 입력하시
            </p>
            <p>
              면 해당 주치와 관련된 경혈 혹은 침구처방을 검색하실 수 있습니다.
              또는 경혈명(예:合
            </p>
            <p>
              谷)을 입력하시면 해당 경혈이 포함된 침구처방을 검색할 수도
              있습니다.
            </p>
          </div>
        </div>
      </div>

      <div className="w-[760px] mt-12  flex">
        <div className="mr-[78px]">
          <div className="flex pl-[10px] border-l-4 border-[#ffa63d] w-[150px] text-lg text-[#182f43] font-semibold">
            저작권
          </div>
        </div>
        <div>
          <div className="whitespace-pre-line text-[#182f43] w-[625px]">
            <p>
              아큐피디아 위키에 기여하신 문서의 저작권은 각 기여자에게 있으며,
              그 외 모든데이터의 저작권은 아큐피디아에 있습니다. 무단 전재를
              금합니다. 자세한 내용은 서비스이용약관에서 확인 가능합니다.
              문의사항이 있는 경우 admin@acupedia.net 으로 메일 주시기 바랍니다.
            </p>
          </div>
        </div>
      </div>

      <div className="w-[760px] mt-12  flex">
        <div className="mr-[78px]">
          <div className="flex pl-[10px] border-l-4 border-[#ffa63d] w-[150px] text-lg text-[#182f43] font-semibold">
            기타
          </div>
        </div>
        <div>
          <div className="whitespace-pre-line text-[#182f43] w-[625px]">
            <p>
              본 프로젝트는 한의 지식을 널리 알리고 공유하기 위해 진행되었으며,
              추후 여러 기능의 추가가 예정되어 있습니다. 지속적인 관심과 참여
              부탁드립니다.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default FAQContent;

const Container = styled.div`
  width: ${isBrowser ? '' : '1440px'};
  display: flex;
  flex-direction: column;
  align-items: center;
`;
