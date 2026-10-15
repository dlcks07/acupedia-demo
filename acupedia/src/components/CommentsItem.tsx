import { PaperAirplaneIcon, XIcon } from '@heroicons/react/outline';
import dayjs from 'dayjs';
import { cls, isToday } from 'libs/utils';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import axiosInstance from './AxiosInstance';
import ReplyItem from './ReplyItem';

interface Props {
  item: any;
  title: string;
}

function CommentsItem({ item, title }: Props) {
  const queryClient = useQueryClient();
  const authority = sessionStorage.getItem('authority');
  const [isReply, setIsReply] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [jwtToken, setJwtToken] = useState(
    sessionStorage.getItem('jwtToken') || ''
  );
  const [editText, setEditText] = useState('');
  const [replyText, setReplyText] = useState('');

  const onEditClick = () => {
    setIsEdit((prev) => !prev);
  };
  const onEditSubmitClick = async () => {
    if (editText.trim().length === 0) return;
    const response = await axiosInstance.post(
      '/comment/revise',
      {
        content: editText,
        commentId: item.id,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 200) {
      await queryClient.refetchQueries(['wikiComment', title]);
      setIsEdit(false);
    }
  };
  const onReplyClick = () => {
    setIsReply((prev) => !prev);
  };
  const onReplySubmitClick = async () => {
    if (replyText.trim().length === 0) return;
    const response = await axiosInstance.post(
      '/comment/recomment/add',
      {
        content: replyText,
        commentId: item.id,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 200) {
      await queryClient.refetchQueries(['wikiComment', title]);
      setIsReply(false);
      setReplyText('');
    }
  };
  const refreshJwtToken = () => {
    setJwtToken(sessionStorage.getItem('jwtToken') || '');
  };
  const onDeleteClick = async () => {
    console.log(item);

    const response = await axiosInstance.post('/comment/delete', item.id, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      await queryClient.refetchQueries(['wikiComment', title]);
    }
    console.log(response);
  };

  useEffect(() => {
    window.addEventListener('storage', refreshJwtToken);

    return () => {
      window.removeEventListener('storage', refreshJwtToken);
    };
  }, []);

  return (
    <div className="min-h-[78px]">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <div>
            <span
              className={cls(item.nickname ? 'font-black' : '', 'text-[15px] ')}
            >
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
                  className="cursor-pointer w-[36px] h-full bg-[#196db7] rounded flex justify-center items-center"
                >
                  <PaperAirplaneIcon className="h-7 text-white rotate-90" />
                </div>
              </>
            ) : (
              <span className="w-full">{item.content}</span>
            )}
          </div>

          {/* 버튼영역 */}
          <div className="mt-[11px] flex space-x-[13px]">
            {jwtToken && !item.deleted ? (
              <div
                onClick={onReplyClick}
                className={cls(
                  'cursor-pointer w-[57px] h-[27px] flex justify-center items-center border-solid border-[1px] text-sm border-[#196db7]',
                  isReply ? 'text-white bg-[#196db7]' : 'text-[#196db7]'
                )}
              >
                답글
              </div>
            ) : null}
            {item.myComment && !item.deleted ? (
              <div
                onClick={onEditClick}
                className={cls(
                  'cursor-pointer w-[57px] h-[27px] flex justify-center items-center border-solid border-[1px] text-sm border-[#196db7]',
                  isEdit ? 'text-white bg-[#196db7]' : 'text-[#196db7]'
                )}
              >
                {isEdit ? '취소' : '수정'}
              </div>
            ) : null}
          </div>
        </div>

        {/* x표시 */}
        {(item.myComment && !item.deleted && !isEdit) ||
        authority === 'ADMIN' ? (
          <div>
            <XIcon onClick={onDeleteClick} className="h-6 cursor-pointer" />
          </div>
        ) : null}
      </div>

      {/* 대댓글 */}
      <div className="space-y-[30px] mt-5 border-l-4 border-[#e6e6e6] border-solid flex flex-col">
        {item.reComments.map((item: any, index: number) => {
          return (
            <ReplyItem
              key={index}
              item={item}
              jwtToken={jwtToken}
              title={title}
            />
          );
        })}
      </div>

      {/* 대댓글 입력 창 */}
      {isReply ? (
        <div className="mt-2 flex relative h-10 items-center">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            autoFocus
            maxLength={200}
            placeholder="대댓글을 입력하세요."
            className="pr-12 h-full indent-4 w-full outline-none border-[#196db7] border-[1px] border-solid rounded-md"
          />
          <div
            onClick={onReplySubmitClick}
            className="absolute right-0 cursor-pointer w-[43px] h-full bg-[#196db7] rounded flex justify-center items-center"
          >
            <PaperAirplaneIcon className="h-8 text-white rotate-90" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default CommentsItem;
