/**
 * 오프라인 CSS/구조 점검용 샘플 데이터.
 * 실제 API 응답과 같은 필드 이름만 맞춘 값이며, 운영 데이터가 아닙니다.
 */

const now = '2026-03-12T09:30:00+09:00';

export const sampleUser = {
  jwtToken: 'offline-mock-token',
  nickname: '오프라인관리자',
  email: 'offline@acupedia.local',
  authority: 'ADMIN',
};

const wikiHtml = `
<h2>합곡 (LI4)</h2>
<p>수양명대장경의 원혈입니다. 둘째 손허리뼈 중점의 노쪽, 엄지와 집게손가락 뼈 사이에 있습니다.</p>
<p>주치: 두통, 치통, 발열, 안면신경 마비.</p>
`.trim();

const libraryMarkdown = `
## 침구갑을경 발췌

합곡은 수양명대장경의 원혈로, 두면부 질환과 열증에 다용됩니다.

- 위치: 손등, 제2중수골 요측 중점
- 주치: 두통, 치통, 발열
`.trim();

export const wikis = [
  {
    wikiTitle: '합곡',
    lastModifierNickname: '오프라인관리자',
    lastUpdatedAt: now,
  },
  {
    wikiTitle: '족삼리',
    lastModifierNickname: '한의사김',
    lastUpdatedAt: '2026-02-02T14:10:00+09:00',
  },
  {
    wikiTitle: '태충',
    lastModifierNickname: '학생박',
    lastUpdatedAt: '2026-01-18T11:05:00+09:00',
  },
  {
    wikiTitle: '백회',
    lastModifierNickname: '오프라인관리자',
    lastUpdatedAt: '2025-12-20T16:40:00+09:00',
  },
];

export const libraries = [
  {
    libraryTitle: '합곡의 고전 주치',
    content: '합곡은 수양명대장경의 원혈이며 두통 치통 발열에 사용합니다.',
  },
  {
    libraryTitle: '족삼리 임상 활용',
    content: '족삼리는 족양명위경의 합혈로 소화기 질환과 허증에 다용됩니다.',
  },
  {
    libraryTitle: '태충 경혈 해설',
    content: '태충은 족궐음간경의 원혈이며 간기울결 두통에 사용합니다.',
  },
];

const acupointQuote =
  '합곡은 수양명대장경의 원혈입니다.\\n주치: 두통\\n발열\\n치통';

export const acupoints = [
  { acupointName: '합곡 (LI4)', quotes: [acupointQuote, acupointQuote] },
  { acupointName: '곡지 (LI11)', quotes: [acupointQuote] },
  { acupointName: '수삼리 (LI10)', quotes: [acupointQuote] },
];

export const prescriptionQuotes = [
  '침구대성\\n합곡 곡지\\n두통 치통에 합곡을 주사한다.',
  '침구갑을경\\n족삼리\\n위중 허약에 족삼리를 취한다.',
  '동의보감\\n태충 합곡\\n간열 두통에 태충과 합곡을 함께 쓴다.',
];

export const kcds = [
  {
    kcdTitle: '두통 (R51)',
    content: '두통 관련 KCD 지침. 합곡, 백회, 태충을 참고합니다.',
  },
  {
    kcdTitle: '치통 (K08)',
    content: '치통 관련 지침. 합곡과 하관 활용 예시입니다.',
  },
];

export const categories = [
  {
    id: '1',
    name: '경락 경혈',
    children: [
      { id: '11', name: '수양명대장경', children: [] },
      { id: '12', name: '족양명위경', children: [] },
    ],
    libraryHistories: [
      { id: 101, subTitle: '합곡', title: '합곡의 고전 주치', documentOrder: 1 },
      { id: 102, subTitle: '곡지', title: '족삼리 임상 활용', documentOrder: 2 },
    ],
  },
  {
    id: '2',
    name: '침구 처방',
    children: [{ id: '21', name: '두면부', children: [] }],
    libraryHistories: [
      { id: 201, subTitle: '두통방', title: '태충 경혈 해설', documentOrder: 1 },
    ],
  },
];

export const comments = [
  {
    id: 1,
    nickname: '한의사김',
    createdAt: now,
    content: '합곡 위치 서술이 명확합니다.',
    deleted: false,
    myComment: true,
    reComments: [
      {
        id: 11,
        nickname: '학생박',
        createdAt: '2026-03-12T10:00:00+09:00',
        content: '취혈 그림이 있으면 더 좋겠습니다.',
        deleted: false,
        myComment: false,
      },
    ],
  },
  {
    id: 2,
    nickname: '오프라인관리자',
    createdAt: '2026-03-01T08:00:00+09:00',
    content: '고전 인용은 자료고 항목과 맞춰 두었습니다.',
    deleted: false,
    myComment: false,
    reComments: [],
  },
];

export const wikiDocument = {
  status: 'OK',
  data: {
    title: '합곡',
    nickname: '오프라인관리자',
    authority: 'ADMIN',
    lastModifiedAt: '2026-03-12T09:30:00+09:00',
    content: wikiHtml,
  },
};

export const libraryDocument = {
  status: 'OK',
  data: {
    title: '합곡의 고전 주치',
    nickname: '오프라인관리자',
    authority: 'ADMIN',
    lastModifiedAt: '2026-03-10T15:00:00+09:00',
    content: libraryMarkdown,
    category: '11',
    parentId: '1',
    subTitle: '합곡',
    documentOrder: '1',
  },
};

export const wikiHistoryItem = {
  nickname: '오프라인관리자',
  authority: 'ADMIN',
  createdAt: now,
  lastModifiedAt: now,
  content: wikiHtml,
  version: 3,
  status: 'ACCEPT',
  reason: '',
};

export const popups = [
  {
    id: 1,
    title: '오프라인 안내',
    link: '',
    imageUrl: `${process.env.PUBLIC_URL || ''}/icons/acupedia.png`,
    width: 280,
    height: 180,
    positionTop: 90,
    positionSide: 24,
    positionSideType: 'R',
    displayStart: '2026-01-01 00:00:00',
    displayEnd: '2026-12-31 23:59:00',
    displayCondition: 'ALL',
    displayOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
];

export const users = [
  {
    email: 'offline@acupedia.local',
    nickname: '오프라인관리자',
    authority: 'ADMIN',
    withdrawalUser: false,
    userCreatedAt: '2024-01-04T09:00:00+09:00',
    userWikiInfoList: [
      {
        title: '합곡',
        version: 3,
        wikiUpdatedAt: now,
        wikiHistoryStatus: 'ACCEPT',
      },
    ],
  },
  {
    email: 'doctor@acupedia.local',
    nickname: '한의사김',
    authority: 'DOCTOR',
    withdrawalUser: false,
    userCreatedAt: '2024-06-11T13:20:00+09:00',
    userWikiInfoList: [],
  },
  {
    email: 'student@acupedia.local',
    nickname: '학생박',
    authority: 'STUDENT',
    withdrawalUser: false,
    userCreatedAt: '2025-03-02T10:15:00+09:00',
    userWikiInfoList: [],
  },
];

export const posts = [
  {
    title: '합곡',
    version: 3,
    nickname: '오프라인관리자',
    authority: 'ADMIN',
    createdAt: now,
    status: 'WAIT',
    updatedAt: now,
    reason: '',
  },
  {
    title: '족삼리',
    version: 2,
    nickname: '한의사김',
    authority: 'DOCTOR',
    createdAt: '2026-02-02T14:10:00+09:00',
    status: 'ACCEPT',
    updatedAt: '2026-02-03T09:00:00+09:00',
    reason: '',
  },
];

export const libraryAdminItems = [
  { title: '합곡의 고전 주치', createdAt: now },
  { title: '족삼리 임상 활용', createdAt: '2026-02-02T14:10:00+09:00' },
  { title: '태충 경혈 해설', createdAt: '2026-01-18T11:05:00+09:00' },
];

export const intro = {
  status: 'OK',
  data: {
    introInfo: {
      content:
        '## 아큐피디아 소개\n\n경락, 경혈, 침구 처방을 찾아보는 검색 사이트입니다.\n\n이 화면은 서버 없이 구조를 보기 위한 샘플 문단입니다.',
    },
  },
};

export const wikiGuide = {
  status: 'OK',
  data: {
    introInfo: {
      content:
        '## 위키 작성 가이드\n\n1. 제목은 경혈명 또는 처방명을 사용합니다.\n2. 출처를 본문에 적습니다.\n3. 저장 후에는 히스토리에서 버전을 확인합니다.',
    },
  },
};

const ok = <T,>(data: T) => ({ status: 'OK', data });

export const offlineJson = {
  search: ok({
    hasExactlyMath: true,
    wikis,
    libraries,
    acupoints,
    prescriptions: { quotes: prescriptionQuotes },
    totalCount: 22,
  }),
  searchWiki: ok({ wikis, totalCount: 22 }),
  searchAcupoint: ok({ searchResultAcupoint: acupoints, totalCount: 22 }),
  searchPrescription: ok({
    searchResultPrescription: { quotes: prescriptionQuotes },
    totalCount: 22,
  }),
  searchLibrary: ok({ libraries, totalCount: 22 }),
  searchKcd: ok({ kcds, totalCount: 22 }),
  recentChanges: ok({ wikis, libraries }),
  wikiDocument,
  libraryDocument,
  comments: ok(comments),
  history: ok(wikiHistoryItem),
  historyAll: ok({
    wikiHistoryResponses: [
      { ...wikiHistoryItem, version: 3, status: 'ACCEPT' },
      {
        ...wikiHistoryItem,
        version: 2,
        status: 'REJECT',
        reason: '출처 표기 보완 필요',
        nickname: '한의사김',
        authority: 'DOCTOR',
      },
    ],
    totalCount: 2,
  }),
  categories: ok(categories),
  intro,
  wikiGuide,
  adminUsers: ok({ userInfoList: users, totalCount: 3 }),
  adminPosts: ok({ postUserInfoList: posts, totalCount: 2 }),
  adminLibraries: ok({ libraryContentInfoList: libraryAdminItems, totalCount: 3 }),
  adminPopups: ok({ popupInfoList: popups, totalCount: 1 }),
  popup: ok(popups[0]),
  popupList: ok(popups),
};

const paged = (body: { status: string; data: any }) => Promise.resolve(body);

export function resolveOfflineQuery(path: string): Promise<any> {
  if (path.startsWith('/search/wiki')) return paged(offlineJson.searchWiki);
  if (path.startsWith('/search/acupoint')) return paged(offlineJson.searchAcupoint);
  if (path.startsWith('/search/prescription')) return paged(offlineJson.searchPrescription);
  if (path.startsWith('/search/library')) return paged(offlineJson.searchLibrary);
  if (path.startsWith('/search/kcd')) return paged(offlineJson.searchKcd);
  if (path.startsWith('/search')) return paged(offlineJson.search);
  if (path.startsWith('/wiki/document')) return paged(offlineJson.wikiDocument);
  if (path.startsWith('/wiki/recentChanges')) return paged(offlineJson.recentChanges);
  if (path.startsWith('/library/document')) return paged(offlineJson.libraryDocument);
  if (path.startsWith('/comment/all') || path.startsWith('/libraryComment/all')) {
    return paged(offlineJson.comments);
  }
  if (path.startsWith('/history/recentAccepted') || path.startsWith('/history?')) {
    return paged(offlineJson.history);
  }
  if (path.startsWith('/history/all')) return paged(offlineJson.historyAll);
  if (path.startsWith('/admin/post')) return paged(offlineJson.adminPosts);
  if (path.startsWith('/admin/user')) return paged(offlineJson.adminUsers);
  if (path.startsWith('/admin/intro')) return paged(offlineJson.intro);
  if (path.startsWith('/admin/wikiGuide')) return paged(offlineJson.wikiGuide);
  if (path.startsWith('/admin/library')) return paged(offlineJson.adminLibraries);
  if (path.startsWith('/admin/popup')) return paged(offlineJson.adminPopups);
  if (path.startsWith('/popup/usrPopup')) return paged(offlineJson.popupList);
  if (path.startsWith('/popup/')) return paged(offlineJson.popup);
  if (path.startsWith('/category/')) return paged(offlineJson.categories);
  if (path.startsWith('/introduction/intro')) return paged(offlineJson.intro);
  if (path.startsWith('/introduction/wikiGuide')) return paged(offlineJson.wikiGuide);
  return paged(ok({}));
}

function axiosBody(url: string) {
  if (url.includes('/authenticate/login') || url.includes('/authenticate/google')) {
    return ok(sampleUser);
  }
  if (url.includes('oauth2.googleapis.com/token')) {
    return { access_token: 'offline-access-token' };
  }
  if (url.includes('googleapis.com/userinfo')) {
    return { email: sampleUser.email, name: sampleUser.nickname };
  }
  if (url.includes('/user/verifyEmail/send')) return ok('이메일 인증 코드전송 성공');
  if (url.includes('/user/verifyEmail/confirm')) return ok('코드가 일치합니다.');
  if (url.includes('/user/duplicate/email')) return ok('사용가능한 이메일입니다.');
  if (url.includes('/user/duplicate/nickname')) return ok('사용가능한 닉네임입니다.');
  if (url.includes('/image')) return ok({ imageUrl: `${process.env.PUBLIC_URL || ''}/icons/acupedia.png` });
  if (url.includes('/admin/library/search')) return offlineJson.adminLibraries;
  return ok({ message: '오프라인 모드에서 저장한 것처럼 처리했습니다.', imageUrl: `${process.env.PUBLIC_URL || ''}/icons/acupedia.png` });
}

export function resolveOfflineAxios(url: string): Promise<any> {
  return Promise.resolve({
    status: 200,
    data: axiosBody(url),
  });
}
