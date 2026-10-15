import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-toastify';
import axiosInstance from 'components/AxiosInstance';

interface Category {
  id: string;
  name: string;
  children: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  children: never[];
}

function LibraryCategory({ data }: any) {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigation = useNavigate();
  const [parentCategory, setParentCategory] = useState('');
  const [parentOrderNumber, setParentOrderNumber] = useState('');
  const [childOrderNumber, setChildOrderNumber] = useState('');
  const [childId, setChildId] = useState('');
  const [childCategory, setChildCategory] = useState('');
  const [newDisplayOrder, setNewDisplayOrder] = useState('');
  const curLocation = location.pathname + location.search;
  const [item, setItem] = useState('');
  const [selectedParent, setSelectedParent] = useState('');
  const [selectedChild, setSelectedChild] = useState('');
  const [category, setCategory] = useState('');
  const [expanded, setExpanded] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const jwtToken = sessionStorage.getItem('jwtToken');
  const [itemName, setItemName] = useState('');
  console.log(data);

  const findNodeById = (
    items: (Category | Subcategory)[],
    id: string
  ): Category | Subcategory | null => {
    for (const item of items) {
      if (item.id.toString() === id) {
        return item;
      }
      if ('children' in item && item.children.length > 0) {
        const foundNode = findNodeById(item.children, id);
        if (foundNode) {
          return foundNode;
        }
      }
    }
    return null;
  };

  const handleSelect = (e: React.SyntheticEvent, id: string) => {
    const isExpanded = expanded.includes(id);

    setExpanded((prevExpanded) =>
      isExpanded
        ? prevExpanded.filter((item) => item !== id)
        : [...prevExpanded, id]
    );
    setItem(id);

    const selectedNode = findNodeById(data.data, id);
    if (selectedNode) {
      setItemName(selectedNode.name);
    }
  };

  const handleParentChange = (event: any) => {
    setSelectedParent(event.target.value);
  };

  const handleChildChange = (event: any) => {
    setSelectedChild(event.target.value);
  };

  const onAddParentClick = async () => {
    if (parentCategory.length === 0) {
      if (isMobile) {
        alert('대분류 명칭을 입력해주세요.');
        return;
      } else {
        toast('대분류 명칭을 입력해주세요.');
        return;
      }
    }
    if (parentOrderNumber.length === 0) {
      if (isMobile) {
        alert('출력 순서를 입력해주세요.');
        return;
      } else {
        toast('출력 순서를 입력해주세요.');
        return;
      }
    }
    setIsLoading(true);
    const response = await axiosInstance.post(
      `/category/add?name=${parentCategory}&parent_id=${0}&display_order=${parentOrderNumber}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    if (response.status === 200) {
      toast('대분류가 추가되었습니다.');
      setParentCategory('');
      setParentOrderNumber('');
    }
    console.log(response);
    window.location.reload();
  };

  const onAddChildClick = async () => {
    if (childCategory.length === 0 || childId === null) {
      if (isMobile) {
        alert('중분류 명칭을 입력해주시거나 대분류를 선택해주세요.');
        return;
      } else {
        toast('중분류 명칭을 입력해주시거나 대분류를 선택해주세요.');
        return;
      }
    }
    if (childOrderNumber.length === 0) {
      if (isMobile) {
        alert('출력 순서를 입력해주세요.');
        return;
      } else {
        toast('출력 순서를 입력해주세요.');
        return;
      }
    }
    setIsLoading(true);
    const response = await axiosInstance.post(
      `/category/add?name=${childCategory}&parent_id=${childId}&display_order=${childOrderNumber}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    if (response.status === 200) {
      toast('중분류가 추가되었습니다.');
      setChildCategory('');
      setChildId('');
      setChildOrderNumber('');
    }
    console.log(response);
    window.location.reload();
  };

  const onEditCategoryClick = async () => {
    if (category.length === 0 || item === null) {
      if (isMobile) {
        alert('수정하실 분류를 선택해주시거나 수정하실 명칭을 입력해주세요.');
        return;
      } else {
        toast('수정하실 분류를 선택해주시거나 수정하실 명칭을 입력해주세요.');
        return;
      }
    }
    setIsLoading(true);
    const response = await axiosInstance.post(
      `category/edit?newName=${category}&category_id=${item}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    if (response.status === 200) {
      toast('카테고리가 수정되었습니다.');
      setCategory('');
    }
    console.log(response);
    window.location.reload();
  };

  const onEditCategoryOrderClick = async () => {
    if (selectedParent.length === 0 || newDisplayOrder === null) {
      if (isMobile) {
        alert('수정하실 분류를 선택해주시거나 수정하실 명칭을 입력해주세요.');
        return;
      } else {
        toast('수정하실 분류를 선택해주시거나 수정하실 명칭을 입력해주세요.');
        return;
      }
    }
    setIsLoading(true);
    const response = await axiosInstance.post(
      `category/modifyOrder`,
      {
        parentId: selectedChild.length !== 0 ? selectedParent : 0,
        id: selectedChild.length !== 0 ? selectedChild : selectedParent,
        newDisplayOrder: newDisplayOrder,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    if (response.status === 200) {
      toast('카테고리 출력순서가 수정되었습니다.');
      setNewDisplayOrder('');
    }
    console.log(response);
    window.location.reload();
  };

  const onDeleteClick = async () => {
    console.log(item);

    const response = await axiosInstance.post(
      `/category/delete?category_id=${item}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    if (response.status === 200) {
      toast('카테고리가 삭제되었습니다.');
    }
    window.location.reload();
  };

  const parentOptions = data?.data?.map((item: Category) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ));

  const childOptions = selectedParent
    ? data.data
        .find((item: Category) => item.id === selectedParent)
        ?.children.map((item: Subcategory) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))
    : [];

  const getTreeItemsFromData = (
    treeItems: (Category | Subcategory)[]
  ): React.ReactNode => {
    return treeItems.map((treeItemData) => (
      <TreeItem
        key={treeItemData.id}
        nodeId={treeItemData.id.toString()}
        label={treeItemData.name}
      >
        {'children' in treeItemData && treeItemData.children.length > 0 && (
          <>{getTreeItemsFromData(treeItemData.children)}</>
        )}
      </TreeItem>
    ));
  };

  const DataTreeView = ({ treeItems }: any) => {
    return (
      <TreeView
        onNodeSelect={handleSelect}
        expanded={expanded}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ flexGrow: 1, overflowY: 'auto' }}
      >
        {getTreeItemsFromData(treeItems)}
      </TreeView>
    );
  };

  const onBackClick = () =>
    navigation({
      pathname: `/acupediaAdmin/library`,
      search: '?index=1',
    });

  /*
  <TreeItem nodeId="2" onClick={()=> window.location.pathname = '/exmaple'} />
  */

  return (
    <div className="pl-[160px]">
      <div className="w-full ">
        <div className="mb-[26px] pl-3 h-[26px] border-l-2 border-[#0A2996] mt-[49px] text-[22px] font-semibold">
          학술 자료庫 카테고리 편집
        </div>
        <div className="flex flex-row-reverse pr-4 mb-[15px]">
          <button
            onClick={onBackClick}
            className="self-end w-[300px] bg-[#0A2996] hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded"
          >
            학술 자료庫 목록으로 돌아가기
          </button>
        </div>
        <div className="w-full flex">
          <div className="flex flex-col w-half">
            <div className="mb-[26px] pl-3 h-[26px] mt-[69px] text-[19px] font-semibold">
              · 학술 자료庫 카테고리 목록
            </div>
            <div className="flex-wrap scroll-y-auto h-[800px] w-[380px] border-double border-4 border-slate-300">
              <>
                <DataTreeView treeItems={data.data} />
              </>
            </div>
          </div>
          <div className="pt-[130px] pl-[20px]">
            <div>
              <span className="block pl-[2px]">· 대분류 입력</span>
              <span className="pl-[13px]">대분류 입력</span>
              <input
                onChange={(e) => setParentCategory(e.target.value)}
                className="w-[303px] border-2 px-2 ml-7 m-2"
                placeholder="대분류 제목을 입력해주세요"
              ></input>
              <br />
              <span className="pl-[13px]">출력 순서 입력</span>
              <input
                onChange={(e) => setParentOrderNumber(e.target.value)}
                className="w-[303px] border-2 px-2 m-2"
                placeholder="출력 순서를 입력해주세요"
              ></input>
              <button
                className="self-end w-[70px] bg-[#0A2996] hover:bg-blue-700 text-white py-1 ml-4 mb-10 rounded"
                onClick={onAddParentClick}
              >
                submit
              </button>
            </div>
            <div>
              <span className="block pl-[2px]">· 중분류 입력</span>
              <span className="pl-[13px]">대분류 선택</span>
              <select
                className="border-2 w-[303px] ml-7 m-2"
                onChange={(e) => setChildId(e.target.value)}
              >
                <option>대분류 선택</option>
                {parentOptions}
              </select>
              <br></br>
              <span className="pl-[13px]">중분류 입력</span>
              <input
                onChange={(e) => setChildCategory(e.target.value)}
                className="w-[303px] border-2 px-2 ml-7 m-2"
                placeholder="중분류 제목을 입력해주세요"
              ></input>
              <br />
              <span className="pl-[13px]">출력 순서 입력</span>
              <input
                onChange={(e) => setChildOrderNumber(e.target.value)}
                className="w-[303px] border-2 px-2 m-2"
                placeholder="출력 순서를 입력해주세요"
              ></input>
              <button
                className="self-end w-[70px] bg-[#0A2996] hover:bg-blue-700 text-white py-1 ml-4 mb-10 rounded"
                onClick={onAddChildClick}
              >
                submit
              </button>
            </div>
            <div className="space-y-1">
              <span className="block pl-[2px] pt-[15px] mb-2 font-semibold">
                · 분류 수정
              </span>
              <span className="block pl-[12px] pt-[2px] pb-[6px]">
                1. 명칭 수정
              </span>
              <span className="pl-[26px]">
                분류 선택 (옆 목록에서 수정하고자 하는 분류를 선택해주세요.)
                <form className="border-2 mt-2 mb-2 ml-6 h-[28px] pl-2 w-[200px] align-middle resize-none">
                  {itemName}
                </form>
              </span>
              <span className="pl-[26px]">수정 제목 입력</span>
              <input
                onChange={(e) => setCategory(e.target.value)}
                className="w-[290px] border-2 px-2 m-2 "
                placeholder="수정할 분류의 제목을 입력해주세요"
              ></input>
              <button
                className="self-end w-[70px] bg-[#0A2996] hover:bg-blue-700 text-white py-1 ml-4 mb-10 rounded"
                onClick={onEditCategoryClick}
              >
                submit
              </button>
            </div>
            <div>
              <span className="block pl-[12px] pt-[22px] pb-[6px]">
                2. 출력 순서 수정
              </span>
              <div className="flex pl-[26px]">
                <select onChange={handleParentChange} value={selectedParent}>
                  <option value="">대분류 선택</option>
                  {parentOptions}
                </select>
                <br />
                <br />
                <select onChange={handleChildChange} value={selectedChild}>
                  <option value="">중분류 선택</option>
                  {childOptions}
                </select>
              </div>
              <div>
                <span className="pr-[15px] pl-[26px]"> 순서 입력 </span>
                <input
                  onChange={(e) => setNewDisplayOrder(e.target.value)}
                  className="ml-7 w-[290px] border-2 pl-2 m-2"
                  placeholder="숫자를 입력해주세요"
                ></input>
                <button
                  className="self-end w-[70px] bg-[#0A2996] hover:bg-blue-700 text-white py-1 ml-4 mb-10 rounded"
                  onClick={onEditCategoryOrderClick}
                >
                  submit
                </button>
              </div>
              <div className="space-y-1">
                <span className="block pl-[12px] pt-[2px] pb-[6px]">
                  3. 분류 삭제
                </span>
                <div className="pl-[26px]">
                  분류 선택 (옆 목록에서 삭제하고자 하는 분류를 선택해주세요.)
                  <span className="pl-[26px] text-sm">
                    <br></br>
                    *주의: 대분류 삭제 시 하위분류도 함께 삭제가 됩니다.
                    주의해주시기 바랍니다.{' '}
                  </span>
                  <div className="flex item-center pt-[6px]">
                    <form className="border-2 mt-2 mb-2 h-[28px] pl-2 w-[200px] align-middle resize-none">
                      {itemName}
                    </form>
                    <button
                      className="mt-1 self-end w-[70px] bg-[#CC0000] hover:bg-blue-700 text-white py-1 ml-4 mb-10 rounded"
                      onClick={onDeleteClick}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LibraryCategory;
