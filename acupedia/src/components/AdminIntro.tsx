import TUI from '../components/TUI';
import { ClipLoader } from 'react-spinners';
import { useState } from 'react';
import axiosInstance from 'components/AxiosInstance';

interface Props {
  data: any;
  title: string;
  heading: string;
}


function AdminIntro({ data, title, heading }: Props) {
  const content = data?.data?.introInfo?.content?.replace(/\\n/g, '\n') || '';
  const [newString, setNewString] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const jwtToken = sessionStorage.getItem('jwtToken');

  const onSubmitClick = async () => {
      const time = new Date();
      setIsLoading(true);
      const response = await axiosInstance
        .post(
          `/introduction/submit`,
          {
            title: title,
            content: newString.length === 0 ? content : newString,
            createdAt: time.toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        )
        .finally(() => setIsLoading(false));
      console.log(response);
      if (response.status === 200) {
        alert('저장되었습니다. ');
      }
    };

  return (
  <div>
    <div className="mb-[26px] pl-3 h-[26px] border-l-2 border-[#0A2996] mt-[49px] text-[19px] font-semibold">
      {heading}
    </div>
    <div className="pl-[160px]">
      <div className="w-full">
        <div className="wikiEdit__link">
          <button
            onClick={() =>
              window.open(
                'https://gist.github.com/ihoneymon/652be052a0727ad59601'
              )
            }
            className="wikiEdit__link-btn"
          >
            아큐피디아 편집기 사용설명서
          </button>        
        </div>
        <div className="wickEditor-wrap">
          <TUI oldString={content} setNewString={setNewString} />
        </div>   
        <div className="wikiEdit__btm-btns">
          <button
            className="self-end w-[70px] bg-[#0A2996] hover:bg-blue-700 text-white py-1 ml-4 mb-10 rounded"
            onClick={onSubmitClick}
          >
            {isLoading ? <ClipLoader size={20} /> : 'submit'}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}

export default AdminIntro;
