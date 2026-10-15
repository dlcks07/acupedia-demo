import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useQuery, useQueryClient } from 'react-query';
import { popupAPi } from 'libs/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from 'components/AxiosInstance';

interface Popup {
  id: number;
  title: string;
  link: string;
  imageUrl: string;
  width: number;
  height: number;
  positionTop: number;
  positionSide: number;
  positionSideType: string;
  displayStart: string;
  displayEnd: string;
  displayCondition: string;
  displayOrder: number;
}

const formatDateTime = (dateTime: string): string => {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = '00';

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

function AdminPopupEdit() {

  const query = new URLSearchParams(useLocation().search);
  const id = query.get('id') || '0';
  const [popup, setPopup] = useState<Popup>({
    id: 0,
    title: '',
    link: '',
    imageUrl: '',
    width: 0,
    height: 0,
    positionTop: 0,
    positionSide: 0,
    positionSideType: '',
    displayStart: '',
    displayEnd: '',
    displayCondition: '',
    displayOrder: 0,
  });

  const ALLOW_FILE_EXTENSION = "jpg,jpeg,png";
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigation = useNavigate();
  const [file, setFile] = useState<File>();
  const curLocation = location.pathname + location.search;
  const [isLoading, setIsLoading] = useState(false);
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const jwtToken = sessionStorage.getItem('jwtToken');

  const {
    data: data,
    refetch: detailRefetch,
    isFetching: popupEditLoading,
  } = useQuery(['popupEdit', id, jwtToken],popupAPi.adminPopupEdit, {
    enabled: id !== '0',
    onSuccess: (data) => {
        if (data && data.data) {
          const fetchedData = data.data;
	  setCreatedAt(fetchedData.createdAt || '');
	  setUpdatedAt(fetchedData.updatedAt || '');
          setPopup({
            id: fetchedData.id || 0,
            title: fetchedData.title || '',
            link: fetchedData.link || '',
            imageUrl: fetchedData.imageUrl || '',
            width: fetchedData.width || 0,
            height: fetchedData.height || 0,
            positionTop: fetchedData.positionTop || 0,
            positionSide: fetchedData.positionSide || 0,
            positionSideType: fetchedData.positionSideType || '',
            displayStart: fetchedData.displayStart || '',
            displayEnd: fetchedData.displayEnd || '',
            displayCondition: fetchedData.displayCondition || '',
            displayOrder: fetchedData.displayOrder || 0,
          });
        }
    },
  });
  
  useEffect(() => {
    if (id !== '0' && data && data.data.message=="존재하지 않는 팝업입니다") {
      toast('존재하지 않는 팝업입니다.');
      navigation({
        pathname: `/acupediaAdmin/popup`,
        search: '?index=1',
      })
    }
  }, [data]);

  const fileExtensionValid = ({name} : {name : string}):boolean =>{

    const extension = removeFileName(name);

    if(!(ALLOW_FILE_EXTENSION.indexOf(extension) > -1) || extension === '') {
      return false;
    }
    return true;
  }

  const removeFileName = (originalFileName:string):string => {

    const lastIndex = originalFileName.lastIndexOf(".");
    if(lastIndex < 0) {
      return "";
    }
    return originalFileName.substring(lastIndex+1).toLowerCase();
  }

  const fileUploadValidHandler = (e:React.ChangeEvent<HTMLInputElement>) => {

    const target = e.currentTarget;
    const files = (target.files as FileList)[0];

    if(files !== undefined){

      if(!fileExtensionValid(files)){
        target.value = '';
        toast(`업로드 가능한 확장자가 아닙니다. [가능한 확장자 : ${ALLOW_FILE_EXTENSION}]`);
        return;
      }
      setFile(files);
    }

  }

  const validateForm = (): boolean => {
    if (popup.title.trim() === '' || 
        (id === '0' && !file) || 
        popup.displayOrder === 0 ||
        popup.width === 0 ||
        popup.height === 0 ||
        popup.positionTop === 0 ||
        popup.positionSide === 0 ||
        popup.positionSideType.trim() === '' ||
        popup.displayCondition.trim() === '' ||
        popup.displayStart.trim() === '' ||
        popup.displayEnd.trim() === '') {
      toast('모든 필수 필드를 입력해주세요.');
      return false;
    }
    return true;
  };

  const onSaveClick = async () => {

    if (!validateForm()) {
      return;
    }
  
    const updatedPopup = {
      ...popup,
      displayStart: formatDateTime(popup.displayStart),
      displayEnd: formatDateTime(popup.displayEnd),
    };
    
    const formData = new FormData();
    formData.append('popup', new Blob([JSON.stringify(updatedPopup)], { type: 'application/json' }));
    if (file) {
      formData.append('popupImage', file);
    }

    const url = id === '0' ? `/popup/insertPopup` : `popup/updatePopup`;
    const comment = id === '0' ? `팝업창이 등록되었습니다.` : `팝업창이 수정되었습니다.`;

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        url,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 200) {
        toast(comment);
      }
  
      if(id === '0'){
        navigation({
          pathname: `/acupediaAdmin/popup`,
          search: '?index=1',
        })
      }else{
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving popup:', error);
      toast('팝업 저장 중 오류가 발생했습니다.');

    } finally {
      setIsLoading(false);
    }
    
  };

  const onDeleteClick = async () => {
    
    if(window.confirm('삭제하시겠습니까?')) {

      if(popup.id !== 0){
        try {
          const response = await axiosInstance.post(
            `/popup/deletePopup?id=${popup.id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );
          if (response.status === 200) {
            toast('팝업창이 삭제되었습니다.');
            navigation({
              pathname: `/acupediaAdmin/popup`,
              search: '?index=1',
            })
          }else{
            window.location.reload();
	  }
        } catch (error) {
          console.error('Error deleting popup:', error);
          toast('팝업 삭제 중 오류가 발생했습니다.');
        }
      }
    }
  };

  const onBackClick = () =>
    navigation({
      pathname: `/acupediaAdmin/popup`,
      search: '?index=1',
    });
    
  const handlePositionSideTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPopup((prevPopup) => ({
      ...prevPopup,
      positionSideType: value,
    }));
  };
    
  const handleDisplayConditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPopup((prevPopup) => ({
      ...prevPopup,
      displayCondition: value,
    }));
  };

  const handleInputChange = (field: keyof Popup) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseInt(e.target.value);
    setPopup({ ...popup, [field]: value });
  };

  return popupEditLoading ? null : (
  <>
    <div className="pl-[160px]">
      <div className="w-full ">
        <div className="mb-[26px] pl-3 h-[26px] border-l-2 border-[#0A2996] mt-[49px] text-[22px] font-semibold">
          {popup.id === 0 ? "팝업창 등록" : "팝업창 수정" }
        </div>
        <div className="flex flex-row-reverse pr-4 mb-[15px]">
          <button
            onClick={onBackClick}
            className="self-end w-[300px] bg-[#0A2996] hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded"
          >
            목록으로 돌아가기
          </button>
        </div>
        <div className="w-full flex">
          <div className="pt-[40px] pl-[20px]">
		<table className="p_tb">
		  <tr>
		    <th>
			팝업창 제목
		    </th>
		    <td>
			<input
			value={popup.title}
			onChange={(e) => setPopup({ ...popup, title: e.target.value })}
			className="w-[303px] border-2 px-2 ml-7 m-2"
			placeholder="팝업창 제목을 입력해주세요"
		      />
		    </td>
		  </tr>
		  <tr>
		    <th>
			팝업창 링크
		    </th>
		    <td>
			<input
			value={popup.link}
			onChange={(e) => setPopup({ ...popup, link: e.target.value })}
			className="w-[600px] border-2 px-2 ml-7 m-2"
			placeholder="팝업창 링크를 입력해주세요"
		      />
		    </td>
		  </tr>
		  <tr>
		    <th>
			팝업창 이미지
		    </th>
		    <td>
		      <input type="file" onChange={fileUploadValidHandler} />
		      {popup.imageUrl && (
			<a href={popup.imageUrl} target="_blank" rel="noopener noreferrer" className="self-end w-[140px] h-[40px] bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 ml-[16px] px-4 rounded">
			  이미지 보기
			</a>
		      )}
		    </td>
		  </tr>
		  <tr>
		    <th>
			출력 순서
		    </th>
		    <td>
			<input
			value={popup.displayOrder.toString()}
			onChange={handleInputChange('displayOrder')}
			className="w-[303px] border-2 px-2 m-2"
			placeholder="출력 순서를 입력해주세요"
		      />
		    </td>
		  </tr>
		  <tr>
		    <th>
			가로 길이(px)
		    </th>
		    <td>
			<input
			value={popup.width.toString()}
			onChange={handleInputChange('width')}
			className="w-[303px] border-2 px-2 m-2"
			placeholder="가로 길이를 입력해주세요"
		      />
		    </td>
		  </tr>
		  <tr>
		    <th>
			세로 길이(px)
		    </th>
		    <td>
			<input
			value={popup.height.toString()}
			onChange={handleInputChange('height')}
			className="w-[303px] border-2 px-2 m-2"
			placeholder="세로 길이를 입력해주세요"
		      />	
		    </td>
		  </tr>
		  <tr>
		    <th>
			화면 상단에서의 위치(px)
		    </th>
		    <td>
			<input
			value={popup.positionTop.toString()}
			onChange={handleInputChange('positionTop')}
			className="w-[303px] border-2 px-2 m-2"
			placeholder="화면 상단에서의 위치를 입력해주세요"
		      />
		    </td>
		  </tr>
		  <tr>
		    <th>
			좌/우측 기준 위치(px)
		    </th>
		    <td>
			<input
			value={popup.positionSide.toString()}
			onChange={handleInputChange('positionSide')}
			className="w-[303px] border-2 px-2 m-2"
			placeholder="좌/우측 기준 위치를 입력해주세요"
		      />
		    </td>
		  </tr>
		  <tr>
		    <th>
			좌/우측 기준
		    </th>
		    <td>
			<input
			    type="checkbox"
			    checked={popup.positionSideType === 'L'}
			    value="L"
			    onChange={handlePositionSideTypeChange}
			  />
			<label className="mr-4">
			  좌측
			</label>
			<label>
			  <input
			    type="checkbox"
			    checked={popup.positionSideType === 'R'}
			    value="R"
			    onChange={handlePositionSideTypeChange}
			  />
			  우측
			</label>
		    </td>
		  </tr>
		  <tr>
		    <th>
			출력 조건
		    </th>
		    <td>
			<label className="mr-4">
			  <input
			    type="checkbox"
			    checked={popup.displayCondition === 'A'}
			    value="A"
			    onChange={handleDisplayConditionChange}
			  />
			  로그인 전
			</label>
			<label>
			  <input
			    type="checkbox"
			    checked={popup.displayCondition === 'B'}
			    value="B"
			    onChange={handleDisplayConditionChange}
			  />
			  로그인 전/후
			</label>
		    </td>
		  </tr>
		  <tr>
		    <th>
			출력 시작 일시
		    </th>
		    <td>
			<input
			type="datetime-local"
			value={popup.displayStart}
			onChange={(e) => setPopup({ ...popup, displayStart: e.target.value })}
			className="w-[303px] border-2 px-2 m-2"
			placeholder="출력 시작 일시를 입력해주세요"
		      />	
		    </td>
		  </tr>
		  <tr>
		    <th>
			출력 종료 일시
		    </th>
		    <td>
			<input
			type="datetime-local"
			value={popup.displayEnd}
			onChange={(e) => setPopup({ ...popup, displayEnd: e.target.value })}
			className="w-[303px] border-2 px-2 m-2"
			placeholder="출력 종료 일시를 입력해주세요"
		      />	
		    </td>
		  </tr>
		  <tr>
		    <th>
			등록 일시<br />
			수정 일시
		    </th>	
		    <td>
			{popup.id === 0 ? null : (
			<>
		      {createdAt
		      ? createdAt === '0000-00-00 00:00:00'
		      ? '0000-00-00 00:00'
		      : dayjs(createdAt).format('YYYY-MM-DD HH:mm')
		      : '-'}
		      <br />
		      {updatedAt
		      ? updatedAt === '0000-00-00 00:00:00'
		      ? '0000-00-00 00:00'
		      : dayjs(updatedAt).format('YYYY-MM-DD HH:mm')
		      : '-'}
			</>
		      )}
		    </td>
		  </tr>
		</table>
            <div className="btn_wrap">
              {popup.id === 0 ? (
                <button
                  className="self-end w-[70px] bg-[#0A2996] hover:bg-blue-700 text-white py-1 ml-4 mb-10 rounded"
                  onClick={onSaveClick}
                >
                  등록
                </button>
              ) : (
                <>
                  <button
                    className="self-end w-[70px] bg-[#0A2996] hover:bg-blue-700 text-white py-1 ml-4 mb-10 rounded"
                    onClick={onSaveClick}
                  >
                    수정
                  </button>
                  <button
                    className="mt-1 self-end w-[70px] bg-[#CC0000] hover:bg-blue-700 text-white py-1 ml-4 mb-10 rounded"
                    onClick={onDeleteClick}
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPopupEdit;
