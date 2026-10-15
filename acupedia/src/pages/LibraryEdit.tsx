import TUI from '../components/TUI';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LibraryRule } from 'components';
import { useQuery } from 'react-query';
import { libraryApi, categoryAPi } from 'libs/api';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-toastify';
import axiosInstance from 'components/AxiosInstance';
import { ClipLoader } from 'react-spinners';
import dayjs from 'dayjs';
import { useAppDispatch } from 'store';
import settingSlice from 'slices/setting';
import { Helmet } from 'react-helmet-async';

interface Category {
  id: string;
  name: string;
  children: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  children: never[]; // an empty array since subcategories do not have any children
}

function LibraryEdit() {
  const hideRuleCategories = [96, 55, 94];  
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const location = useLocation();
  const [newString, setNewString] = useState('');
  const title = decodeURI(
    location?.search?.split('?')[1].split('&')[0].split('=')[1]
  );
  const curSearch =
    location.search.split('?')[location.search.split('?').length - 1];
  const curLocation = location.pathname + location.search;
  const [curTitle, setCurTitle] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [displayOrder, setDisplayOrder] = useState('');
  const authority = sessionStorage.getItem('authority');
  const [jwtToken, setJwtToken] = useState(sessionStorage.getItem('jwtToken'));
  const [isLoading, setIsLoading] = useState(false);
  const [selectedParent, setSelectedParent] = useState('');
  const [selectedChild, setSelectedChild] = useState('');
  const locationState = location.state as String;
  const {
    data: data,
    refetch: detailRefetch,
    isFetching: libraryLoading,
  } = useQuery(['libraryDetail', title], libraryApi.libraryDocument, {
    enabled: title !== 'newLibrary',
    onSuccess: (data) => {
      setCurTitle(data?.data?.title);
      setUpdateTitle(data?.data?.title);
      setDisplayOrder(data?.data?.documentOrder);

      if (data?.data?.parentId === '0') {
        setSelectedChild('');
        setSelectedParent(data?.data?.category);
      } else {
        setSelectedParent(data?.data?.parentId);
        setSelectedChild(data?.data?.category);
      }

      setSubTitle(data?.data?.subTitle);
    },
  });

  const {
    data: categoryData,
    refetch: libraryRefetch,
    isFetching: categoryLoading,
  } = useQuery('category', categoryAPi.categoryList);

  const content = data?.data?.content?.replace(/\\n/g, '\n') || '';
  // console.log(location.state);

  const handleParentChange = (event: any) => {
    setSelectedParent(event.target.value);
  };

  const handleChildChange = (event: any) => {
    setSelectedChild(event.target.value);
  };

  const onReadClick = () => {
    navigation({
      pathname: '/libraryDetail',
      search: `?title=${title}`,
    });
  };

  const parentOptions = categoryData?.data?.map((item: Category) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ));

  const childOptions = selectedParent
    ? categoryData?.data
        .find((item: Category) => item.id === selectedParent)
        ?.children.map((item: Subcategory) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))
    : [];

  const onSubmitClick = async () => {
    // 새 학술 자료庫 작성
    if (curTitle === 'newLibrary') {
      if (isMobile) {
        alert('해당 제목으로 만들 수 없습니다.');
        return;
      } else {
        toast('해당 제목으로 만들 수 없습니다.');
        return;
      }
    }
    if (selectedParent.length === 0 || subTitle.length === 0) {
      if (isMobile) {
        alert('카테고리를 선택해주시거나 소제목을 입력해주세요.');
        return;
      } else {
        toast('카테고리를 선택해주시거나 소제목을 입력해주세요.');
        return;
      }
    }
    if (
      curTitle.length === 0 ||
      (newString.length === 0 && content.length === 0)
    ) {
      if (isMobile) {
        alert('제목 또는 내용을 입력해주세요.');
        return;
      } else {
        toast('제목 또는 내용을 입력해주세요.');
        return;
      }
    }
    if (displayOrder.length === 0) {
      if (isMobile) {
        alert('출력 순서를 입력해주세요(숫자).');
        return;
      } else {
        toast('출력 순서를 입력해주세요(숫자).');
        return;
      }
    }
    const time = new Date();
    setIsLoading(true);
    const trimedTitle = curTitle.trim();

    const response = await axiosInstance.post(
      `/libdocument/submit`,
      {
        content: newString.length === 0 ? content : newString,
        createdAt: time.toISOString(),
        title: trimedTitle,
        previousTitle: trimedTitle !== title ? title : null,
        categoryId: selectedChild.length !== 0 ? selectedChild : selectedParent,
        subTitle: subTitle.length !== 0 ? subTitle : null,
        displayOrder: displayOrder,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    console.log(response);
    if (response.status === 200) {
      if (isMobile) {
        alert('작성된 글이 정상적으로 등록되었습니다.');
      } else {
        toast('작성된 글이 정상적으로 등록되었습니다.');
      }
      if (title === 'newLibrary') {
        navigation({
          pathname: '/libraryDetail',
          search: `?title=${trimedTitle}`,
        });
      } else {
        navigation({
          pathname: '/libraryDetail',
          search: `?title=${trimedTitle}`,
        });
      }
    }
  };

  const onUpdateClick = async () => {
    // 학술 자료庫 수정
    if (updateTitle === 'newLibrary') {
      if (isMobile) {
        alert('해당 제목으로 만들 수 없습니다.');
        return;
      } else {
        toast('해당 제목으로 만들 수 없습니다.');
        return;
      }
    }
    if (
      updateTitle.length === 0 ||
      (newString.length === 0 && content.length === 0)
    ) {
      if (isMobile) {
        alert('제목 또는 내용을 입력해주세요.');
        return;
      } else {
        toast('제목 또는 내용을 입력해주세요.');
        return;
      }
    }
    if (selectedParent.length === 0 || subTitle.length === 0) {
      if (isMobile) {
        alert('카테고리를 선택해주시거나 소제목을 입력해주세요.');
        return;
      } else {
        toast('카테고리를 선택해주시거나 소제목을 입력해주세요.');
        return;
      }
    }
    const time = new Date();
    setIsLoading(true);

    const trimedTitle = updateTitle.trim();

    const response = await axiosInstance
      .post(
        `/libdocument/update`,
        {
          content: newString.length === 0 ? content : newString,
          updatedAt: time.toISOString(),
          title: trimedTitle,
          previousTitle: curTitle,
          categoryId:
            selectedChild.length !== 0 ? selectedChild : selectedParent,
          subTitle: subTitle.length !== 0 ? subTitle : null,
          displayOrder: displayOrder,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
      .finally(() => setIsLoading(false));
    console.log(response);
    if (response.status === 200) {
      if (isMobile) {
        alert('작성된 글이 정상적으로 수정되었습니다.');
      } else {
        toast('작성된 글이 정상적으로 수정되었습니다.');
      }
      navigation({
        pathname: '/libraryDetail',
        search: `?title=${trimedTitle}`,
      });
      window.location.reload();
    }
  };

  const onCancelClick = () => {
    window.confirm(
      '정말 글 작성을 취소하시겠습니까? 지금까지 작성한 내용은 저장되지 않습니다. 글 작성을 취소하시려면 확인 버튼을 눌러주십시오.'
    ) && navigation(-1);
  };

  const checkEnter = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const refreshJwtToken = () => {
    setJwtToken(sessionStorage.getItem('jwtToken'));
  };

  useEffect(() => {
    if (title === 'newLibrary') {
      setCurTitle(String(locationState));
    }
    window.addEventListener('storage', refreshJwtToken);

    return () => {
      window.removeEventListener('storage', refreshJwtToken);
    };
  }, []);

  useEffect(() => {
    if (!jwtToken) {
      dispatch(
        settingSlice.actions.setLastPageBeforeLogin({
          lastPageBeforeLogin: curLocation,
        })
      );
      navigation('/login');
    }
  }, [jwtToken]);

  // useEffect(() => {
  //   if (data?.status === 'BAD_REQUEST') {
  //     navigation('/404');
  //   }
  // }, [data]);

  if (data?.status === 'BAD_REQUEST') {
    return null;
  }

  return libraryLoading ? null : (
    <div className="subLeft__container">
      <Helmet>
        <title>{`${title === 'newLibrary' ? (curTitle || '새 학술자료 작성') : title} - 아큐피디아 학술 자료庫 편집`}</title>
        <meta name="description" content="아큐피디아 학술 자료庫 문서 편집 페이지입니다." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`https://www.acupedia.net/libraryEdit?title=${encodeURIComponent(title)}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="아큐피디아" />
        <meta property="og:title" content={`${title === 'newLibrary' ? (curTitle || '새 학술자료 작성') : title} - 아큐피디아 학술 자료庫 편집`} />
        <meta property="og:description" content="아큐피디아 학술 자료庫 문서 편집 페이지입니다." />
        <meta property="og:url" content={`https://www.acupedia.net/libraryEdit?title=${encodeURIComponent(title)}`} />
        <meta property="og:image" content="https://www.acupedia.net/icons/acupedia.png" />
      </Helmet>
      {curSearch !== 'admin' ? (
        <div className="subLeft_pageTit">학술 자료庫 편집</div>
      ) : null}
      <div className="subLeft__header">
          <div className="subLeft__titleBox">
            {title === 'newLibrary' ? (
              <textarea
                maxLength={100}
                className="subLeft__title"
                placeholder="제목을 입력하세요."
                onChange={(e) => setCurTitle(e.target.value)}
                onKeyPress={checkEnter}
                autoFocus
              />
            ) : (
              <>
                {
                  <textarea
                    maxLength={100}
                    className="subLeft__title"
                    placeholder="제목을 입력하세요."
                    value={updateTitle}
                    onChange={(e) => setUpdateTitle(e.target.value)}
                    onKeyPress={checkEnter}
                    autoFocus
                  />
                }
              </>
            )}
        </div>

        <div className="subLeft__tools">
          {title !== 'newLibrary' ? (
            <div className="subLeft__toolbar">
              <span onClick={onReadClick} className="subLeft__btn">읽기</span>
              <span className="subLeft__btn current">편집</span>
            </div>
          ) : null}
          {title !== 'newLibrary' ? (
            
            <div className="subLeft__editInfo">
              <p className="subLeft__editRow">
                <span className="subLeft__editLabel">
                  최종 편집자
                </span>
                <span>{data?.data?.nickname}</span>
              </p>
              <p className="subLeft__editRow">
                <span className="subLeft__editLabel">
                  최종 편집일시
                </span>
                <span>
                  {data?.data?.lastModifiedAt
                    ? dayjs(data?.data?.lastModifiedAt).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )
                    : ''}
                </span>
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="wikiEditor-wrap">
        <TUI oldString={content} setNewString={setNewString} />
      </div>

      {categoryLoading ? null : (
        <div className="wikiEdit__ectForm">
          <div className="wikiEdit__ectForm-row">
            <div className="wikiEdit__ectForm-row-tit">· 분류선택</div>
            <div className="wikiEdit__ectForm-row-input">
            <select
              className="wikiEdit__ectForm-select"
              onChange={handleParentChange}
              value={selectedParent}
            >
              <option value="">대분류 선택</option>
              {parentOptions}
            </select>            
            <select
              className="wikiEdit__ectForm-select"
              onChange={handleChildChange}
              value={selectedChild}
            >
              <option value="">중분류 선택</option>
              {childOptions}
            </select>
            </div>
          </div>
          <div className="wikiEdit__ectForm-row">
            <div className="wikiEdit__ectForm-row-tit">
              · 소제목
            </div>
            <div className="wikiEdit__ectForm-row-input">
            <textarea
              maxLength={30}
              className="wikiEdit__ectForm-textarea"
              placeholder="소제목을 입력하세요."
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              onKeyPress={checkEnter}
            />
            </div>
          </div>
          <div className="wikiEdit__ectForm-row">  
            <div className="wikiEdit__ectForm-row-tit">
              · 출력 순서
            </div>
            <div className="wikiEdit__ectForm-row-input">
            <textarea
              maxLength={30}
              className="wikiEdit__ectForm-textarea input-num"
              placeholder="(숫자 입력)"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              onKeyPress={checkEnter}
            />
            </div>
          </div>
        </div>        
      )}
      
      <div className="wikiEdit__btm-btns">
        {title !== 'newLibrary' ? (
          <span onClick={onUpdateClick} className="btn blue02" >
            {isLoading ? <ClipLoader size={20}/> : '수정'}
          </span>
        ) : (
          <span onClick={onSubmitClick} className="btn blue02" >
            {isLoading ? <ClipLoader size={20} /> : '완료'}
          </span>
        )}
        <span  onClick={onCancelClick} className="btn grey">
          취소
        </span>
      </div>

      {hideRuleCategories.includes(Number(selectedParent)) ? (
        <div style={{ height: '30px' }}></div>
      ) : (
        <div className="subLeft__rules">
          <LibraryRule />
        </div>
      )}

    </div>
  );
}

export default LibraryEdit;
