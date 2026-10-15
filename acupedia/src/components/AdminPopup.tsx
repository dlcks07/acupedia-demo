import { useLocation, useNavigate } from 'react-router-dom';
import AdminPopupItem from './AdminPopupItem';

interface Props {
  data: any;
}


function AdminPopup({ data }: Props) {
  const navigation = useNavigate();
  const location = useLocation();
  const curLocation = location.pathname + location.search;
  
  const onNewPopupClick = () => {
    navigation({
      pathname: '/acupediaAdmin/popupEdit',
      search: '?id=0',
    });
  };

  return (
  <div>
    <div className="flex flex-row-reverse pr-4 mb-[15px] mt-[15px]">
      <button
        onClick={onNewPopupClick}
        className="self-end bg-[#0A2996] hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded"
      >
        팝업 등록하기
      </button>
    </div>
    <div>
      <div className="w-full">
        <div className="w-full h-[49px] bg-[#0a2996] flex">
          <div className="w-[62px] h-full flex justify-center items-center text-[17px] text-white">
            No.
          </div>
          <div className="w-[581px] h-full flex justify-center items-center text-[17px] text-white">
            제목
          </div>
          <div className="w-[200px] h-full flex justify-center items-center text-[17px] text-white">
            노출시작일시
          </div>
          <div className="w-[200px] h-full flex justify-center items-center text-[17px] text-white">
            노출종료일시
          </div>
          <div className="w-[200px] h-full flex justify-center items-center text-[17px] text-white">
            생성일시
          </div>
        </div>
        {/* 목록 */}
        {data.data.popupInfoList.map((item: any, index: number) => {
          return (
            <AdminPopupItem
              key={index}
              index={index + 1}
              curLocation={curLocation}
              item={item}
            />
          );
        })}
      </div>
    </div>
  </div>
  );
}

export default AdminPopup;
