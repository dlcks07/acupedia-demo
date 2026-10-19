import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { addWikiNeededItem } from 'libs/wikiNeeded';

export type WikiLinkSource = 'wiki' | 'archive';

export interface WikiLinkItem {
  id: number;
  title: string;
  type: WikiLinkSource;
  subtitle: string;
}

interface WikiLinkContext {
  query: string;
  node: Text;
  startOffset: number;
  endOffset: number;
}

interface WikiLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: WikiLinkItem) => void;
}

interface WikiLinkAutocompleteProps {
  editor: any | null;
  onInsert: (html: string) => void;
}

/** 데모용 더미 검색 데이터 (실제 연동 시 API로 교체) */
export const WIKI_LINK_SEARCH_ITEMS: WikiLinkItem[] = [
  { id: 210, title: '합곡', type: 'wiki', subtitle: '개별 경혈형 위키' },
  { id: 211, title: '태충', type: 'wiki', subtitle: '개별 경혈형 위키' },
  { id: 212, title: '족삼리', type: 'wiki', subtitle: '개별 경혈형 위키' },
  { id: 301, title: '경근', type: 'wiki', subtitle: '경락 이론형 위키' },
  { id: 302, title: '경혈', type: 'wiki', subtitle: '경락·경혈 이론형 위키' },
  { id: 901, title: '합곡', type: 'archive', subtitle: '학술자료고 · 경혈 연구' },
  { id: 902, title: '내관', type: 'archive', subtitle: '학술자료고 · 경혈 연구' },
  { id: 903, title: '수삼리', type: 'archive', subtitle: '학술자료고 · 경혈 연구' },
  { id: 904, title: '풍지', type: 'archive', subtitle: '학술자료고 · 경혈 연구' },
  { id: 905, title: '경근', type: 'archive', subtitle: '학술자료고 · 경락 이론' },
  { id: 906, title: '경락', type: 'archive', subtitle: '학술자료고 · 경락 이론' },
  { id: 907, title: '팔맥교회혈', type: 'archive', subtitle: '학술자료고 · 배혈·처방' },
];

function escapeHtml(text: string) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/** 마지막 글자 받침 유무로 목적격 조사 을/를 선택 */
function objectParticle(text: string): '을' | '를' {
  const trimmed = String(text || '').trim();
  if (!trimmed) return '을';

  const lastChar = trimmed[trimmed.length - 1];
  const code = lastChar.charCodeAt(0);

  // 한글 음절(가~힣)이 아니면 을 사용
  if (code < 0xac00 || code > 0xd7a3) return '을';

  return (code - 0xac00) % 28 === 0 ? '를' : '을';
}

function withObjectParticle(text: string) {
  const trimmed = String(text || '').trim();
  return `"${trimmed}"${objectParticle(trimmed)}`;
}

export function searchWikiLinkItems(query: string): WikiLinkItem[] {
  const q = String(query || '')
    .trim()
    .toLowerCase();
  if (!q) return [];
  return WIKI_LINK_SEARCH_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(q)
  );
}

export function buildWikiLinkHtml(item: WikiLinkItem, displayText?: string) {
  const text = displayText || item.title;

  if (item.type === 'archive') {
    return (
      `<a class="wiki-link" href="/libraryDetail?title=${encodeURIComponent(
        item.title
      )}" data-source="archive" data-archive-id="${item.id}">` +
      `${escapeHtml(text)}</a>`
    );
  }

  return (
    `<a class="wiki-link" href="/wikiDetail?title=${encodeURIComponent(
      item.title
    )}" data-source="wiki" data-wiki-id="${item.id}">` +
    `${escapeHtml(text)}</a>`
  );
}

/** 작성이 필요한 문서의 미분류 탭에 추가 */
export async function addNeededWikiDocument(title: string): Promise<boolean> {
  const trimmed = String(title || '').trim();
  if (!trimmed) return false;

  const labeled = withObjectParticle(trimmed);
  const confirmed = window.confirm(
    `${labeled} 작성이 필요한 문서로 추가하겠습니까?`
  );
  if (!confirmed) return false;

  const result = addWikiNeededItem(trimmed);
  if (result.status === 'duplicate') {
    toast(
      `"${trimmed}"은(는) 이미 작성이 필요한 문서(${result.categoryName})에 있습니다.`
    );
    return false;
  }

  toast(`${labeled} 작성이 필요한 문서로 추가했습니다.`);
  return true;
}

function findWikiLinkContext(editor: any): WikiLinkContext | null {
  const rng = editor.selection.getRng();
  const node = rng.startContainer;
  if (node.nodeType !== 3) return null;

  const text = node.textContent || '';
  const offset = rng.startOffset;
  const beforeCursor = text.slice(0, offset);
  const match = beforeCursor.match(/\[\[([^\[\]]*)$/);
  if (!match) return null;

  return {
    query: match[1],
    node,
    startOffset: offset - match[0].length,
    endOffset: offset,
  };
}

function insertAtWikiLinkContext(
  editor: any,
  context: WikiLinkContext,
  item: WikiLinkItem
) {
  const rng = editor.dom.createRng();
  rng.setStart(context.node, context.startOffset);
  rng.setEnd(context.node, context.endOffset);
  editor.selection.setRng(rng);
  editor.insertContent(buildWikiLinkHtml(item) + '&nbsp;');
  editor.focus();
}

/** TinyMCE iframe 내부 커서 좌표 → 부모 창 viewport 좌표 */
function getCaretViewportRect(editor: any): {
  top: number;
  bottom: number;
  left: number;
  right: number;
  height: number;
} | null {
  try {
    const rng = editor.selection.getRng();
    let rect: DOMRect | null = null;

    if (rng?.getClientRects) {
      const rects = rng.getClientRects();
      if (rects.length) rect = rects[0];
    }
    if (!rect && rng?.getBoundingClientRect) {
      rect = rng.getBoundingClientRect();
    }
    if (!rect) {
      rect = editor.selection.getBoundingClientRect();
    }
    if (!rect) return null;

    const iframe: HTMLIFrameElement | null =
      editor.iframeElement ||
      editor.getContentAreaContainer?.()?.querySelector?.('iframe') ||
      null;

    if (iframe) {
      const iframeRect = iframe.getBoundingClientRect();
      return {
        top: rect.top + iframeRect.top,
        bottom: rect.bottom + iframeRect.top,
        left: rect.left + iframeRect.left,
        right: rect.right + iframeRect.left,
        height: rect.height || 18,
      };
    }

    return {
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      height: rect.height || 18,
    };
  } catch {
    return null;
  }
}

function itemKey(item: WikiLinkItem) {
  return `${item.type}-${item.id}`;
}

function WikiLinkResultList({
  items,
  selectedItem,
  onSelect,
}: {
  items: WikiLinkItem[];
  selectedItem: WikiLinkItem | null;
  onSelect: (item: WikiLinkItem) => void;
}) {
  return (
    <>
      {items.map((item) => {
        const badge = item.type === 'archive' ? '학술자료고' : '위키';
        const metaClass =
          item.type === 'archive' ? 'wikiLink__meta archive' : 'wikiLink__meta wiki';
        const isSelected =
          selectedItem &&
          selectedItem.id === item.id &&
          selectedItem.type === item.type;

        return (
          <button
            key={itemKey(item)}
            type="button"
            className={`wikiLink__item${isSelected ? ' active' : ''}`}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(item);
            }}
          >
            <span className="wikiLink__itemTitle">{item.title}</span>
            <span className={metaClass}>
              [{badge}] {item.subtitle}
            </span>
          </button>
        );
      })}
    </>
  );
}

function WikiLinkEmptyState({
  message,
  query,
  showAddNeeded,
  onAdded,
}: {
  message: string;
  query: string;
  showAddNeeded: boolean;
  onAdded?: () => void;
}) {
  const handleAddNeeded = async () => {
    const ok = await addNeededWikiDocument(query);
    if (ok) onAdded?.();
  };

  return (
    <div className="wikiLink__empty">
      <p className="wikiLink__emptyMsg">{message}</p>
      {showAddNeeded && (
        <button
          type="button"
          className="wikiLink__addNeededBtn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleAddNeeded}
        >
          {withObjectParticle(query)} 작성이 필요한 문서로 추가하기
        </button>
      )}
    </div>
  );
}

function WikiLinkActionBar({
  canInsert,
  onInsert,
  onCancel,
}: {
  canInsert: boolean;
  onInsert: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="wikiLink__actions">
      <button
        type="button"
        className="wikiLink__btn cancel"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onCancel}
      >
        취소
      </button>
      <button
        type="button"
        className="wikiLink__btn primary"
        disabled={!canInsert}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onInsert}
      >
        링크 삽입
      </button>
    </div>
  );
}

/** 툴바 버튼용: 검색 input이 있는 팝업 */
export function WikiLinkModal({ isOpen, onClose, onSelect }: WikiLinkModalProps) {
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<WikiLinkItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo(() => searchWikiLinkItems(query), [query]);
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const emptyMessage = hasQuery
    ? '검색 결과가 없습니다.'
    : '검색어를 입력해주세요.';

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setSelectedItem(null);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    setSelectedItem(null);
  }, [query]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedItem((prev) => {
        if (!prev) return items[0];
        const idx = items.findIndex(
          (item) => item.id === prev.id && item.type === prev.type
        );
        return items[(idx + 1) % items.length];
      });
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedItem((prev) => {
        if (!prev) return items[items.length - 1];
        const idx = items.findIndex(
          (item) => item.id === prev.id && item.type === prev.type
        );
        return items[(idx - 1 + items.length) % items.length];
      });
      return;
    }
    if (e.key === 'Enter' && selectedItem) {
      e.preventDefault();
      onSelect(selectedItem);
    }
  };

  return (
    <div className="wikiLink__overlay" onClick={onClose}>
      <div
        className="wikiLink__modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="위키링크 검색"
      >
        <div className="wikiLink__modalHeader">
          <strong>위키링크</strong>
          <button
            type="button"
            className="wikiLink__modalClose"
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
        </div>
        <div className="wikiLink__modalBody">
          <input
            ref={inputRef}
            type="text"
            className="wikiLink__searchInput"
            placeholder="검색어를 입력하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="wikiLink__results" role="listbox">
            {items.length ? (
              <WikiLinkResultList
                items={items}
                selectedItem={selectedItem}
                onSelect={setSelectedItem}
              />
            ) : (
              <WikiLinkEmptyState
                message={emptyMessage}
                query={trimmedQuery}
                showAddNeeded={hasQuery}
              />
            )}
          </div>
          <WikiLinkActionBar
            canInsert={!!selectedItem}
            onInsert={() => {
              if (selectedItem) onSelect(selectedItem);
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}

/** 에디터에서 [[ 입력 시 커서 옆 자동완성 */
export function WikiLinkAutocomplete({
  editor,
  onInsert,
}: WikiLinkAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<WikiLinkItem[]>([]);
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<WikiLinkItem | null>(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const contextRef = useRef<WikiLinkContext | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const onInsertRef = useRef(onInsert);
  const updatePositionRef = useRef<() => void>(() => {});
  onInsertRef.current = onInsert;

  const hide = () => {
    contextRef.current = null;
    setOpen(false);
    setItems([]);
    setQuery('');
    setSelectedItem(null);
  };

  const commitInsert = () => {
    const context = contextRef.current;
    if (!editor || !context || !selectedItem) return;
    insertAtWikiLinkContext(editor, context, selectedItem);
    onInsertRef.current(editor.getContent());
    hide();
  };

  useEffect(() => {
    if (!editor) return;

    const updatePosition = () => {
      const rect = getCaretViewportRect(editor);
      if (!rect) return;

      const panelWidth = 320;
      const gap = 6;
      const viewportPad = 12;
      const measuredHeight = dropdownRef.current?.offsetHeight || 280;

      // 기본: 커서 바로 아래, 커서 left에 맞춤
      let left = rect.left;
      let top = rect.bottom + gap;

      if (left + panelWidth > window.innerWidth - viewportPad) {
        left = Math.max(
          viewportPad,
          window.innerWidth - panelWidth - viewportPad
        );
      }
      left = Math.max(viewportPad, left);

      // 아래 공간 부족 시 커서 바로 위
      if (top + measuredHeight > window.innerHeight - viewportPad) {
        top = Math.max(viewportPad, rect.top - measuredHeight - gap);
      }

      setPosition({ left, top });
    };
    updatePositionRef.current = updatePosition;

    const update = () => {
      const context = findWikiLinkContext(editor);
      if (!context) {
        hide();
        return;
      }
      contextRef.current = context;
      setQuery(context.query);
      const nextItems = searchWikiLinkItems(context.query);
      const list =
        context.query.trim().length === 0
          ? WIKI_LINK_SEARCH_ITEMS.slice()
          : nextItems;
      setItems(list);
      setSelectedItem(null);
      updatePosition();
      setOpen(true);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp' ||
        event.key === 'Enter' ||
        event.key === 'Escape'
      ) {
        return;
      }
      update();
    };

    const onInput = () => update();
    const onClick = () => window.setTimeout(update, 0);

    editor.on('keyup', onKeyUp);
    editor.on('input', onInput);
    editor.on('click', onClick);
    editor.on('NodeChange', updatePosition);
    editor.on('ScrollContent', updatePosition);
    editor.on('remove', hide);

    const onDocClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownRef.current?.contains(target)) return;
      if (target.closest?.('.tox-tinymce')) return;
      hide();
    };
    document.addEventListener('mousedown', onDocClick);

    return () => {
      editor.off('keyup', onKeyUp);
      editor.off('input', onInput);
      editor.off('click', onClick);
      editor.off('NodeChange', updatePosition);
      editor.off('ScrollContent', updatePosition);
      editor.off('remove', hide);
      document.removeEventListener('mousedown', onDocClick);
      hide();
    };
  }, [editor]);

  // 드롭다운 실제 렌더 후 높이 반영해 위치 재보정
  useEffect(() => {
    if (!open) return;
    const timer = window.requestAnimationFrame(() => {
      updatePositionRef.current();
    });
    return () => window.cancelAnimationFrame(timer);
  }, [open, items]);

  useEffect(() => {
    if (!editor || !open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (!items.length) return;
        setSelectedItem((prev) => {
          if (!prev) return items[0];
          const idx = items.findIndex(
            (item) => item.id === prev.id && item.type === prev.type
          );
          return items[(idx + 1) % items.length];
        });
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (!items.length) return;
        setSelectedItem((prev) => {
          if (!prev) return items[items.length - 1];
          const idx = items.findIndex(
            (item) => item.id === prev.id && item.type === prev.type
          );
          return items[(idx - 1 + items.length) % items.length];
        });
        return;
      }
      if (event.key === 'Enter' && selectedItem) {
        event.preventDefault();
        commitInsert();
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        hide();
      }
    };

    editor.on('keydown', onKeyDown);
    return () => {
      editor.off('keydown', onKeyDown);
    };
  }, [editor, open, items, selectedItem]);

  if (!open) return null;

  const trimmedQuery = query.trim();
  const showAddNeeded = trimmedQuery.length > 0 && items.length === 0;

  return (
    <div
      ref={dropdownRef}
      className="wikiLink__acDropdown open"
      style={{ left: position.left, top: position.top }}
      role="dialog"
      aria-label="위키링크 자동완성"
    >
      <div className="wikiLink__results wikiLink__results--ac" role="listbox">
        {items.length ? (
          <WikiLinkResultList
            items={items}
            selectedItem={selectedItem}
            onSelect={setSelectedItem}
          />
        ) : (
          <WikiLinkEmptyState
            message={
              trimmedQuery
                ? '검색 결과가 없습니다.'
                : '검색어를 입력해주세요.'
            }
            query={trimmedQuery}
            showAddNeeded={showAddNeeded}
            onAdded={hide}
          />
        )}
      </div>
      <WikiLinkActionBar
        canInsert={!!selectedItem}
        onInsert={commitInsert}
        onCancel={hide}
      />
    </div>
  );
}

export default WikiLinkModal;
