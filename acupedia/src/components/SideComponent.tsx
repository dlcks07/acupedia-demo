import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { Adsense } from '@ctrl/react-adsense';
import SearchPrescription from './SearchPrescription';
import GoogleAdvertise from './GoogleAdvertise';
import { VERTICAL } from 'constants/GoogleAds';
import { useQuery } from 'react-query';
import { categoryAPi, wikiApi } from 'libs/api';
import makeStyles from '@mui/material/styles/makeStyles';

interface Category {
  id: string;
  name: string;
  children: Subcategory[];
  libraryHistories: LibraryHistory[];
}

interface Subcategory {
  id: string;
  name: string;
  children: never[]; // an empty array since subcategories do not have any children
  libraryHistories: LibraryHistory[];
}

interface LibraryHistory {
  id: number;
  subTitle: string;
  title: string;
  documentOrder: number;
}

function SideComponent() {
  const location = useLocation();
  const navigation = useNavigate();
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const [curLocation, setCurLocation] = useState('');
  const [item, setItem] = useState('');
  const [expanded, setExpanded] = useState<string[]>([]);

  const { data, isLoading } = useQuery(
      'wikiRecentChanges',
      wikiApi.wikiRecentChanges
  );

  const { data: categoryData, isLoading: categoryLoading } = useQuery(
      'libraryIndex',
      categoryAPi.libraryIndex
  );

  const onPageClick = (title: string) => {
    if (title === '') return;

    navigation({
      pathname: '/wikiDetail',
      search: `?title=${title}`,
    });
  };

  const onLibraryPageClick = (title: string) => {
    if (title === '') return;

    navigation({
      pathname: '/libraryDetail',
      search: `?title=${title}`,
    });
  };

  const onSubTitleClick = (title: string) => {
    navigation({ pathname: '/libraryDetail', search: `?title=${title}` });
  };

  useEffect(() => {
    if (location.pathname !== curLocation) {
      setCurLocation(location.pathname);
    }
  }, [location]);

  const getTreeItemsFromData = (treeItems: any) => {
    return treeItems.map((treeItemData: any) => {
      let children = undefined;
      if (treeItemData.children && treeItemData.children.length > 0) {
        children = getTreeItemsFromData(treeItemData.children);
      }

      const libraryHistoryNodes = treeItemData.libraryHistories?.map(
          (history: LibraryHistory) => (
              <TreeItem
                  key={history.id}
                  nodeId={history.id.toString()}
                  label={history.subTitle}
                  onClick={() => onSubTitleClick(history.title)}
                  style={{ fontSize: '10px' }}
              />
          )
      );

      return (
          <TreeItem
              key={treeItemData.id}
              nodeId={treeItemData.id}
              label={treeItemData.name}
          >
            {children}
            {libraryHistoryNodes}
          </TreeItem>
      );
    });
  };

  const handleSelect = (e: React.SyntheticEvent, name: string) => {
    // Check if the node is already expanded
    const isExpanded = expanded.includes(name);

    // If the node is not expanded, add it to the expanded array
    // If the node is already expanded, remove it from the expanded array
    setExpanded((prevExpanded) =>
        isExpanded
            ? prevExpanded.filter((item) => item !== name)
            : [...prevExpanded, name]
    );

    // Do your other logic for node selection here
    setItem(name);
  };


  const DataTreeView = ({ treeItems }: any) => {
    return (
        <TreeView
            onNodeSelect={handleSelect}
            expanded={expanded}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            //sx={{ width: 226, height: 600 }}
        >
          {getTreeItemsFromData(treeItems)}
        </TreeView>
    );
  };

  return (
  <div className="side__container">
    <div className="side__sectionWrap">
    {location.pathname.includes('/library') ||
    location.pathname.includes('/prescription') ||
    location.pathname.includes('/acupoints') ||
    location.pathname.includes('/libraryDetail') ? (
      
      <div className="side__section">
        <p className="side__sectionTit">학술 자료庫 목록</p>
        <div className="side__scrollBox">
          {categoryLoading ? null : (
            <DataTreeView
              treeItems={categoryData.data}
            />
          )}
        </div>
      </div>
    ) : (
      <>
        
        <div className="side__section">
          <p className="side__sectionTit">최근 변경된 위키 페이지</p>
          <div className="side__scrollBox">
          {isLoading
            ? [...Array(8)].map((_, index) => (
                <div key={index} className="side__item">
                  <p className="side__itemText"></p>
                </div>
              ))
            : [...Array(8)].map((_, index: number) => (
                <div
                  onClick={() =>
                    onPageClick(data.data.wikis[index]?.wikiTitle ?? '')
                  }
                  key={index}
                  className="side__item"
                >                  
                  <p className="side__itemText">
                    {data.data.wikis[index]?.wikiTitle ?? ''}
                  </p>
                </div>
              ))}
              </div>          
        </div>
        

        {location.pathname.includes('/searchResult') && (
          <div className="side__section">
            <p className="side__sectionTit">최근 작성된 학술자료庫 페이지</p>
            <div className="side__scrollBox">
            {isLoading
              ? [...Array(8)].map((_, index) => (
                  <div key={index} className="side__item">                    
                    <p className="side__itemText"></p>
                  </div>
                ))
              : [...Array(8)].map((_, index: number) => (
                  <div
                    onClick={() =>
                      onLibraryPageClick(
                        data.data.libraries[index]?.libraryTitle ?? ''
                      )
                    }
                    key={index}
                    className="side__item"
                  >                    
                    <p className="side__itemText">
                      {data.data.libraries[index]?.libraryTitle ?? ''}
                    </p>
                  </div>
                ))}  
               </div>           
          </div>
        )}
      </>
    )}
    </div>

    {!location.pathname.includes('/searchResult') && (
      <div className="side__SearchWrap">
        <SearchPrescription />
      </div>
    )}

    <div className="side__ads">
      <GoogleAdvertise slot={VERTICAL} width={136} height={888} />
    </div>
  </div>
);
}

export default SideComponent;

