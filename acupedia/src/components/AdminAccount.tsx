import { useLocation } from 'react-router-dom';
import AdminAccountItem from './AdminAccountItem';

interface Props {
  data: any;
}

function AdminAccount({ data }: Props) {
  const location = useLocation();
  const curLocation = location.pathname + location.search;
  console.log(data);
  return (
    <div>
      <div className="w-full">
        <div className="w-full h-[49px] bg-[#0a2996] flex">
          <div className="w-[62px] h-full flex justify-center items-center text-[17px] text-white">
            No.
          </div>
          <div className="w-[283px] h-full flex justify-center items-center text-[17px] text-white">
            E-Mail
          </div>
          <div className="w-[192px] h-full flex justify-center items-center text-[17px] text-white">
            닉네임
          </div>
          <div className="w-[126px] h-full flex justify-center items-center text-[17px] text-white">
            회원유형
          </div>
          <div className="w-[337px] h-full flex justify-center items-center text-[17px] text-white">
            가입일자
          </div>
          <div className="w-[243px] h-full flex justify-center items-center text-[17px] text-white">
            작성 글
          </div>
        </div>
        {/* 목록 */}
        {data.data.userInfoList.map((item: any, index: number) => {
          return (
            <AdminAccountItem
              key={index}
              index={index + 1}
              curLocation={curLocation}
              item={item}
            />
          );
        })}
      </div>
    </div>
  );
}

export default AdminAccount;
