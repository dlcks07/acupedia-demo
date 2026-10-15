import { BellIcon } from '@heroicons/react/outline';
import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchPrescriptionLayerProps {
  isSearch: boolean;
  setIsSearch: (searchStatus: boolean) => void;  // 추가

  // 추가된 props (기본값 설정으로 기존 코드 호환성 유지)
  title?: string;
  placeholder?: string;
  searchPath?: string;
  searchParamKey?: string;
}

function SearchPrescriptionLayer({ 
  isSearch, 
  setIsSearch,
  title = '고전침구처방 검색하기',           // 기본값
  placeholder = '침구처방 검색하기...',      // 기본값
  searchPath = '/prescription',             // 기본값
  searchParamKey = 'search',                // 기본값
}: SearchPrescriptionLayerProps) {
  const navigation = useNavigate();
  const [searchActive, setSearchActive] = useState(isSearch); // 이름 변경
  const [text, setText] = useState('');
  
  // isSearch prop의 변화를 감지하여 searchActive 상태를 업데이트
  useEffect(() => {
    setSearchActive(isSearch);
  }, [isSearch]);

  const onSearchClick = () => {
    setSearchActive(true);
  };
  const onSearchMoveClick = () => {
    if (text.length > 0) {
      navigation({
        pathname: searchPath,                           // prop 사용
        search: `?${searchParamKey}=${text}&index=1`,  // prop 사용
      });
    }
  };
  const onCancelClick = () => {
    setSearchActive(false); // 이름 변경
    setIsSearch(false); // 이름 변경
    setText('');  // 검색어 초기화
  };


  return (
    <>
      {searchActive ? ( // 이름 변경        
          <div className="searchLayer__container">
            <div className="searchLayer__header">
              <div className="searchLayer__icon">
                <BellIcon className="h-7 text-[#058DD9]" />
              </div>
              <div className="searchLayer__cnts">
                <p className="searchLayer__title">
                {title}
                </p>
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={placeholder}
                  className="searchLayer__input"
                />
              </div>
            </div>

            {/* 버튼영역 */}
            <div className="searchLayer__footer">
              <div
                onClick={onSearchMoveClick}
                className="searchLayer__btn confirm"
              >
                검색하기
              </div>
              <div
                onClick={onCancelClick}
                className="searchLayer__btn cancle"
              >
                취소하기
              </div>
            </div>
          </div>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default SearchPrescriptionLayer;
