import dayjs from 'dayjs';
import { cls } from 'libs/utils';
import { useNavigate } from 'react-router-dom';

interface Props {
  index: number;
  curLocation: string;
  curIndex: number;
  title: string;
  item: any;
}

function HistoryItem({ index, curLocation, curIndex, title, item }: Props) {
  const navigation = useNavigate();

  const onLookClick = () => {
    navigation({
      pathname: '/wikiDetail',
      search: `?title=${title}&version=${item.version}`
    });
  };
  const onCompareClick = () => {
    navigation({
      pathname: '/wikiCompare',
      search: `?title=${title}&version=${item.version}`
    });
  };

 
return (
  <div className="historyItem__container">
    
    <div className="historyItem__number historyItem__col">
      {index + 1 + (curIndex - 1) * 20}
    </div>

    <div className="historyItem__date historyItem__col">
      {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
    </div>

    <div onClick={onLookClick} className="historyItem__button historyItem__col button01">
      보기
    </div>

    <div onClick={onCompareClick} className="historyItem__button historyItem__col button02">
      비교
    </div>

    <div
      className={cls(
        item.status === 'ACCEPT'
          ? 'historyItem__status historyItem__status--accept historyItem__col'
          : 'historyItem__status historyItem__status--reject historyItem__col'
      )}
    >
      {item.status === 'ACCEPT' ? '승인' : '거절'}
    </div>

    <div
      className={cls(
        'historyItem__reason historyItem__col',
        item.status === 'ACCEPT' ? '' : 'historyItem__reason--reject'
      )}
    >
      {item.status === 'ACCEPT' ? '-' : item.reason}
    </div>

    <div className="historyItem__nickname historyItem__col">{item.nickname}</div>

    <div
      className={cls(
        'historyItem__authority historyItem__col',
        item.authority === 'NONE'
          ? 'historyItem__authority--none'
          : 'historyItem__authority--other'
      )}
    >
      {item.authority === 'ADMIN'
        ? '관리자'
        : item.authority === 'DOCTOR'
        ? '한의사'
        : item.authority === 'STUDENT'
        ? '한의대생'
        : '일반회원'}
    </div>
  </div>
);
}

export default HistoryItem;
