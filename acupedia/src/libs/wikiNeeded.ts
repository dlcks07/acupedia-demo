/**
 * 작성이 필요한 문서 데이터.
 * 서버가 없는 동안 localStorage에 저장합니다.
 * 서버 연동 시 load/save 함수 내부를 API 호출로 교체하면 됩니다.
 */

export interface WikiNeededItem {
  id: string;
  title: string;
}

export interface WikiNeededCategory {
  id: string;
  name: string;
  items: WikiNeededItem[];
}

export const WIKI_NEEDED_MAX_ITEMS = 30;

/** 에디터에서 추가된 문서가 들어가는 고정 탭. 항상 마지막에 위치하며 이름 변경·삭제 불가 */
export const WIKI_NEEDED_UNCATEGORIZED_ID = 'uncategorized';
export const WIKI_NEEDED_UNCATEGORIZED_NAME = '미분류';

const STORAGE_KEY = 'acupedia.wikiNeeded';

export function createWikiNeededId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const toItems = (titles: string[]): WikiNeededItem[] =>
  titles.map((title) => ({ id: createWikiNeededId(), title }));

const DEFAULT_CATEGORIES: WikiNeededCategory[] = [
  {
    id: 'meridian',
    name: '경락경혈',
    items: toItems([
      '수태음폐경', '수양명대장경', '족양명위경', '족태음비경', '수소음심경',
      '수태양소장경', '족태양방광경', '족소음신경', '수궐음심포경', '수소양삼초경',
      '족소양담경', '족궐음간경', '독맥', '임맥', '충맥', '대맥', '음교맥', '양교맥',
      '음유맥', '양유맥', '열결', '소상', '상양', '이간', '삼간', '양계', '편력',
      '온류', '곡지', '견우', '영향', '승읍', '지창', '협거', '하관', '두유', '인영',
    ]),
  },
  {
    id: 'disease',
    name: '질환',
    items: toItems([
      '중풍', '안면마비', '요통', '경항통', '견비통', '슬관절염', '두통', '편두통',
      '불면', '우울증', '소화불량', '변비', '설사', '월경통', '갱년기 증후군', '비염',
      '이명', '어지럼증', '고혈압', '당뇨병성 신경병증', '대상포진 후 신경통',
      '족저근막염', '손목터널증후군', '테니스엘보',
    ]),
  },
  {
    id: 'technique',
    name: '치료기술',
    items: toItems([
      '약침', '전침', '뜸', '부항', '습식부항', '매선', '도침', '이침', '두침',
      '수지침', '화침', '온침', '봉독약침', '추나', '자락', '피내침', '레이저침',
      '경피적 전기신경자극',
    ]),
  },
  {
    id: 'diseaseTreatment',
    name: '질환 + 치료',
    items: toItems([
      '중풍의 전침 치료', '요통의 약침 치료', '안면마비의 뜸 치료', '불면의 이침 치료',
      '월경통의 뜸 치료', '비염의 매선 치료', '견비통의 도침 치료', '슬관절염의 약침 치료',
      '두통의 부항 치료', '소화불량의 복부 뜸 치료',
    ]),
  },
  {
    id: WIKI_NEEDED_UNCATEGORIZED_ID,
    name: WIKI_NEEDED_UNCATEGORIZED_NAME,
    items: toItems(['오수혈', '득기', '침 자극량']),
  },
];

/** 미분류 탭이 항상 하나, 맨 마지막에 오도록 정리 */
function normalizeCategories(categories: WikiNeededCategory[]): WikiNeededCategory[] {
  const others = categories.filter(
    (category) => category.id !== WIKI_NEEDED_UNCATEGORIZED_ID
  );
  const uncategorized = categories.find(
    (category) => category.id === WIKI_NEEDED_UNCATEGORIZED_ID
  );
  return [
    ...others,
    {
      id: WIKI_NEEDED_UNCATEGORIZED_ID,
      name: WIKI_NEEDED_UNCATEGORIZED_NAME,
      items: uncategorized?.items ?? [],
    },
  ];
}

export function loadWikiNeededCategories(): WikiNeededCategory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return normalizeCategories(parsed);
    }
  } catch {
    // 손상된 데이터는 기본값으로 대체
  }
  return normalizeCategories(DEFAULT_CATEGORIES);
}

export function saveWikiNeededCategories(
  categories: WikiNeededCategory[]
): WikiNeededCategory[] {
  const normalized = normalizeCategories(categories);
  // TODO: 서버 연동 시 API 호출로 교체
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

/** 모든 탭에서 같은 제목의 문서를 찾음 */
export function findWikiNeededItemByTitle(
  categories: WikiNeededCategory[],
  title: string
): { category: WikiNeededCategory; item: WikiNeededItem } | null {
  const trimmed = title.trim();
  for (const category of categories) {
    const item = category.items.find((entry) => entry.title === trimmed);
    if (item) return { category, item };
  }
  return null;
}

/** 문서 추가. 이미 어느 탭에든 있으면 추가하지 않고 기존 위치를 반환 */
export function addWikiNeededItem(
  title: string,
  categoryId: string = WIKI_NEEDED_UNCATEGORIZED_ID
):
  | { status: 'added' }
  | { status: 'duplicate'; categoryName: string } {
  const categories = loadWikiNeededCategories();
  const existing = findWikiNeededItemByTitle(categories, title);
  if (existing) {
    return { status: 'duplicate', categoryName: existing.category.name };
  }

  const targetId = categories.some((category) => category.id === categoryId)
    ? categoryId
    : WIKI_NEEDED_UNCATEGORIZED_ID;

  saveWikiNeededCategories(
    categories.map((category) =>
      category.id === targetId
        ? {
            ...category,
            items: [...category.items, { id: createWikiNeededId(), title: title.trim() }],
          }
        : category
    )
  );
  return { status: 'added' };
}

/** 항목 순서를 섞어 최대 limit개만 반환 */
export function pickRandomItems(
  items: WikiNeededItem[],
  limit = WIKI_NEEDED_MAX_ITEMS
): WikiNeededItem[] {
  const shuffled = items.slice();
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, limit);
}
