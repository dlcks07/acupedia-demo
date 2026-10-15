import { resolveOfflineQuery } from 'mocks/offlineData';

/**
 * 오프라인 모드.
 * 아래 BASE_URL fetch 는 모두 주석 처리하고, 같은 경로의 샘플 JSON 을 반환합니다.
 * 서버를 다시 붙일 때는 각 함수의 return resolveOfflineQuery(...) 를 지우고
 * 주석의 fetch 를 되돌리면 됩니다.
 */
// const BASE_URL = 'https://api.acupedia.co.kr';

export const searchApi = {
  searchWord: ({ queryKey }: any) => {
    const [_, word] = queryKey;
    // return fetch(`${BASE_URL}/search?word=${word}`).then((res) => res.json());
    return resolveOfflineQuery(`/search?word=${word}`);
  },
  searchWiki: ({ queryKey }: any) => {
    const [_, word, offset] = queryKey;
    // return fetch(
    //   `${BASE_URL}/search/wiki?word=${word}&limit=20&offset=${offset}`
    // ).then((res) => res.json());
    return resolveOfflineQuery(`/search/wiki?word=${word}&offset=${offset}`);
  },
  searchAcupoint: ({ queryKey }: any) => {
    const [_, word, offset] = queryKey;
    // return fetch(
    //   `${BASE_URL}/search/acupoint?word=${word}&limit=5&offset=${offset}`
    // ).then((res) => res.json());
    return resolveOfflineQuery(`/search/acupoint?word=${word}&offset=${offset}`);
  },
  searchPrescription: ({ queryKey }: any) => {
    const [_, word, offset] = queryKey;
    // return fetch(
    //   `${BASE_URL}/search/prescription?word=${word}&limit=20&offset=${offset}`
    // ).then((res) => res.json());
    return resolveOfflineQuery(`/search/prescription?word=${word}&offset=${offset}`);
  },
  searchLibrary: ({ queryKey }: any) => {
    const [_, word, offset] = queryKey;
    // return fetch(
    //   `${BASE_URL}/search/library?word=${word}&limit=20&offset=${offset}`
    // ).then((res) => res.json());
    return resolveOfflineQuery(`/search/library?word=${word}&offset=${offset}`);
  },
  searchKcd: ({ queryKey }: any) => {
    const [_, word, offset] = queryKey;
    // return fetch(
    //   `${BASE_URL}/search/kcd?word=${word}&limit=20&offset=${offset}`
    // ).then((res) => res.json());
    return resolveOfflineQuery(`/search/kcd?word=${word}&offset=${offset}`);
  },
};

export const wikiApi = {
  wikiDocument: ({ queryKey }: any) => {
    const [_, title] = queryKey;
    // return fetch(`${BASE_URL}/wiki/document?title=${title}`).then((res) => res.json());
    return resolveOfflineQuery(`/wiki/document?title=${title}`);
  },
  libraryDocument: ({ queryKey }: any) => {
    const [_, title] = queryKey;
    // return fetch(`${BASE_URL}/library/document?title=${title}`).then((res) => res.json());
    return resolveOfflineQuery(`/library/document?title=${title}`);
  },
  wikiComment: ({ queryKey }: any) => {
    const [_, wikiTitle] = queryKey;
    // return fetch(`${BASE_URL}/comment/all?wikiTitle=${wikiTitle}`, {
    //   headers: { Authorization: jwtToken ? `Bearer ${jwtToken}` : '' },
    // }).then((res) => res.json());
    return resolveOfflineQuery(`/comment/all?wikiTitle=${wikiTitle}`);
  },
  wikiRecentChanges: () =>
    // fetch(`${BASE_URL}/wiki/recentChanges`).then((res) => res.json()),
    resolveOfflineQuery('/wiki/recentChanges'),
  wikiHistory: ({ queryKey }: any) => {
    const [_, title, version] = queryKey;
    // return fetch(`${BASE_URL}/history?title=${title}&version=${version}`, {
    //   headers: { Authorization: jwtToken ? `Bearer ${jwtToken}` : '' },
    // }).then((res) => res.json());
    return resolveOfflineQuery(`/history?title=${title}&version=${version}`);
  },
  wikiHistoryRecentAccepted: ({ queryKey }: any) => {
    const [_, title, version] = queryKey;
    // return fetch(`${BASE_URL}/history/recentAccepted?title=${title}&version=${version}`, {
    //   headers: { Authorization: jwtToken ? `Bearer ${jwtToken}` : '' },
    // }).then((res) => res.json());
    return resolveOfflineQuery(`/history/recentAccepted?title=${title}&version=${version}`);
  },
  wikiHistoryAll: ({ queryKey }: any) => {
    const [_, title, offset] = queryKey;
    // return fetch(`${BASE_URL}/history/all?limit=50&offset=${offset}&title=${title}`, {
    //   headers: { Authorization: jwtToken ? `Bearer ${jwtToken}` : '' },
    // }).then((res) => res.json());
    return resolveOfflineQuery(`/history/all?offset=${offset}&title=${title}`);
  },
};

export const libraryApi = {
  libraryDocument: ({ queryKey }: any) => {
    const [_, title] = queryKey;
    // return fetch(`${BASE_URL}/library/document?title=${title}`).then((res) => res.json());
    return resolveOfflineQuery(`/library/document?title=${title}`);
  },
  libraryComment: ({ queryKey }: any) => {
    const [_, libraryHistoryTitle] = queryKey;
    // return fetch(`${BASE_URL}/libraryComment/all?libraryTitle=${libraryHistoryTitle}`, {
    //   headers: { Authorization: jwtToken ? `Bearer ${jwtToken}` : '' },
    // }).then((res) => res.json());
    return resolveOfflineQuery(`/libraryComment/all?libraryTitle=${libraryHistoryTitle}`);
  },
};

export const adminAPi = {
  adminPost: ({ queryKey }: any) => {
    const [_, page] = queryKey;
    // return fetch(`${BASE_URL}/admin/post?limit=20&page=${page}`, {
    //   headers: { Authorization: `Bearer ${jwtToken}` },
    // }).then((res) => res.json());
    return resolveOfflineQuery(`/admin/post?page=${page}`);
  },
  adminUser: ({ queryKey }: any) => {
    const [_, offset] = queryKey;
    // return fetch(`${BASE_URL}/admin/user?limit=20&offset=${offset}`, {
    //   headers: { Authorization: `Bearer ${jwtToken}` },
    // }).then((res) => res.json());
    return resolveOfflineQuery(`/admin/user?offset=${offset}`);
  },
  adminIntro: () => {
    // return fetch(`${BASE_URL}/admin/intro`, {
    //   headers: { Authorization: `Bearer ${jwtToken}` },
    // }).then((res) => res.json());
    return resolveOfflineQuery('/admin/intro');
  },
  adminWikiGuide: () => {
    // return fetch(`${BASE_URL}/admin/wikiGuide`, {
    //   headers: { Authorization: `Bearer ${jwtToken}` },
    // }).then((res) => res.json());
    return resolveOfflineQuery('/admin/wikiGuide');
  },
  adminLib: ({ queryKey }: any) => {
    const [_, page] = queryKey;
    // return fetch(`${BASE_URL}/admin/library?limit=20&page=${page}`, {
    //   headers: { Authorization: `Bearer ${jwtToken}` },
    // }).then((res) => res.json());
    return resolveOfflineQuery(`/admin/library?page=${page}`);
  },
  adminPopup: ({ queryKey }: any) => {
    const [_, offset] = queryKey;
    // return fetch(`${BASE_URL}/admin/popup?limit=20&offset=${offset}`, {
    //   headers: { Authorization: `Bearer ${jwtToken}` },
    // }).then((res) => res.json());
    return resolveOfflineQuery(`/admin/popup?offset=${offset}`);
  },
};

export const popupAPi = {
  adminPopupEdit: ({ queryKey }: any) => {
    const [_, id] = queryKey;
    // return fetch(`${BASE_URL}/popup/${id}`, {
    //   headers: { Authorization: `Bearer ${jwtToken}` },
    // }).then((res) => res.json());
    return resolveOfflineQuery(`/popup/${id}`);
  },
};

export const userPopupAPi = {
  popupList: () => {
    // if (jwtToken) {
    //   return fetch(`${BASE_URL}/popup/usrPopup`, {
    //     headers: { Authorization: `Bearer ${jwtToken}` },
    //   }).then((res) => res.json());
    // }
    // return fetch(`${BASE_URL}/popup/usrPopup`).then((res) => res.json());
    return resolveOfflineQuery('/popup/usrPopup');
  },
};

export const categoryAPi = {
  categoryList: () =>
    // fetch(`${BASE_URL}/category/categories`).then((res) => res.json()),
    resolveOfflineQuery('/category/categories'),
  libraryIndex: () =>
    // fetch(`${BASE_URL}/category/categoryIndex`).then((res) => res.json()),
    resolveOfflineQuery('/category/categoryIndex'),
};

export const introductionApi = {
  introduction: () =>
    // fetch(`${BASE_URL}/introduction/intro`).then((res) => res.json()),
    resolveOfflineQuery('/introduction/intro'),
  wikiGuide: () =>
    // fetch(`${BASE_URL}/introduction/wikiGuide`).then((res) => res.json()),
    resolveOfflineQuery('/introduction/wikiGuide'),
};
