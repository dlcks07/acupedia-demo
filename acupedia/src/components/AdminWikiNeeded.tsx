import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { cls } from 'libs/utils';
import {
  createWikiNeededId,
  loadWikiNeededCategories,
  saveWikiNeededCategories,
  WikiNeededCategory,
  WikiNeededItem,
  WIKI_NEEDED_MAX_ITEMS,
  WIKI_NEEDED_UNCATEGORIZED_ID,
  WIKI_NEEDED_UNCATEGORIZED_NAME,
} from 'libs/wikiNeeded';

const ALL_ID = '__all__';
const RESERVED_NAMES = ['전체', WIKI_NEEDED_UNCATEGORIZED_NAME];

interface EditingCategory {
  id: string;
  value: string;
}

interface EditingItem {
  id: string;
  categoryId: string;
  title: string;
  targetCategoryId: string;
}

interface ItemRow {
  item: WikiNeededItem;
  category: WikiNeededCategory;
}

function AdminWikiNeeded() {
  const [categories, setCategories] = useState<WikiNeededCategory[]>(
    loadWikiNeededCategories
  );
  const [selectedId, setSelectedId] = useState<string>(ALL_ID);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategoryId, setNewItemCategoryId] = useState(
    WIKI_NEEDED_UNCATEGORIZED_ID
  );
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);

  const regularCategories = categories.filter(
    (category) => category.id !== WIKI_NEEDED_UNCATEGORIZED_ID
  );
  const uncategorized = categories.find(
    (category) => category.id === WIKI_NEEDED_UNCATEGORIZED_ID
  );
  const totalCount = categories.reduce(
    (sum, category) => sum + category.items.length,
    0
  );
  const selected =
    selectedId === ALL_ID
      ? null
      : categories.find((category) => category.id === selectedId) || null;

  const rows: ItemRow[] =
    selectedId === ALL_ID
      ? categories.flatMap((category) =>
          category.items.map((item) => ({ item, category }))
        )
      : selected
        ? selected.items.map((item) => ({ item, category: selected }))
        : [];

  const commit = (next: WikiNeededCategory[]) => {
    setCategories(saveWikiNeededCategories(next));
  };

  const selectTab = (id: string) => {
    setSelectedId(id);
    setEditingItem(null);
    setNewItemCategoryId(id === ALL_ID ? WIKI_NEEDED_UNCATEGORIZED_ID : id);
  };

  const isNameTaken = (name: string, exceptId?: string) =>
    RESERVED_NAMES.includes(name) ||
    categories.some((category) => category.name === name && category.id !== exceptId);

  /* ---------- 탭(카테고리) ---------- */

  const onAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name) {
      toast('탭 이름을 입력해주세요.');
      return;
    }
    if (isNameTaken(name)) {
      toast('사용할 수 없거나 이미 있는 탭 이름입니다.');
      return;
    }
    const category: WikiNeededCategory = {
      id: createWikiNeededId(),
      name,
      items: [],
    };
    commit([...regularCategories, category, ...(uncategorized ? [uncategorized] : [])]);
    selectTab(category.id);
    setNewCategoryName('');
    toast(`"${name}" 탭을 추가했습니다.`);
  };

  const onSaveCategoryName = () => {
    if (!editingCategory) return;
    const name = editingCategory.value.trim();
    if (!name) {
      toast('탭 이름을 입력해주세요.');
      return;
    }
    if (isNameTaken(name, editingCategory.id)) {
      toast('사용할 수 없거나 이미 있는 탭 이름입니다.');
      return;
    }
    commit(
      categories.map((category) =>
        category.id === editingCategory.id ? { ...category, name } : category
      )
    );
    setEditingCategory(null);
    toast('탭 이름을 수정했습니다.');
  };

  const onDeleteCategory = (category: WikiNeededCategory) => {
    const message =
      category.items.length > 0
        ? `"${category.name}" 탭을 삭제하시겠습니까?\n포함된 문서 ${category.items.length}개는 미분류로 이동합니다.`
        : `"${category.name}" 탭을 삭제하시겠습니까?`;
    if (!window.confirm(message)) return;

    const next = categories
      .filter((item) => item.id !== category.id)
      .map((item) => {
        if (item.id !== WIKI_NEEDED_UNCATEGORIZED_ID) return item;
        const titles = new Set(item.items.map((entry) => entry.title));
        const moved = category.items.filter((entry) => !titles.has(entry.title));
        return { ...item, items: [...item.items, ...moved] };
      });
    commit(next);
    if (selectedId === category.id) selectTab(ALL_ID);
    toast(`"${category.name}" 탭을 삭제했습니다.`);
  };

  const onMoveCategory = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= regularCategories.length) return;
    const next = regularCategories.slice();
    [next[index], next[target]] = [next[target], next[index]];
    commit([...next, ...(uncategorized ? [uncategorized] : [])]);
  };

  /* ---------- 문서 항목 ---------- */

  const onAddItem = () => {
    const title = newItemTitle.trim();
    if (!title) {
      toast('문서명을 입력해주세요.');
      return;
    }
    const target = categories.find((category) => category.id === newItemCategoryId);
    if (!target) return;
    if (target.items.some((item) => item.title === title)) {
      toast(`"${target.name}" 탭에 이미 등록된 문서입니다.`);
      return;
    }
    commit(
      categories.map((category) =>
        category.id === target.id
          ? { ...category, items: [...category.items, { id: createWikiNeededId(), title }] }
          : category
      )
    );
    setNewItemTitle('');
    toast(`"${title}" 문서를 ${target.name}에 추가했습니다.`);
  };

  const startEditItem = (row: ItemRow) => {
    setEditingItem({
      id: row.item.id,
      categoryId: row.category.id,
      title: row.item.title,
      targetCategoryId: row.category.id,
    });
  };

  const onSaveItem = () => {
    if (!editingItem) return;
    const title = editingItem.title.trim();
    if (!title) {
      toast('문서명을 입력해주세요.');
      return;
    }
    const target = categories.find(
      (category) => category.id === editingItem.targetCategoryId
    );
    if (!target) return;
    if (
      target.items.some(
        (item) => item.title === title && item.id !== editingItem.id
      )
    ) {
      toast(`"${target.name}" 탭에 이미 등록된 문서입니다.`);
      return;
    }

    const updated: WikiNeededItem = { id: editingItem.id, title };
    const isMoving = editingItem.categoryId !== editingItem.targetCategoryId;

    commit(
      categories.map((category) => {
        if (!isMoving && category.id === editingItem.categoryId) {
          return {
            ...category,
            items: category.items.map((item) =>
              item.id === editingItem.id ? updated : item
            ),
          };
        }
        if (isMoving && category.id === editingItem.categoryId) {
          return {
            ...category,
            items: category.items.filter((item) => item.id !== editingItem.id),
          };
        }
        if (isMoving && category.id === editingItem.targetCategoryId) {
          return { ...category, items: [...category.items, updated] };
        }
        return category;
      })
    );
    setEditingItem(null);
    toast(isMoving ? `"${title}" 문서를 ${target.name}(으)로 옮겼습니다.` : '문서를 수정했습니다.');
  };

  const onDeleteItem = (row: ItemRow) => {
    if (!window.confirm(`"${row.item.title}" 문서를 삭제하시겠습니까?`)) return;
    commit(
      categories.map((category) =>
        category.id === row.category.id
          ? { ...category, items: category.items.filter((item) => item.id !== row.item.id) }
          : category
      )
    );
    toast(`"${row.item.title}" 문서를 삭제했습니다.`);
  };

  const onEnter =
    (action: () => void) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        action();
      }
    };

  const categoryOptions = categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name}
    </option>
  ));

  return (
    <div className="adminNeeded">
      <div className="adminNeeded__heading">작성이 필요한 문서 편집</div>
      <p className="adminNeeded__desc">
        탭과 문서를 추가·수정·삭제하면 「작성이 필요한 문서」 페이지에 바로
        반영됩니다. 페이지에는 탭마다 문서가 무작위로 최대{' '}
        {WIKI_NEEDED_MAX_ITEMS}개까지 표시됩니다. 에디터에서 사용자가 추가한
        문서는 미분류에 들어갑니다.
      </p>

      <div className="adminNeeded__panes">
        {/* 탭 목록 */}
        <section className="adminNeeded__pane adminNeeded__pane--tabs">
          <div className="adminNeeded__paneHeader">
            탭 목록 <span className="adminNeeded__count">{categories.length}개</span>
          </div>

          <ul className="adminNeeded__list">
            <li
              className={cls(
                'adminNeeded__row adminNeeded__row--fixed',
                selectedId === ALL_ID ? 'active' : ''
              )}
              onClick={() => selectTab(ALL_ID)}
            >
              <span className="adminNeeded__rowText">
                전체
                <span className="adminNeeded__count">{totalCount}</span>
              </span>
            </li>

            {regularCategories.map((category, index) => {
              const isEditing = editingCategory?.id === category.id;
              return (
                <li
                  key={category.id}
                  className={cls(
                    'adminNeeded__row',
                    category.id === selectedId ? 'active' : ''
                  )}
                  onClick={() => !isEditing && selectTab(category.id)}
                >
                  {isEditing ? (
                    <input
                      className="adminNeeded__input"
                      value={editingCategory.value}
                      onChange={(e) =>
                        setEditingCategory({ id: category.id, value: e.target.value })
                      }
                      onKeyDown={onEnter(onSaveCategoryName)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  ) : (
                    <span className="adminNeeded__rowText">
                      {category.name}
                      <span className="adminNeeded__count">
                        {category.items.length}
                      </span>
                    </span>
                  )}

                  <div
                    className="adminNeeded__rowBtns"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isEditing ? (
                      <>
                        <button type="button" className="adminNeeded__btn primary" onClick={onSaveCategoryName}>
                          저장
                        </button>
                        <button type="button" className="adminNeeded__btn" onClick={() => setEditingCategory(null)}>
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="adminNeeded__btn icon"
                          onClick={() => onMoveCategory(index, -1)}
                          disabled={index === 0}
                          aria-label="위로 이동"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          className="adminNeeded__btn icon"
                          onClick={() => onMoveCategory(index, 1)}
                          disabled={index === regularCategories.length - 1}
                          aria-label="아래로 이동"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          className="adminNeeded__btn"
                          onClick={() =>
                            setEditingCategory({ id: category.id, value: category.name })
                          }
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="adminNeeded__btn danger"
                          onClick={() => onDeleteCategory(category)}
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}

            {uncategorized && (
              <li
                className={cls(
                  'adminNeeded__row adminNeeded__row--fixed',
                  selectedId === uncategorized.id ? 'active' : ''
                )}
                onClick={() => selectTab(uncategorized.id)}
              >
                <span className="adminNeeded__rowText">
                  {uncategorized.name}
                  <span className="adminNeeded__count">
                    {uncategorized.items.length}
                  </span>
                </span>
                <span className="adminNeeded__fixedTag">고정</span>
              </li>
            )}
          </ul>

          <div className="adminNeeded__addRow">
            <input
              className="adminNeeded__input"
              placeholder="새 탭 이름"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={onEnter(onAddCategory)}
            />
            <button type="button" className="adminNeeded__btn primary" onClick={onAddCategory}>
              탭 추가
            </button>
          </div>
        </section>

        {/* 문서 목록 */}
        <section className="adminNeeded__pane">
          <div className="adminNeeded__paneHeader">
            {selected ? `${selected.name} 문서 목록` : '전체 문서 목록'}
            <span className="adminNeeded__count">{rows.length}개</span>
          </div>

          <div className="adminNeeded__addRow">
            <input
              className="adminNeeded__input"
              placeholder="추가할 문서명"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              onKeyDown={onEnter(onAddItem)}
            />
            <select
              className="adminNeeded__select"
              value={newItemCategoryId}
              onChange={(e) => setNewItemCategoryId(e.target.value)}
              aria-label="추가할 분류"
            >
              {categoryOptions}
            </select>
            <button type="button" className="adminNeeded__btn primary" onClick={onAddItem}>
              문서 추가
            </button>
          </div>

          <ul className="adminNeeded__list adminNeeded__list--items">
            {rows.length === 0 && (
              <li className="adminNeeded__empty">등록된 문서가 없습니다.</li>
            )}
            {rows.map((row, index) => {
              const isEditing = editingItem?.id === row.item.id;
              return (
                <li key={row.item.id} className="adminNeeded__row">
                  <span className="adminNeeded__no">{index + 1}</span>
                  {isEditing ? (
                    <>
                      <input
                        className="adminNeeded__input"
                        value={editingItem.title}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, title: e.target.value })
                        }
                        onKeyDown={onEnter(onSaveItem)}
                        autoFocus
                      />
                      <select
                        className="adminNeeded__select"
                        value={editingItem.targetCategoryId}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, targetCategoryId: e.target.value })
                        }
                        aria-label="분류 변경"
                      >
                        {categoryOptions}
                      </select>
                    </>
                  ) : (
                    <>
                      <span className="adminNeeded__rowText">{row.item.title}</span>
                      <span
                        className={cls(
                          'adminNeeded__catBadge',
                          row.category.id === WIKI_NEEDED_UNCATEGORIZED_ID
                            ? 'uncategorized'
                            : ''
                        )}
                      >
                        {row.category.name}
                      </span>
                    </>
                  )}
                  <div className="adminNeeded__rowBtns">
                    {isEditing ? (
                      <>
                        <button type="button" className="adminNeeded__btn primary" onClick={onSaveItem}>
                          저장
                        </button>
                        <button type="button" className="adminNeeded__btn" onClick={() => setEditingItem(null)}>
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="adminNeeded__btn"
                          onClick={() => startEditItem(row)}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="adminNeeded__btn danger"
                          onClick={() => onDeleteItem(row)}
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AdminWikiNeeded;
