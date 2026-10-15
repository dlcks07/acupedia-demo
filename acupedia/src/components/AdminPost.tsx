import { useLocation } from 'react-router-dom';
import AdminPostItem from './AdminPostItem';

interface Props {
  data: any;
}

function AdminPost({ data }: Props) {
  const location = useLocation();
  const curLocation = location.pathname + location.search;
  console.log(data);

  return (
    <div className="w-full">
      <div className="w-full h-[49px] bg-[#0a2996] flex">
        <div className="w-[62px] h-full flex justify-center items-center text-[17px] text-white">
          No.
        </div>
        <div className="w-[283px] h-full flex justify-center items-center text-[17px] text-white">
          항목
        </div>
        <div className="w-[192px] h-full flex justify-center items-center text-[17px] text-white">
          작성자
        </div>
        <div className="w-[196px] h-full flex justify-center items-center text-[17px] text-white">
          편집일자
        </div>
        <div className="w-[89px] h-full flex justify-center items-center text-[17px] text-white">
          상태
        </div>
        <div className="w-[207px] h-full flex justify-center items-center text-[17px] text-white">
          승인일자
        </div>
        <div className="w-[214px] h-full flex justify-center items-center text-[17px] text-white">
          비고
        </div>
      </div>
      {/* 목록 */}
      {data.data.postUserInfoList.map((item: any, index: number) => {
        return (
          <AdminPostItem
            key={index}
            index={index + 1}
            curLocation={curLocation}
            item={item}
          />
        );
      })}
    </div>
  );
}

export default AdminPost;
