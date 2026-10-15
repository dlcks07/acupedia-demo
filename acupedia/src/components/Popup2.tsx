import React, { useState, useEffect } from 'react';
import '../styles/layout.css';

interface PopupData {
  id: number;
  title: string;
  link?: string;
  imageUrl: string;
  width: number;
  height: number;
  positionTop: number;
  positionSide: number;
  positionSideType: string;
}

interface Props {
  data: {
    status: string;
    data: PopupData[];
  };
}

const Popup2 = ({ data }: Props) => {
  const [popupData, setPopupData] = useState<PopupData[]>([]);
  const [popupClosed, setPopupClosed] = useState<boolean[]>([]);

  useEffect(() => {
    const reversedData = data.data.slice().reverse();
    setPopupData(reversedData);
    const cookiePopupClosed = getCookie("usrpopup_closed");
    if (cookiePopupClosed) {
      const closedIds = cookiePopupClosed.split(',').map(Number);
      const closedStates = reversedData.map(popup => closedIds.includes(popup.id));
      setPopupClosed(closedStates);
    } else {
      setPopupClosed(reversedData.map(() => false));
    }
  }, [data.data]);

  const handleClose = (index: number, shouldSetCookie: boolean = false) => {
    const updatedPopupClosed = [...popupClosed];
    updatedPopupClosed[index] = true;
    setPopupClosed(updatedPopupClosed);

    if (shouldSetCookie) {
      updateCookie(updatedPopupClosed);
    }
  };

  const handleLabelClick = (index: number) => {
    handleClose(index, true);
  };

  const handleImageClick = (link: string | undefined) => {
    if (link && link.trim() !== '') {
      window.open(link, '_blank');
    }
  };

  const updateCookie = (popupClosedStates: boolean[]) => {
    const closedIds = popupClosedStates
      .map((closed, idx) => (closed ? popupData[idx].id : null))
      .filter(id => id !== null);

    const date = new Date();
    date.setHours(23, 59, 59, 0);
    document.cookie = `usrpopup_closed=${closedIds.join(',')}; expires=${date.toUTCString()}; path=/`;
  };

  return (
    <>
      {popupData.length > 0 && popupData.map((popup, index) => {
        if (popupClosed[index]) return null;

        return (
          <div
            className="layerPop2"
            id={`usrpopup_${popup.id}`}
            key={popup.id}
            style={{
              width: popup.width,
              height: popup.height,
              top: popup.positionTop,
              left: popup.positionSideType === 'L' ? popup.positionSide : 'auto',
              right: popup.positionSideType === 'R' ? popup.positionSide : 'auto',
              zIndex: 1001 + index,
            }}
          >
            <div className="popCnts" onClick={() => handleImageClick(popup.link)}>
              <img src={popup.imageUrl} alt={popup.title} style={{ width: '100%', height: '100%', cursor: popup.link ? 'pointer' : 'default' }} />
            </div>
            <div className="popBottom">
              <div className="today">
                <label htmlFor={`usrpopup_${popup.id}_chk`} onClick={() => handleLabelClick(index)}>
                  오늘 그만 보기
                </label>
              </div>
              <button type="button" className="pop_close" onClick={() => handleClose(index)}>
                닫기
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
};

// 쿠키 가져오기 함수
const getCookie = (name: string): string | null => {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export default Popup2;

const styles = `
    .layerPop2 {position:fixed; z-index:100000;}
    .layerPop2 .popBottom {width:100%;min-width:220px;color:#0f39b2; background:#fff;font-size:14px; display:flex; justify-content:space-between; align-items:center;white-space:nowrap;
    border:1px solid rgba(193,214,233,1);}
    .layerPop2 .popBottom .today label{text-align:center;cursor:pointer;padding:8px;display:block;width:100%;}
    .layerPop2 .popBottom .pop_close {flex: 0 0 50%; cursor:pointer; color:#0f39b2; padding:5px;font-weight:600;}
    .layerPop2 .popBottom .today { display:flex;flex:1 1 50%; color:#0f39b2; background:#fff;/*border:1px solid #0f39b2;*/box-sizing:borer-box;align-items:center; 
    gap:5px;font-weight:600; border-right:1px solid rgba(193,214,233,1);}
    .layerPop2 .popBottom .pop_close img { width:22px; }

    @media (max-width: 768px) {
      .layerPop2 { left: 50% !important; right: auto !important; transform: translateX(-50%); max-width: 95vw !important; }
      .layerPop2 img { width: 100% !important; height: auto !important; max-width: 100vw !important;}
    }
`;

const styleTag = document.createElement('style');
styleTag.type = 'text/css';
styleTag.appendChild(document.createTextNode(styles));
document.head.appendChild(styleTag);