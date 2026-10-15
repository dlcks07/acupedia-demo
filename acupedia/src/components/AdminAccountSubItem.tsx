import dayjs from 'dayjs';
import { cls } from 'libs/utils';
import { useNavigate } from 'react-router-dom';

interface Props {
  curLocation: string;
  item: any;
}

function AdminAccountSubItem({ curLocation, item }: Props) {
  const navigation = useNavigate();
  const onSubItemClick = () => {
    navigation({
      pathname: '/wikiCompare',
      search: `?title=${item.title}&version=${item.version}`
    });
  };
  return (
    <div className="h-[49px] bg-[#F7F6F3] border-b-[1px] border-[#DFDFDF] flex items-center">
      <div className="ml-[62px] w-[283px] flex justify-center items-center">
        <span
          onClick={onSubItemClick}
          className="cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap text-[#188aef] underline underline-offset-2"
        >
          {item.title}
        </span>
      </div>

      <span className="flex justify-center w-[318px] text-[15px] font-light">
        {item.wikiUpdatedAt ? dayjs(item.wikiUpdatedAt).format('YYYY-MM-DD hh:mm') : '-'}
      </span>
      <span
        className={cls(
          item.wikiHistoryStatus === 'ACCEPT' ? 'text-[#47CE18]' : '',
          item.wikiHistoryStatus === 'REJECT' ? 'text-[#EB3428]' : '',
          item.wikiHistoryStatus === 'WAIT' ? 'text-[#5B4342]' : '',
          'flex justify-center w-[337px] font-semibold '
        )}
      >
        {item.wikiHistoryStatus === 'ACCEPT'
          ? '승인'
          : item.wikiHistoryStatus === 'REJECT'
          ? '거절 '
          : '대기 '}
      </span>
      <span className="flex justify-center w-[243px] text-[15px] font-light text-[#FF0000]">
        {item.reason}
      </span>
    </div>
  );
}

export default AdminAccountSubItem;
