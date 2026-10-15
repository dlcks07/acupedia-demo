import { ChevronDownIcon } from '@heroicons/react/outline';
import dayjs from 'dayjs';
import { cls } from 'libs/utils';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from './AxiosInstance';

interface Props {
  index: number;
  curLocation: string;
  item: any;
}

function AdminPopupItem({ index, curLocation, item }: Props) {
  const location = useLocation();
  const navigation = useNavigate();
  const queryClient = useQueryClient();
  const jwtToken = sessionStorage.getItem('jwtToken');
  const curIndex = +location?.search?.split('?')[1].split('=')[1];

  const onPopupClick = (id: string) => {
    navigation({
      pathname: '/acupediaAdmin/popupEdit',
      search: `?id=${id}`,
    });
  };
  return (
    <>
      <div onClick={() => onPopupClick(item.id)} className="hover:bg-[#EDF6FE] cursor-pointer">
        <div className="w-full h-[49px] flex">
          <div className="font-medium text-[#3B7AB2] w-[62px] h-full flex justify-center items-center text-[17px]">
            {index + (curIndex - 1) * 20}
          </div>
          <div className="w-[581px] h-full flex justify-center items-center text-[17px]">
            <span className="text-ellipsis overflow-hidden whitespace-nowrap ">
              {item.title}
            </span>
          </div>
          <div className="w-[200px] h-full flex justify-center items-center text-[17px]">
	    {item.displayStart
              ? item.displayStart === '0000-00-00 00:00:00'
	      ? '0000-00-00 00:00'
              : dayjs(item.displayStart).format('YYYY-MM-DD HH:mm')
              : '-'}
          </div>
          <div className="w-[200px] h-full flex justify-center items-center text-[17px]">
	    {item.displayEnd
              ? item.displayEnd === '0000-00-00 00:00:00'
	      ? '0000-00-00 00:00'
	      : dayjs(item.displayEnd).format('YYYY-MM-DD HH:mm')
              : '-'}
          </div>
          <div className="w-[200px] h-full flex justify-center items-center text-[17px]">
	    {item.createdAt
              ? item.createdAt === '0000-00-00 00:00:00'
	      ? '0000-00-00 00:00'
              : dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')
              : '-'}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPopupItem;
