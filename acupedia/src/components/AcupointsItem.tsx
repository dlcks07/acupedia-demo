import HighlightTextTitle from 'components/HighlightTextTitle';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HighlightText from './HighlightText';

interface Props {
  highlight?: string;
  item: any;
}

function AcupointsItem({ highlight = '', item }: Props) {
  const location = useLocation();
  const navigation = useNavigate();
  const contentArr = item?.quotes;
  // console.log(highlight);

  /*const onSubjectClick = () => {
    navigation({
      pathname: '/wikiDetail',
      search: `?title=${item.acupointName}`
    });
  };
링크기능 잠시 주석처리
*/

  return (
    <div className="acuItem_row ">
      <div className="acuItem__titleWrapper">
        <span
          /*onClick={onSubjectClick}링크기능주석처리*/
          className="acuItem__titleText"
        >
          <HighlightTextTitle
            text={item.acupointName}
            highlight={highlight || ''}
          />
        </span>
      </div>
      <div className="acuItem__content">
        {contentArr.map((item: string, index: number) => {
          if (location.pathname.includes('/searchResult')) {
            if (index > 1) return;
            if (index > 0) {
              return <span key={index}>...</span>;
            }
          }

          const arr = item.replace(/\\n/, '\n').split('\n');
          const add = arr[1].split('\\n');

          return (
            <div key={index}>
              <p>
                <HighlightText
                  text={arr[0] || ''}
                  highlight={highlight || ''}
                />
              </p>

              {add[1] ? (
                <>
                  <p>
                    <HighlightText
                      text={add[0] || ''}
                      highlight={highlight || ''}
                    />
                  </p>
                  <p>
                    <HighlightText
                      text={add[1] || ''}
                      highlight={highlight || ''}
                    />
                  </p>
                  <p>
                    <HighlightText
                      text={add[2] || ''}
                      highlight={highlight || ''}
                    />
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <HighlightText
                      text={arr[1] || ''}
                      highlight={highlight || ''}
                    />
                  </p>
                  <p>
                    <HighlightText
                      text={arr[2] || ''}
                      highlight={highlight || ''}
                    />
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AcupointsItem;
