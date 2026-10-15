/**
 * 본문(content)에서 meta description 을 생성하는 유틸.
 *
 * 처리 순서
 *  1) script / style / iframe / table / figure / pre / code 등 불필요 블록 제거
 *  2) 이미지(img, 마크다운 이미지) 제거
 *  3) HTML 태그 제거 + HTML 엔티티 디코드
 *  4) 마크다운 문법 제거 (구버전 Toast UI 문서 대응)
 *  5) [1], [2], [..] 같은 각주 번호 제거
 *  6) 연속 공백 / 줄바꿈 정리
 *  7) 첫 번째로 "내용이 충분한" 문단 추출 (기본 40자 이상)
 *  8) 공백 포함 약 90~110자에서 문장 단위로 컷
 */

export const DEFAULT_MIN_LENGTH = 90; // 목표 최소 길이
export const DEFAULT_MAX_LENGTH = 110; // 목표 최대 길이
export const DEFAULT_PARAGRAPH_MIN_LENGTH = 40; // "내용이 충분한 문단" 기준
const SENTENCE_OVERFLOW_TOLERANCE = 20; // 110자 안에 문장 끝이 없을 때 허용 초과분
const MIN_ACCEPTABLE_LENGTH = 20; // 이보다 짧으면 fallback 사용

export interface BuildMetaDescriptionOptions {
  minLength?: number;
  maxLength?: number;
  paragraphMinLength?: number;
}

const ENTITY_MAP: Record<string, string> = {
  '&nbsp;': ' ',
  '&ensp;': ' ',
  '&emsp;': ' ',
  '&thinsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&#39;': "'",
  '&middot;': '·',
  '&hellip;': '…',
  '&ldquo;': '\u201C',
  '&rdquo;': '\u201D',
  '&lsquo;': '\u2018',
  '&rsquo;': '\u2019',
  '&mdash;': '—',
  '&ndash;': '–',
};

function decodeEntities(text: string): string {
  return text.replace(/&[a-zA-Z]+;|&#\d+;|&#x[0-9a-fA-F]+;/g, (m) => {
    if (ENTITY_MAP[m] !== undefined) return ENTITY_MAP[m];
    const dec = m.match(/^&#(\d+);$/);
    if (dec) return String.fromCodePoint(Number(dec[1]));
    const hex = m.match(/^&#x([0-9a-fA-F]+);$/);
    if (hex) return String.fromCodePoint(parseInt(hex[1], 16));
    return ' ';
  });
}

function looksLikeHtml(raw: string): boolean {
  return /<\/?[a-z][a-z0-9]*\b[^>]*>/i.test(raw);
}

/** script / style / 이미지 / 표 등 불필요 요소 제거 + HTML 태그 제거 */
function stripHtml(raw: string): string {
  let s = raw;

  // 주석
  s = s.replace(/<!--[\s\S]*?-->/g, ' ');

  // script / style / 미디어 블록 통째로 제거
  s = s.replace(
    /<(script|style|noscript|iframe|svg|canvas|video|audio|object|embed|map)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
    ' '
  );

  // 표 / 그림 / 코드 블록 통째로 제거
  s = s.replace(/<(table|figure|figcaption|pre|code|form)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ');

  // 각주(sup.footnote 포함) 통째로 제거
  s = s.replace(/<sup\b[^>]*>[\s\S]*?<\/sup\s*>/gi, '');

  // void 태그: br 은 줄바꿈, 나머지(img 등)는 공백
  s = s.replace(/<(img|br|hr|input|source|track)\b[^>]*\/?>/gi, (m) =>
    /^<br/i.test(m) ? '\n' : ' '
  );

  // 블록 종료 태그를 줄바꿈으로 → 문단 경계 보존
  s = s.replace(
    /<\/(p|div|li|ul|ol|h[1-6]|tr|blockquote|section|article|header|footer|dd|dt)\s*>/gi,
    '\n'
  );

  // 나머지 태그 제거
  s = s.replace(/<[^>]*>/g, ' ');

  return decodeEntities(s);
}

/** 구버전(Toast UI) 마크다운 문법 제거 */
function stripMarkdown(raw: string): string {
  let s = raw;
  s = s.replace(/```[\s\S]*?```/g, ' '); // 코드 펜스
  s = s.replace(/~~~[\s\S]*?~~~/g, ' ');
  s = s.replace(/`([^`\n]*)`/g, '$1'); // 인라인 코드
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, ' '); // 이미지
  s = s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1'); // 링크 → 텍스트만
  s = s.replace(/^[^\S\n]*\|.*\|[^\S\n]*$/gm, ' '); // 표 행
  s = s.replace(/^[^\S\n]{0,3}#{1,6}[^\S\n]+/gm, ''); // 헤딩
  s = s.replace(/^[^\S\n]{0,3}>[^\S\n]?/gm, ''); // 인용
  s = s.replace(/^[^\S\n]{0,3}([-*_][^\S\n]*){3,}$/gm, ' '); // 수평선
  s = s.replace(/^[^\S\n]{0,3}={3,}[^\S\n]*$/gm, ' '); // setext 제목 밑줄
  s = s.replace(/^[^\S\n]*([-*+]|\d+[.)])[^\S\n]+/gm, ''); // 리스트 마커
  s = s.replace(/^[^\S\n]*\[[ xX]?\][^\S\n]*/gm, ''); // 체크박스 마커
  s = s.replace(/\*\*\*|\*\*|___|__|~~/g, ''); // 강조
  s = s.replace(/(^|[\s(])[*_]([^*_\n]+)[*_](?=[\s).,!?]|$)/g, '$1$2');
  return s;
}

/** [1], [2], [..] 같은 각주 번호 제거 */
function removeFootnoteMarks(text: string): string {
  return text
    .replace(/\[\s*\d{1,3}\s*\]/g, '')
    .replace(/\[\s*\.{2,3}\s*\]/g, '')
    .replace(/\[\s*(주|각주|note|ref)\s*\d{0,3}\s*\]/gi, '');
}

/** 네비게이션·breadcrumb·출전 표기 등 본문이 아닌 줄인지 판별 */
function looksLikeNavigation(p: string): boolean {
  if ((p.match(/[>\u203A\u00BB]/g) || []).length >= 2) return true;
  if (/^\s*\[?(출전|출처|참고문헌|연관 컨텐츠|목차)\b/.test(p)) return true;
  const punct = (p.match(/[[\]()<>|;,\u00B7]/g) || []).length;
  return punct / p.length > 0.25;
}

function toParagraphs(text: string): string[] {
  return text
    .split(/\n+/)
    .map((p) => p.replace(/[\s\u00a0\u200b]+/g, ' ').trim())
    .filter((p) => p.length > 0);
}

/** 문장 종료 위치(마침표/물음표/느낌표 뒤) 목록 */
function findSentenceEnds(text: string): number[] {
  const ends: number[] = [];
  const terminators = '.!?。！？…';
  const closing = '"\'\u201D\u2019)]』」》〉';

  for (let i = 0; i < text.length; i += 1) {
    if (terminators.indexOf(text[i]) === -1) continue;

    let j = i;
    while (j + 1 < text.length && terminators.indexOf(text[j + 1]) !== -1) j += 1;

    let k = j;
    while (k + 1 < text.length && closing.indexOf(text[k + 1]) !== -1) k += 1;

    const next = text[k + 1];
    if (next === undefined || /\s/.test(next)) ends.push(k + 1);
    i = j;
  }
  return ends;
}

/** 약 min~max 자 사이에서 문장 단위로 자르기 */
export function cutBySentence(
  text: string,
  minLength: number = DEFAULT_MIN_LENGTH,
  maxLength: number = DEFAULT_MAX_LENGTH
): string {
  const t = text.trim();
  if (t.length <= maxLength) return t;

  const ends = findSentenceEnds(t);

  // 1) max 이내에서 가장 뒤쪽 문장 끝
  const within = ends.filter((e) => e <= maxLength);
  const best = within.length ? within[within.length - 1] : 0;
  if (best >= minLength) return t.slice(0, best).trim();

  // 2) max 를 조금 넘더라도 가장 가까운 문장 끝 허용
  const overflow = ends.find(
    (e) => e > maxLength && e <= maxLength + SENTENCE_OVERFLOW_TOLERANCE
  );
  if (overflow) return t.slice(0, overflow).trim();

  // 3) 문장 끝이 없으면 어절 단위로 자르고 말줄임표
  const head = t.slice(0, maxLength);
  const lastSpace = head.lastIndexOf(' ');
  const cut = lastSpace >= minLength ? head.slice(0, lastSpace) : head;
  return `${cut.replace(/[\s,、·]+$/, '')}…`;
}

/** HTML/마크다운 본문 → 순수 텍스트 */
export function extractPlainText(raw?: string | null): string {
  if (!raw || typeof raw !== 'string') return '';

  const isHtml = looksLikeHtml(raw);
  let text = isHtml ? stripHtml(raw) : stripMarkdown(raw);
  if (isHtml) text = stripMarkdown(text); // HTML 안에 남은 마크다운 잔재 정리

  text = removeFootnoteMarks(text);
  text = text
    .replace(/\r\n?/g, '\n')
    .replace(/[^\S\n]+/g, ' ') // 연속 공백
    .replace(/\n{2,}/g, '\n'); // 연속 줄바꿈

  return text.trim();
}

/** 본문 → meta description */
export function buildMetaDescription(
  raw?: string | null,
  fallback = '',
  options: BuildMetaDescriptionOptions = {}
): string {
  const {
    minLength = DEFAULT_MIN_LENGTH,
    maxLength = DEFAULT_MAX_LENGTH,
    paragraphMinLength = DEFAULT_PARAGRAPH_MIN_LENGTH,
  } = options;

  const plain = extractPlainText(raw);
  if (!plain) return fallback;

  const paragraphs = toParagraphs(plain);
  if (paragraphs.length === 0) return fallback;

  // 첫 번째로 내용이 충분한 문단 (breadcrumb / 출전 표기 등은 건너뜀)
  let startIndex = paragraphs.findIndex(
    (p) => p.length >= paragraphMinLength && !looksLikeNavigation(p)
  );
  if (startIndex === -1) {
    startIndex = paragraphs.findIndex((p) => p.length >= paragraphMinLength);
  }
  if (startIndex === -1) startIndex = 0;

  // 최소 길이에 못 미치면 다음 문단을 이어붙임
  let candidate = paragraphs[startIndex];
  for (let i = startIndex + 1; i < paragraphs.length && candidate.length < minLength; i += 1) {
    if (looksLikeNavigation(paragraphs[i])) continue;
    candidate = `${candidate} ${paragraphs[i]}`;
  }

  const description = cutBySentence(candidate, minLength, maxLength);
  if (!description || description.length < MIN_ACCEPTABLE_LENGTH) return fallback;
  return description;
}

export default buildMetaDescription;