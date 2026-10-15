import { PaperAirplaneIcon } from '@heroicons/react/solid';
import LibraryCommentsItem from 'components/LibraryCommentsItem';
import { libraryApi } from 'libs/api';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import axiosInstance from './AxiosInstance';

interface Props {
  title: string;
}

function LibraryComments({ title }: Props) {
  const [text, setText] = useState('');
  const [count, setCount] = useState(0);
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem('jwtToken'));
  const {
    data: commentData,
    isLoading: commentLoading,
    refetch,
  } = useQuery(['libraryComment', title, jwtToken], libraryApi.libraryComment);
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
      '/libraryComment/add',
      {
        content: text,
        libraryHistoryTitle: title,
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
    <div className="wikicmt__wrapper">
      <p className="wikicmt__title">
        Comments
      </p>

      {/* 코멘트 아이템들 */}
      {commentLoading ? null : (
        <div className="wikicmt__comment-list">
          {commentData.data.map((item: any, index: number) => {
            return (
              <LibraryCommentsItem key={index} item={item} title={title} />
            );
          })}
        </div>
      )}

      {/* 입력 박스 */}
      {jwtToken ? (
        <div className="wikicmt__comment-box">
          <div className="wikicmt__textarea-wrapper">
            <textarea
              placeholder="댓글을 입력하세요."
              className="wikicmt__textarea"
              maxLength={200}
              onChange={onTextChange}
              value={text}
            />
          </div>

          <div className="wikicmt__comment-footer">
            <span className="wikicmt__charcount">{count}/200</span>
            <div className="wikicmt__submit-btn"  onClick={onSubmitClick} >
              <PaperAirplaneIcon className="wikicmt__submit-icon" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default LibraryComments;
