import { BellIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchPrescription() {
  const navigation = useNavigate();
  const [isSearch, setIsSearch] = useState(false);
  const [text, setText] = useState('');

  const onSearchClick = () => {
    setIsSearch(true);
  };
  const onSearchMoveClick = () => {
    if (text.length > 0) {
      navigation({
        pathname: '/prescription',
        search: `?search=${text}&index=1`,
      });
    }
  };
  const onCancelClick = () => {
    setIsSearch(false);
  };

  return (
  <>
    {isSearch ? (
      <div className="sideSearch__container">
        <div className="sideSearch__searchBox">
          <div className="sideSearch__inputRow">
            <div className="sideSearch__iconCircle">
              <BellIcon className="h-7 text-[#058DD9]" />
            </div>
            <div className="sideSearch__textArea">
              <p className="sideSearch__title">고전침구처방 검색하기</p>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="침구처방 검색하기..."
                className="sideSearch__input"
              />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="sideSearch__buttonRow">
            <div
              onClick={onSearchMoveClick}
              className="sideSearch__buttonSearch"
            >
              검색하기
            </div>
            <div
              onClick={onCancelClick}
              className="sideSearch__buttonCancel"
            >
              취소하기
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="sideSearch__defaultBox">
        <div className="mt-6 sideSearch__iconCircle">
          <BellIcon className="h-7 text-[#058DD9]" />
        </div>
        <div className="sideSearch__defaultBottom">
          <p className="sideSearch__defaultTitle">고전침구처방 검색하기</p>
          <div
            onClick={onSearchClick}
            className="sideSearch__buttonSearch"
          >
            검색하기
          </div>
        </div>
      </div>
    )}
  </>
);
}

export default SearchPrescription;
