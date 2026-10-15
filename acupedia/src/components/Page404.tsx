import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { publicPath } from 'libs/utils';

function Page404() {
  const navigation = useNavigate();
  const onBackClick = () => {
    navigation('/');
  };
  return (
    <div className="w-[1028px] h-[1600px] flex justify-center pt-[50px]">
      <Helmet>
        <title>페이지를 찾을 수 없습니다 - 아큐피디아</title>
        <meta name="description" content="요청하신 페이지를 찾을 수 없습니다."/>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="w-[1028px] h-[330px] flex">
        <div className="w-[650px] h-full ">
          <p className="text-[60px] text-[#fb6c05] font-semibold">404 ERROR</p>
          <p className="text-[56px] tracking-tighter font-medium">
            페이지를 찾을 수 없습니다.
          </p>
          <div className="mt-[20px] text-2xl font-light whitespace-pre-line">
            {`페이지가 존재하지 않거나, 사용할 수 없는 페이지입니다.
            입력하신 주소가 정확한지 다시 한 번 확인해주세요.`}
          </div>
          <div
            onClick={onBackClick}
            className="cursor-pointer text-white mt-[20px] mx-auto w-[221px] h-[53px] flex justify-center items-center bg-[#0a2996] text-[25px] font-semibold"
          >
            메인 페이지로
          </div>
        </div>
        <div className="flex-1 ">
          <img src={publicPath('/images/404.png')} alt="404" />
        </div>
      </div>
    </div>
  );
}

export default Page404;
