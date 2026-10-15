import { PaperAirplaneIcon } from '@heroicons/react/solid';
import { wikiApi } from 'libs/api';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import axiosInstance from './AxiosInstance';
import CommentsItem from './CommentsItem';

interface Props {
  title: string;
}

function Comments({ title }: Props) {
  const [text, setText] = useState('');
  const [count, setCount] = useState(0);
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem('jwtToken'));
  const {
    data: commentData,
    isLoading: commentLoading,
    refetch,
  } = useQuery(['wikiComment', title, jwtToken], wikiApi.wikiComment);
  console.log(commentData);

  const refreshJwtToken = () => {
    setJwtToken(sessionStorage.getItem('jwtToken'));
  };

  const onTextChange = (e: any) => {
    setCount(e.target.value.length);
    setText(e.target.value);
  };

  const onSubmitClick = async () => {
    if (text.trim().length === 0) return;

    const response = await axiosInstance.post(
      '/comment/add',
      {
        content: text,
        wikiTitle: title,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    console.log(response);

    if (response.status === 200) {
      refetch();
      setText('');
      setCount(0);
    }
  };

  useEffect(() => {
    window.addEventListener('storage', refreshJwtToken);

    return () => {
      window.removeEventListener('storage', refreshJwtToken);
    };
  }, []);

  return (
    <div className="flex flex-col">
      <p className="text-[25px] text-[#196db7] font-black mb-[22px]">
        Comments
      </p>

      {/* 코멘트 아이템들 */}
      {commentLoading ? null : (
        <div className="flex flex-col space-y-[38px]">
          {commentData.data.map((item: any, index: number) => {
            return <CommentsItem key={index} item={item} title={title} />;
          })}
        </div>
      )}

      {/* 입력 박스 */}
      {jwtToken ? (
        <div className="h-[185px] border-2 border-solid rounded-md border-[#84AED3] mt-[50px] border-opacity-50 mb-[5px]">
          <div className="h-[128px]">
            <textarea
              placeholder="댓글을 입력하세요."
              className="w-full h-full outline-none rounded-t-md pt-6 pl-6 resize-none"
              maxLength={200}
              onChange={onTextChange}
              value={text}
            />
          </div>

          <div className="flex items-center justify-between h-[55px] bg-[#F8F8F8] border-b-2 border-solid rounded-b-md border-b-[#84AED3] border-opacity-50">
            <span className="ml-6 text-[#196DB7]">{count}/200</span>
            <div
              onClick={onSubmitClick}
              className="cursor-pointer w-[43px] h-[45px] bg-[#196DB7] mr-[5px] rounded flex justify-center items-center"
            >
              <PaperAirplaneIcon className="h-8 text-white rotate-90" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Comments;
