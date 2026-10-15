import React, { useState, useEffect } from 'react';
import { publicPath } from 'libs/utils';

const Popup = () => {
    const [popupClosed, setPopupClosed] = useState(false);

    useEffect(() => {
        // 페이지 로드 시 쿠키 확인하여 팝업 상태 설정
        const cookiePopupClosed = getCookie("popup_closed");
        if (cookiePopupClosed) {
            setPopupClosed(true);
        }
    }, []);

    const handleClose = () => {
        // 팝업 닫기 버튼 클릭 시 팝업 숨기기
        setPopupClosed(true);
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // "오늘 하루 보지 않기" 체크박스가 변경되었을 때
        const isChecked = event.target.checked;
        if (isChecked) {
            // 오늘 하루 보지 않기가 체크되었으면, 쿠키 설정
            const date = new Date();
            // 쿠키 만료 시간을 오늘 자정으로 설정
            date.setHours(23, 59, 59, 0);
            document.cookie = "popup_closed=1; expires=" + date.toUTCString() + "; path=/";
        } else {
            // 체크가 해제되면 쿠키 삭제
            document.cookie = "popup_closed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    };

    // 팝업이 닫혀있으면 null을 반환하도록 수정
    if (popupClosed) {
        return null;
    }

    return (
        <div className="layerPop" id="popup01">
            <div className="popCnts">
                <img src={publicPath('/images/popup_20240507.jpg')} alt="" useMap="#popupMap" />
                <map name="popupMap">
                    <area shape="rect" alt="" title="이메일접수" coords="141,393,367,410"  href="mailto:admin@acupedia.net"  />
                    <area shape="rect" alt="" title="문의" coords="135,547,317,569" href="mailto:admin@acupedia.net"  />
                </map>
            </div>
            <div className="popBottom">
                <div className="today">
                    <input type="checkbox" id="popup01_chk" onChange={handleCheckboxChange} />
                    <label htmlFor="popup01_chk">오늘 하루 보지 않기</label>
                </div>
                <button type="button" className="pop_close" onClick={handleClose}>
                    <img src={publicPath('/images/popup_close.png')} alt="팝업닫기"/>
                </button>
            </div>
        </div>
    );
};

// 쿠키 가져오기 함수
const getCookie = (name: string): string | null => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
};

export default Popup;


const styles = `
    .layerPop {position:fixed; top:153px; left:50%; transform:translateX(475px); z-index:100000;}
    .layerPop .popBottom { background:#0f39b2; color:#fff; padding:5px 25px; font-size:14px; display:flex; justify-content:space-between; align-items:center; }    
    .layerPop .popBottom .today label,
    .layerPop .popBottom .pop_close { cursor:pointer; color:#fff; }
    .layerPop .popBottom .today { display:flex; align-items:center; gap:5px; }
    .layerPop .popBottom .pop_close img { width:26px; }
`;

const styleTag = document.createElement('style');
styleTag.type = 'text/css';
styleTag.appendChild(document.createTextNode(styles));
document.head.appendChild(styleTag);
