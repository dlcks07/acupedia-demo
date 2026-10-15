import { cls } from 'libs/utils';
import React from 'react';
import { isMobile } from 'react-device-detect';

function Fab() {
  const onFabClick = () => {
    window.scrollTo({
      top: 0,
      left: 0
    });
  };
  return (
    <div className="moveTopWrap">
      <div
        onClick={onFabClick}
        className="w-[38px] h-[38px] bg-[#0A2996] rounded-full flex items-center justify-center cursor-pointer"
      >
        <span className="text-[13px] text-white">Top</span>
      </div>
    </div>
  );
}

export default Fab;
