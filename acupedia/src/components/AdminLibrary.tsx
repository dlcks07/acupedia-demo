import { useNavigate } from 'react-router-dom';
import AdminAccountLibItem from 'components/AdminAccountLibItem';
import { useState } from 'react';
import { libraryAdminItems } from 'mocks/offlineData';

interface Props {
  data: any;
}

interface SearchResult {
  data: {
    libraryContentInfoList: any[];
    totalCount: number;
  };
}

function AdminLibrary({ data }: Props) {
  // const BASE_URL = 'https://api.acupedia.co.kr';
  const navigation = useNavigate();
  // const location = useLocation();
  // const curIndex = +location?.search?.split('?')[1].split('=')[1];
  // const jwtToken = sessionStorage.getItem('jwtToken');
  const [userInput, setUserInput] = useState('');
  const [searchData, setSearchData] = useState<SearchResult>();
  const [displayAllList, setDisplayAllList] = useState(false);
  console.log(data);

  // 입력값을 가져와서 소문자로변경
  const searchWord = (e: any) => {
    setUserInput(e.target.value);
  };

  const handleSearch = async (event: any) => {
    event.preventDefault();
    // const response = await fetch(
    //   `${BASE_URL}/admin/library/search?searchTerm=${userInput}&limit=20&page=${
    //     curIndex - 1
    //   }`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${jwtToken}`,
    //     },
    //     method: 'GET',
    //   }
    // );
    // if (response.ok) {
    //   const searchData = await response.json();
    //   setSearchData(searchData);
    //   setDisplayAllList(true);
    // }
    const searchData = {
      data: {
        libraryContentInfoList: libraryAdminItems.filter((item) =>
          item.title.includes(userInput)
        ),
        totalCount: libraryAdminItems.length,
      },
    };
    setSearchData(searchData);
    setDisplayAllList(true);
  };

  const onShowAllClick = () => {
    setDisplayAllList(false); // displayAllList를 false로 설정하여 전체 목록을 보여줌
  };

  const itemsToDisplay = displayAllList
    ? searchData?.data?.libraryContentInfoList
    : data.data.libraryContentInfoList;

  const onNewLibraryClick = () => {
    navigation({
      pathname: '/libraryEdit',
      search: '?title=newLibrary',
    });
  };

  const onNewWYISYGSClick = () => {
    navigation({
      pathname: '/libraryEditWyisygs',
      search: '?title=newLibrary',
    });
  };

  const onCategoryClick = () => {
    navigation({
      pathname: `/acupediaAdmin/category`,
      search: '?index=1',
    });
  };

  return (
    <div>
      <div className="w-full">
        <div className="mb-[26px] pl-3 h-[26px] border-l-2 border-[#0A2996] mt-[49px] text-[19px] font-semibold">
          학술 자료庫 관리
        </div>
        <div className="flex flex-row-reverse pr-4 mb-[15px]">
          <button
            onClick={onNewLibraryClick}
            className="self-end w-[140px] bg-[#0A2996] hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded"
          >
            새글쓰기
          </button>
          <button
            onClick={onCategoryClick}
            className="self-end w-[250px] bg-[#0A2996] hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded pr-6"
          >
            학술자료고 카테고리 편집
          </button>
          <button
            onClick={onNewWYISYGSClick}
            className="self-end w-[250px] bg-[#0A2996] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded pr-6"
          >
            새글쓰기(WYSIWYG)
          </button>
        </div>
        <div className="flex block ml-[12px] mr-[12px] mb-[12px] justify-content-center">
          <form onSubmit={handleSearch}>
            <input
              onChange={searchWord}
              type="text"
              maxLength={35}
              placeholder="학술 자료庫 게시판 검색창입니다. 검색어(제목)을 입력하세요"
              className="w-[980px] p-[6px] pl-[5px] h-[40px] border-r-0 text-gray-900 border border-gray-300 rounded-l-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            ></input>

            <button
              className="self-end w-[79px] h-[40px] focus:outline-none text-white !bg-yellow-400 !hover:bg-yellow-500 font-bold py-2 px-4 rounded-r-lg"
              type="submit"
            >
              검색
            </button>
          </form>
          <button
            onClick={onShowAllClick}
            className="self-end w-[140px] h-[40px] bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 ml-[16px] px-4 rounded"
          >
            전체목록 보기
          </button>
        </div>
        <div className="w-full h-[49px] bg-[#0a2996] flex">
          <div className="w-[150px] h-full flex justify-center items-center text-[17px] text-white">
            No.
          </div>
          <div className="w-[593px] h-full flex justify-center items-center text-[17px] text-white">
            제목
          </div>
          <div className="w-[300px] h-full flex justify-center items-center text-[17px] text-white">
            작성일자
          </div>
          <div className="w-[200px] h-full flex justify-center items-center text-[17px] text-white">
            수정
          </div>
        </div>
        {/* 목록 */}
        {itemsToDisplay.map((item: any, index: number) => {
          return (
            <AdminAccountLibItem
              key={index}
              index={index + 1}
              totalCount={data?.data.totalCount}
              item={item}
            />
          );
        })}
      </div>
    </div>
  );
}

export default AdminLibrary;
