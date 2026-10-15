import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LibraryRule } from 'components';
import { useQuery } from 'react-query';
import { libraryApi, categoryAPi } from 'libs/api';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-toastify';
import axiosInstance from 'components/AxiosInstance';
import { ClipLoader } from 'react-spinners';
import dayjs from 'dayjs';
import { useAppDispatch } from 'store';
import settingSlice from 'slices/setting';
import TinyMCEEditor from 'components/TinyMCEEditor';
import { Helmet } from 'react-helmet-async';

interface Category {
  id: string;
  name: string;
  children: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  children: never[]; // an empty array since subcategories do not have any children
}

function LibraryEditWyisygs() {
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const location = useLocation();
  const [newString, setNewString] = useState('');
  const title = decodeURI(
    location?.search?.split('?')[1].split('&')[0].split('=')[1]
  );
  const curSearch =
    location.search.split('?')[location.search.split('?').length - 1];
  const curLocation = location.pathname + location.search;
  const [curTitle, setCurTitle] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number | ''>('');
  const authority = sessionStorage.getItem('authority');
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem('jwtToken'));
  const [isLoading, setIsLoading] = useState(false);
  const [selectedParent, setSelectedParent] = useState('');
  const [selectedChild, setSelectedChild] = useState('');
  const locationState = location.state as String;
  const { data, isLoading: libraryLoading } = useQuery(
    ['libraryDetail', title],
    libraryApi.libraryDocument,
    {
      enabled: title !== 'newLibrary',
      onSuccess: (data) => (
        setCurTitle(data?.data?.title), setUpdateTitle(data?.data?.title)
      ),
    }
  );

  const { data: categoryData, isLoading: categoryLoading } = useQuery(
    'category',
    categoryAPi.categoryList
  );

  const content = data?.data?.content?.replace(/\\n/g, '\n') || '';
  // console.log(location.state);

  const handleParentChange = (event: any) => {
    setSelectedParent(event.target.value);
  };

  const handleChildChange = (event: any) => {
    setSelectedChild(event.target.value);
  };

  const onReadClick = () => {
    navigation({
      pathname: '/libraryDetail',
      search: `?title=${title}`,
    });
  };

  const parentOptions = categoryData?.data?.map((item: Category) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ));

  const childOptions = selectedParent
    ? categoryData.data
        .find((item: Category) => item.id === selectedParent)
        ?.children.map((item: Subcategory) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))
    : [];

  const resolvedCategoryId = selectedChild
    ? Number(selectedChild)
    : selectedParent
    ? Number(selectedParent)
    : null;

  const validateRequired = () => {
    if (!resolvedCategoryId) {
      if (isMobile) alert("대분류 또는 중분류를 선택해주세요.");
      else toast("대분류 또는 중분류를 선택해주세요.");
      return false;
    }

    if (!subTitle.trim()) {
      if (isMobile) alert("소제목을 입력해주세요.");
      else toast("소제목을 입력해주세요.");
      return false;
    }

    if (!displayOrder || isNaN(Number(displayOrder)) || Number(displayOrder) <= 0) {
      if (isMobile) alert("출력 순서를 올바르게 입력해주세요.");
      else toast("출력 순서를 올바르게 입력해주세요.");
      return false;
    }

    return true;
  };

  const onSubmitClick = async () => {
    if (curTitle === 'newLibrary') return toast("해당 제목으로 만들 수 없습니다.");

    if (!validateRequired()) return;

    if (!curTitle.trim() || (newString.length === 0 && content.length === 0)) {
      return toast('제목 또는 내용을 입력해주세요.');
    }

    const time = new Date();
    const trimedTitle = curTitle.trim();

    setIsLoading(true);

    const response = await axiosInstance.post(
      `/libdocument/submit`,
      {
        content: newString || content,
        createdAt: time.toISOString(),
        title: trimedTitle,
        previousTitle: trimedTitle !== title ? title : null,
        categoryId: resolvedCategoryId,
        subTitle: subTitle || null,
        displayOrder: Number(displayOrder),
      },
      { headers: { Authorization: `Bearer ${jwtToken}` } }
    );

    if (response.status === 200) {
      toast('작성된 글이 정상적으로 등록되었습니다.');
      navigation(`/libraryDetail?title=${trimedTitle}`);
    }

    setIsLoading(false);
  };

  const onUpdateClick = async () => {
    if (updateTitle === 'newLibrary') return toast("해당 제목으로 만들 수 없습니다.");

    if (!validateRequired()) return;

    if (!updateTitle.trim() || (newString.length === 0 && content.length === 0)) {
      return toast('제목 또는 내용을 입력해주세요.');
    }

    const time = new Date();
    const trimedTitle = updateTitle.trim();
    setIsLoading(true);

    const response = await axiosInstance.post(
      `/libdocument/update`,
      {
        content: newString || content,
        updatedAt: time.toISOString(),
        title: trimedTitle,
        previousTitle: curTitle,
        categoryId: resolvedCategoryId,
        subTitle: subTitle || null,
        displayOrder: Number(displayOrder),
      },
      { headers: { Authorization: `Bearer ${jwtToken}` } }
    );

    if (response.status === 200) {
      toast('작성된 글이 정상적으로 수정되었습니다.');
      navigation(`/libraryDetail?title=${trimedTitle}`);
      window.location.reload();
    }

    setIsLoading(false);
  };

  const onCancelClick = () => {
    window.confirm(
      '정말 글 작성을 취소하시겠습니까? 지금까지 작성한 내용은 저장되지 않습니다. 글 작성을 취소하시려면 확인 버튼을 눌러주십시오.'
    ) && navigation(-1);
  };

  const checkEnter = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const refreshJwtToken = () => {
    setJwtToken(sessionStorage.getItem('jwtToken'));
  };

  useEffect(() => {
    if (title === 'newLibrary') {
      setCurTitle(String(locationState));
    }
    window.addEventListener('storage', refreshJwtToken);

    return () => {
      window.removeEventListener('storage', refreshJwtToken);
    };
  }, []);

  useEffect(() => {
    if (!jwtToken) {
      dispatch(
        settingSlice.actions.setLastPageBeforeLogin({
          lastPageBeforeLogin: curLocation,
        })
      );
      navigation('/login');
    }
  }, [jwtToken]);

  // useEffect(() => {
  //   if (data?.status === 'BAD_REQUEST') {
  //     navigation('/404');
  //   }
  // }, [data]);

  if (data?.status === 'BAD_REQUEST') {
    return null;
  }

  return libraryLoading ? null : (
    <div className="w-[1306px] min-h-[1500px] flex flex-col">
      <Helmet>
        <title>{`${title === 'newLibrary' ? (curTitle || '새 학술자료 작성') : title} - 아큐피디아 학술 자료庫 편집`}</title>
        <meta name="description" content="아큐피디아 학술 자료庫 문서 편집 페이지입니다." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`https://www.acupedia.net/libraryEditWyisygs?title=${encodeURIComponent(title)}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="아큐피디아" />
        <meta property="og:title" content={`${title === 'newLibrary' ? (curTitle || '새 학술자료 작성') : title} - 아큐피디아 학술 자료庫 편집`} />
        <meta property="og:description" content="아큐피디아 학술 자료庫 문서 편집 페이지입니다." />
        <meta property="og:url" content={`https://www.acupedia.net/libraryEditWyisygs?title=${encodeURIComponent(title)}`} />
        <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
      </Helmet>
      {curSearch !== 'admin' ? (
        <span className="text-[30px] mb-3">학술 자료庫 편집</span>
      ) : null}
      <div className="w-full flex justify-between ">
        <div className="flex flex-row">
          <div className="tracking-tighter pl-[20px] border-l-[6px] border-[#0F43F9] w-[830px] text-[35px] text-[#182F43] font-semibold">
            {title === 'newLibrary' ? (
              <textarea
                maxLength={100}
                className="w-full resize-vertical h-[55px] pr-16 tracking-tighter font-semibold"
                placeholder="제목을 입력하세요."
                onChange={(e) => setCurTitle(e.target.value)}
                onKeyPress={checkEnter}
                autoFocus
              />
            ) : (
              <>
                {
                  <textarea
                    maxLength={100}
                    className="w-full resize-none tracking-tighter font-semibold"
                    placeholder="제목을 입력하세요."
                    value={updateTitle}
                    onChange={(e) => setUpdateTitle(e.target.value)}
                    onKeyPress={checkEnter}
                    autoFocus
                  />
                }
              </>
            )}
          </div>
        </div>
        <div className="w-[424px]">
          {title !== 'newLibrary' ? (
            <div className="flex justify-between h-[44px] ">
              <span
                onClick={onReadClick}
                className="rounded-l-lg text-[#84AED3] cursor-pointer flex-1 flex justify-center items-center border-[#84AED3] border-solid border-2"
              >
                읽기
              </span>
              <span className="bg-[#3F69FA] text-white flex-1 flex justify-center items-center border-[#84AED3] border-solid border-2">
                편집
              </span>
            </div>
          ) : null}
          {title !== 'newLibrary' ? (
            <div className="flex flex-col ml-2 mt-2">
              <p className="flex">
                <span className="font-semibold w-[100px] mr-8">
                  최종 편집자
                </span>
                <span className="mr-5">{data?.data?.nickname}</span>
              </p>
              <p>
                <span className="font-semibold w-[100px] mr-8">
                  최종 편집일시
                </span>
                <span>
                  {data?.data?.lastModifiedAt
                    ? dayjs(data?.data?.lastModifiedAt).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )
                    : ''}
                </span>
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="w-full mt-[80px]">
        <TinyMCEEditor oldString={content} setNewString={setNewString} />
      </div>
      <div className="w-full flex items-center justify-left mt-[10px]">
        <h3>· 분류선택</h3>
        <span className="border-r-[2px] border-[#0F43F9]" />
        <select
          className="ml-[30px] w-[200px]"
          onChange={handleParentChange}
          value={selectedParent}
        >
          <option value="">대분류 선택</option>
          {parentOptions}
        </select>
        <span className="border-r-[2px] border-[#0F43F9]" />
        <select
          className="ml-[30px] w-[200px]"
          onChange={handleChildChange}
          value={selectedChild}
        >
          <option value="">중분류 선택</option>
          {childOptions}
        </select>
        <span className="ml-[60px] mr-[10px]">
          · 학술 자료庫 목록에 출력될 소제목을 입력해주세요 :
        </span>
        <textarea
          maxLength={30}
          className="w-[250px] resize-none tracking-tighter border-[1px] h-[30px] pl-[5px] pt-[2px]"
          placeholder="소제목을 입력하세요."
          onChange={(e) => setSubTitle(e.target.value)}
          onKeyPress={checkEnter}
        />
      </div>
      <div className="flex items-center mt-[10px]">
        <span>· 출력 순서</span>
        <input
          type="number"
          min={1}
          className="ml-[20px] w-[100px] border-[1px] h-[30px] pl-[8px] tracking-tighter"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(e.target.value === '' ? '' : Number(e.target.value))}
        />
      </div>
      <div className="w-full flex items-center justify-end mt-[58px]">
        {title !== 'newLibrary' ? (
          <span
            onClick={onUpdateClick}
            className="cursor-pointer w-[127px] h-[54px] rounded-lg bg-[#3F69FA] text-[18px] text-white flex justify-center items-center"
          >
            {isLoading ? <ClipLoader size={20} color="white" /> : '수정'}
          </span>
        ) : (
          <span
            onClick={onSubmitClick}
            className="cursor-pointer w-[127px] h-[54px] rounded-lg bg-[#3F69FA] text-[18px] text-white flex justify-center items-center"
          >
            {isLoading ? <ClipLoader size={20} color="white" /> : '완료'}
          </span>
        )}
        <span
          onClick={onCancelClick}
          className="cursor-pointer text-[18px] text-[#FF0000] ml-[45px] border-b-2 border-[#FF0000]"
        >
          취소
        </span>
      </div>
      <div className="mt-[118px] mb-[78px] w-full">
        <LibraryRule />
      </div>
    </div>
  );
}

export default LibraryEditWyisygs;
