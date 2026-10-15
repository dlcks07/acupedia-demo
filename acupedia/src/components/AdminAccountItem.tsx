import { ChevronDownIcon } from '@heroicons/react/outline';
import dayjs from 'dayjs';
import { cls } from 'libs/utils';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';
import AdminAccountSubItem from './AdminAccountSubItem';
import axiosInstance from './AxiosInstance';

interface Props {
  index: number;
  curLocation: string;
  item: any;
}

function AdminAccountItem({ index, curLocation, item }: Props) {
  const location = useLocation();
  const queryClient = useQueryClient();
  const jwtToken = sessionStorage.getItem('jwtToken');
  const curIndex = +location?.search?.split('?')[1].split('=')[1];
  const [isItemClick, setIsItemClick] = useState(false);
  const [isTypeClick, setIsTypeClick] = useState(false);
  console.log(item);

  const onAccountClick = () => {
    setIsItemClick((prev) => !prev);
  };
  const onAccountTypeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (item.authority === 'ADMIN' || item.withdrawalUser == true) return;
    e.stopPropagation();
    setIsTypeClick((prev) => !prev);
  };
  const onTypeSelectClick = async (number: number) => {
    const response = await axiosInstance.post(
      `/admin/user/authority?authority=${
        number === 0 ? 'DOCTOR' : number === 1 ? 'STUDENT' : 'NONE'
      }&email=${item.email}&nickname=${item.nickname}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      }
    );
    if (response.status === 200) {
      queryClient.refetchQueries(['user', curIndex - 1, jwtToken]);
    }
    console.log(response);
  };
  return (
    <>
      <div onClick={onAccountClick} className="hover:bg-[#EDF6FE] cursor-pointer">
        <div className="w-full h-[49px] flex">
          <div className="font-medium text-[#3B7AB2] w-[62px] h-full flex justify-center items-center text-[17px]">
            {index + (curIndex - 1) * 20}
          </div>
          <div className="w-[283px] h-full flex justify-center items-center text-[17px]">
            <span className="font-light text-ellipsis overflow-hidden whitespace-nowrap ">
              {item.email}
            </span>
          </div>
          <div className="w-[192px] h-full flex justify-center items-center text-[17px]">
            <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap ">
              {item.nickname}
            </span>
          </div>
          <div
            onClick={(e) => onAccountTypeClick(e)}
            className={cls(
              isTypeClick ? 'bg-[#F4F5F6]' : '',
              'relative cursor-pointer w-[126px] h-full flex justify-center items-center text-[17px]'
            )}
          >
            <span
              className={cls(
                item.withdrawalUser == true ? '' : item.authority === 'NONE' ? 'text-[#60B71C]' : 'text-[#188AEF]'
              )}
            >
              {item.withdrawalUser == true 
                ? '탈퇴' 
                : item.authority === 'ADMIN'
                ? '관리자'
                : item.authority === 'DOCTOR'
                ? '한의사'
                : item.authority === 'STUDENT'
                ? '한의대생'
                : '일반회원'}
            </span>
            {item.withdrawalUser != true && (<ChevronDownIcon className="ml-2 h-6 text-[#767676]" />)}
            {isTypeClick ? (
              <div className="flex justify-evenly flex-col items-center z-10 top-0 mt-[49px] absolute w-[126px] h-[148px] border-2 border-[#DFDFDF] bg-[#F8F9FB] rounded">
                <p
                  onClick={() => onTypeSelectClick(0)}
                  className={cls(
                    item.authority === 'DOCTOR'
                      ? 'bg-[#1D80D6] text-white'
                      : 'bg-white text-[#188AEF]',
                    'hover:bg-opacity-50 w-[106px] h-[40px] rounded-lg flex justify-center items-center '
                  )}
                >
                  한의사
                </p>
                <p
                  onClick={() => onTypeSelectClick(1)}
                  className={cls(
                    item.authority === 'STUDENT'
                      ? 'bg-[#1D80D6] text-white'
                      : 'bg-white text-[#188AEF]',
                    'hover:bg-opacity-50 w-[106px] h-[40px] rounded-lg flex justify-center items-center'
                  )}
                >
                  한의대생
                </p>
                <p
                  onClick={() => onTypeSelectClick(2)}
                  className={cls(
                    item.authority === 'NONE'
                      ? 'bg-[#6FD233] text-white'
                      : 'bg-white text-[#60B71C]',
                    'hover:bg-opacity-50 w-[106px] h-[40px] rounded-lg flex justify-center items-center'
                  )}
                >
                  일반회원
                </p>
              </div>
            ) : null}
          </div>
          <div className="font-light w-[337px] h-full flex justify-center items-center text-[17px]">
            {dayjs(item.userCreatedAt).format('YYYY-MM-DD hh:mm')}
          </div>
          <div className="font-light w-[243px] h-full flex justify-center items-center text-[17px]">
            {item.userWikiInfoList.length === 0 ? '-' : item.userWikiInfoList.length}
          </div>
        </div>
      </div>
      <div>
        {isItemClick
          ? item.userWikiInfoList.map((item: any, index: number) => {
              return (
                <AdminAccountSubItem key={index} curLocation={curLocation} item={item} />
              );
            })
          : null}
      </div>
    </>
  );
}

export default AdminAccountItem;
