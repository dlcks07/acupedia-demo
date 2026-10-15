import React from 'react';

function WikiRule() {
  return (
    <div className="ruleBox">
      <div className="w-full flex justify-end">
        <img
          alt="크리에이티브 커먼즈 라이선스"
          // style="border-width:0"
          src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"
        />
      </div>
      <div className="ruleText">
        이 저작물은&nbsp;
        <a
          rel="license"
          href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
          className="text-blue01"
          target="_blank"
        >
          크리에이티브 커먼즈 저작자표시-비영리-동일조건변경허락 4.0 국제 라이선스
        </a>
        에 따라 이용할 수 있습니다.
      </div>
    </div>
  );
}

export default WikiRule;
