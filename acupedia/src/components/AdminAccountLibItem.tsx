import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

interface Props {
  item: any;
  totalCount: number;
  index: number;
}

function AdminAccountLibItem({ item, totalCount, index }: Props) {
  const navigation = useNavigate();
  const location = useLocation();
  const curIndex = +location?.search?.split('?')[1].split('=')[1];
  const onSubItemClick = (title: string) => {
    navigation({
      pathname: '/libraryDetail',
      search: `?title=${title}`,
    });
  };

  const onEditClick = (title: string) => {
    navigation({
      pathname: '/libraryEdit',
      search: `?title=${title}`,
    });
  };

  return (
    <div>
      <div className="w-full h-[49px] flex">
        <div className="w-[150px] h-full flex justify-center items-center text-[17px] text-[#3b7ab2] font-medium">
          {totalCount - index - (curIndex - 1) * 20 + 1}
        </div>
        <div className="w-[593px] h-full flex justify-center items-center text-[19px]">
          <span
            onClick={() => onSubItemClick(item.title)}
            className="underline-offset-2 cursor-pointer text-[#188aef] underline text-ellipsis overflow-hidden whitespace-nowrap"
          >
            {item.title}
          </span>
        </div>
        <div className="w-[300px] h-full flex justify-center items-center text-[15px] ">
          {dayjs(item.createdAt).format('YYYY-MM-DD hh:mm')}
        </div>
        <div className="w-[200px] h-full flex justify-center items-center text-[15px] ">
          <span
            onClick={() => onEditClick(item.title)}
            className="underline-offset-2 cursor-pointer text-[#188aef] underline text-ellipsis overflow-hidden whitespace-nowrap"
          >
            수정
          </span>
        </div>
      </div>
    </div>
  );
}

export default AdminAccountLibItem;
