import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { cls } from 'libs/utils';
import { useLocation } from 'react-router-dom';

interface Props {
  onLeftClick: () => void;
  onNumClick: (num: number) => void;
  onRightClick: () => void;
  offset: number;
  MAX_NUM: number;
  curPass: number;
  limit: number;
}

function PaginationBox({
  onLeftClick,
  onNumClick,
  onRightClick,
  offset,
  MAX_NUM,
  curPass,
  limit,
}: Props) {
  const location = useLocation();
  const newCurPass = Math.floor((offset - 1) / limit);
  
  return (
    <div className="pagenation">
      <ChevronLeftIcon onClick={onLeftClick} className="pagenation__btn prevPage" />
      
      <div className="pagenation__numbers">
        {[...Array(limit)].map((item, index) => {
          const num = index + 1 + newCurPass * limit;
          if (num <= MAX_NUM) { // 페이지 숫자가 MAX_NUM을 넘지 않도록 체크
            return (
              <span
                onClick={() => onNumClick(num)}
                key={index}
                className={cls(
                  'pagenation__numbertext',
                  num === offset ? 'text-[#1D80D6]' : 'text-[#b4a8a8]'
                )}
              >
                {String(num)}
              </span>
            );
          } else {
            return null; // 페이지 숫자가 MAX_NUM을 넘어갈 경우 빈 요소 반환
          }
        })}
      </div>
      <ChevronRightIcon onClick={onRightClick} className="pagenation__btn nextPage" />
      {/* <ChevronDoubleRightIcon onClick={onLeftClick} className="h-6 cursor-pointer" /> */}
    </div>
  );
}

export default PaginationBox;
