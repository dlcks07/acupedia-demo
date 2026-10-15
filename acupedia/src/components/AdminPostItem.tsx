import { CheckIcon, ChevronDownIcon, XIcon } from '@heroicons/react/outline';
import { cls } from 'libs/utils';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import dayjs from 'dayjs';
import { useQueryClient } from 'react-query';
import axiosInstance from './AxiosInstance';

interface Props {
  index: number;
  curLocation: string;
  item: any;
}

function AdminPostItem({ index, curLocation, item }: Props) {
  const location = useLocation();
  const navigation = useNavigate();
  const queryClient = useQueryClient();
  const curIndex = +location?.search?.split('?')[1].split('=')[1];
  const [isStatusClick, setIsStatusClick] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState('');
  const jwtToken = sessionStorage.getItem('jwtToken');

  const onPostStatusClick = () => {
    if (item.status !== 'WAIT') return;
    setIsStatusClick((prev) => !prev);
  };
  const onStatusSelectClick = async (number: number) => {
    if (number === 0) {
      if (window.confirm('정말 승인하시겠습니까?')) {
        const response = await axiosInstance.post(
          `/history/accept?title=${item.title}&version=${item.version}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        if (response.status === 200) {
          queryClient.refetchQueries(['post', curIndex - 1, jwtToken]);
        }
      }
    } else {
      setIsModalOpen(true);
    }
  };
  const onModalBackClick = () => {
    setIsModalOpen(false);
    setText('');
  };

  const onModalSubmitClick = async () => {
    if (text.trim().length === 0) return;
    const response = await axiosInstance
      .post(
        `/history/reject?title=${item.title}&version=${item.version}&reason=${text}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
      .finally(() => setIsModalOpen(false));
    if (response.status === 200) {
      queryClient.refetchQueries(['post', curIndex - 1, jwtToken]);
    }
  };
  const onSubItemClick = (title: string) => {
    navigation({
      pathname: '/wikiCompare',
      search: `?title=${title}&version=${item.version}`,
    });
  };
  return (
    <div>
      <div className="w-full h-[49px] flex">
        <div className="w-[62px] h-full flex justify-center items-center text-[17px] text-[#3b7ab2] font-medium">
          {index + (curIndex - 1) * 20}
        </div>
        <div className="w-[283px] h-full flex justify-center items-center text-[19px]">
          <span
            onClick={() => onSubItemClick(item.title)}
            className="underline-offset-2 cursor-pointer text-[#188aef] underline text-ellipsis overflow-hidden whitespace-nowrap"
          >
            {item?.title?.replace(/ /g, '\u00a0')}
          </span>
        </div>
        <div className="w-[218px] h-full flex justify-center items-center text-[15px]">
          <span className="text-ellipsis overflow-hidden whitespace-nowrap ">
            {item.nickname}
          </span>
          <span>{'('}</span>
          <span
            className={cls(
              item.authority === 'NONE' ? 'text-[#5A972A]' : 'text-[#188AEF]',
              ''
            )}
          >
            {item.authority === 'ADMIN'
              ? '관리자'
              : item.authority === 'DOCTOR'
              ? '한의사'
              : item.authority === 'STUDENT'
              ? '한의대생'
              : '일반회원'}
          </span>
          <span>{')'}</span>
        </div>
        <div className="w-[170px] h-full flex justify-center items-center text-[15px] ">
          {dayjs(item.createdAt).format('YYYY-MM-DD hh:mm')}
        </div>
        <div
          onClick={onPostStatusClick}
          className={cls(
            item.status === 'ACCEPT' ? 'text-[#47CE18] font-semibold' : '',
            item.status === 'REJECT' ? 'text-[#EB3428] font-semibold' : '',
            item.status === 'WAIT' ? 'cursor-pointer hover:bg-[#f4f5f6]' : '',
            isStatusClick ? 'bg-[#f4f5f6]' : '',
            'relative w-[89px] h-full flex justify-center items-center text-[16px] font-medium '
          )}
        >
          <span>
            {item.status === 'ACCEPT'
              ? '승인'
              : item.status === 'REJECT'
              ? '거절 '
              : '대기 '}
            &nbsp;
          </span>
          <ChevronDownIcon
            className={cls(
              item.status !== 'WAIT' ? 'text-opacity-20' : '',
              'h-6 text-[#767676]'
            )}
          />
          {isStatusClick ? (
            <div className="flex justify-evenly flex-col items-center z-10 top-0 right-0 mt-[49px] absolute w-[54px] h-[89px] border-2 border-[#DFDFDF] bg-[#F8F9FB] rounded shadow-md">
              <div
                onClick={() => onStatusSelectClick(0)}
                className="hover:bg-opacity-50 w-[36px] h-[33px] bg-[#46ce16] rounded flex justify-center items-center"
              >
                <CheckIcon className="h-7 text-white" />
              </div>
              <div
                onClick={() => onStatusSelectClick(1)}
                className="hover:bg-opacity-50 w-[36px] h-[33px] bg-[#F15910] rounded flex justify-center items-center"
              >
                <XIcon className="h-7 text-white" />
              </div>
            </div>
          ) : null}
        </div>
        <div className="w-[207px] h-full flex justify-center items-center text-[15px]">
          {item.updatedAt
            ? dayjs(item.updatedAt).format('YYYY-MM-DD hh:mm')
            : '-'}
        </div>
        <div
          className={cls(
            item.reason ? 'text-[#FF0000]' : '',
            'w-[214px] h-full flex justify-center items-center text-[15px]'
          )}
        >
          {item.reason ? item.reason : '-'}
        </div>
      </div>
      <Modal
        ariaHideApp={false}
        style={{
          overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          },
          content: {
            width: '624px',
            height: '236px',
            display: 'flex',
            margin: 'auto',
            background: '#fff',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '4px',
            outline: 'none',
            flexDirection: 'column',
          },
        }}
        isOpen={isModalOpen}
      >
        <div className="">
          <p className="text-xl text-[#54595E] font-semibold">승인 거절 사유</p>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={10}
            placeholder="거절 사유를 입력하세요. (10자 이내)"
            className="indent-4 text-[#A4CCE3] placeholder-[#A4CCE3] mt-4 outline-none h-11 w-full border-[#D1D1D1] border-[1px] rounded-lg"
          />
          <div className="flex justify-end">
            <div
              onClick={onModalBackClick}
              className="cursor-pointer rounded-md mt-6 w-[180px] h-11 border-[1px] border-[#183BB7] text-[#183BB7] flex justify-center items-center text-sm"
            >
              돌아가기
            </div>
            <div
              onClick={onModalSubmitClick}
              className="ml-4 cursor-pointer rounded-md mt-6 w-[180px] h-11 bg-[#183BB7] text-white flex justify-center items-center text-sm"
            >
              확인
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AdminPostItem;
