import { PaperAirplaneIcon, XIcon } from '@heroicons/react/outline';
import dayjs from 'dayjs';
import { cls, isToday } from 'libs/utils';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import axiosInstance from './AxiosInstance';

interface Props {
  item: any;
  jwtToken?: string;
  title: string;
}

function ReplyItem({ item, jwtToken, title }: Props) {
  const queryClient = useQueryClient();
  const [isEdit, setIsEdit] = useState(false);
  const [editText, setEditText] = useState('');

  const onEditClick = () => {
    setIsEdit((prev) => !prev);
  };
  const onEditSubmitClick = async () => {
    if (editText.trim().length === 0) return;
    const response = await axiosInstance.post(
      '/comment/recomment/revise',
      {
        content: editText,
        commentId: item.id
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.status === 200) {
      await queryClient.refetchQueries(['wikiComment', title]);
      setIsEdit(false);
      setEditText('');
    }
  };
  const onDeleteClick = async () => {
    console.log(item);

    const response = await axiosInstance.post('/comment/recomment/delete', item.id, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 200) {
      await queryClient.refetchQueries(['wikiComment', title]);
    }
    console.log(response);
  };

  return (
    <div className="ml-6">
      <div className="flex justify-between items-center ">
        <div className="w-full">
          <div>
            <span className={cls(item.nickname ? 'font-black' : '', 'text-[15px] ')}>
              {item.nickname ? item.nickname : '-'}
            </span>
            <span className="ml-[33px] text-xs opacity-60">
              {isToday(item.createdAt)
                ? dayjs(item.createdAt).format('hh:mm A')
                : dayjs(item.createdAt).format('hh:mm A YYYY-MM-DD')}
            </span>
          </div>
          <div className="mt-[6px] text-[15px] flex">
            {isEdit ? (
              <>
                <input
                  className="outline-none border-[1px] w-full border-r-0 border-[#dadde6]"
                  maxLength={200}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div
                  onClick={onEditSubmitClick}
                  className="cursor-pointer w-[36px] h-[36px] bg-[#196db7] rounded flex justify-center items-center"
                >
                  <PaperAirplaneIcon className="h-7 text-white rotate-90" />
                </div>
              </>
            ) : (
              <span className="w-full">{item.content}</span>
            )}
          </div>

          {/* 버튼영역 */}
          {item.myComment && !item.deleted ? (
            <div onClick={onEditClick} className="mt-[11px] flex space-x-[13px]">
              <div
                className={cls(
                  ' cursor-pointer w-[57px] h-[27px] flex justify-center items-center border-solid border-[1px] text-sm border-[#196db7]',
                  isEdit ? 'text-white bg-[#196db7]' : 'text-[#196db7]'
                )}
              >
                {isEdit ? '취소' : '수정'}
              </div>
            </div>
          ) : null}
        </div>
        {/* x표시 */}
        {item.myComment && !item.deleted && !isEdit ? (
          <div>
            <XIcon onClick={onDeleteClick} className="h-6 cursor-pointer" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ReplyItem;
