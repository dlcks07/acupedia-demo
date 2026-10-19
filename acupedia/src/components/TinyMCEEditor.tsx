import { Editor } from '@tinymce/tinymce-react';
// import axiosInstance from 'components/AxiosInstance';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import React from 'react';
import '../styles/tinyeditor.css';
import {
  WikiLinkAutocomplete,
  WikiLinkItem,
  WikiLinkModal,
  buildWikiLinkHtml,
} from './WikiLink';
import { WikiContentRequest } from './WikiType';

interface Props {
  oldString: string;
  setNewString: Dispatch<SetStateAction<string>>;
  initialTemplate?: string;
  contentRequest?: WikiContentRequest | null;
  onBindEditor?: (getText: () => string) => void;
}

interface BlobInfo {
  id: () => string;
  name: () => string;
  filename: () => string;
  blob: () => Blob;
  base64: () => string;
  blobUri: () => string;
  uri: () => string | undefined;
}

function stripHeadingNumber(text: string) {
  return String(text || '')
    .replace(/^\d+(?:\.\d+)*\.?\s+/, '')
    .trim();
}

function applyHeadingNumbers(headings: HTMLElement[]) {
  let h2Count = 0;
  let h3Count = 0;

  headings.forEach((heading) => {
    const title = stripHeadingNumber(heading.textContent || '');
    const tag = heading.tagName.toLowerCase();

    if (tag === 'h2') {
      h2Count += 1;
      h3Count = 0;
      heading.textContent = `${h2Count}. ${title}`;
      return;
    }

    if (tag === 'h3') {
      h3Count += 1;
      const major = h2Count > 0 ? h2Count : 0;
      heading.textContent = `${major}.${h3Count} ${title}`;
    }
  });
}

function generateTableOfContents(
  editor: any,
  onContentChange?: (html: string) => void,
) {
  const body = editor.getBody() as HTMLElement;
  const oldToc = body.querySelector('.acupedia-toc');
  if (oldToc) oldToc.remove();

  const headings = Array.from(body.querySelectorAll('h2, h3')) as HTMLElement[];

  if (headings.length === 0) {
    editor.notificationManager.open({
      text: '목차로 만들 제목이 없습니다.',
      type: 'info',
    });
    return;
  }

  applyHeadingNumbers(headings);

  headings.forEach((heading, index) => {
    heading.id = `wiki-section-${index + 1}`;
  });

  const toc = document.createElement('div');
  toc.className = 'acupedia-toc';
  toc.setAttribute('contenteditable', 'false');

  const tocHeader = document.createElement('div');
  tocHeader.className = 'acupedia-toc-header';
  tocHeader.innerHTML = `
    <span>목차</span>
    <span class="acupedia-toc-toggle">접기</span>
  `;
  toc.appendChild(tocHeader);

  const tocList = document.createElement('div');
  tocList.className = 'acupedia-toc-list';

  headings.forEach((heading) => {
    const item = document.createElement('div');
    const level =
      heading.tagName.toLowerCase() === 'h3' ? 'toc-level-2' : 'toc-level-1';
    item.className = `toc-item ${level}`;

    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;

    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = editor.getBody().querySelector(`#${heading.id}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    item.appendChild(link);
    tocList.appendChild(item);
  });

  toc.appendChild(tocList);
  headings[0].parentNode?.insertBefore(toc, headings[0]);

  const toggle = toc.querySelector(
    '.acupedia-toc-toggle',
  ) as HTMLElement | null;
  toggle?.addEventListener('click', () => {
    const isHidden = tocList.style.display === 'none';
    tocList.style.display = isHidden ? 'block' : 'none';
    toggle.textContent = isHidden ? '접기' : '펼치기';
  });

  onContentChange?.(editor.getContent());
}

function TinyMCEEditor({
  oldString,
  setNewString,
  initialTemplate,
  contentRequest,
  onBindEditor,
}: Props) {
  const [editor, setEditor] = useState({ html: '', md: '' });
  // const jwtToken = sessionStorage.getItem('jwtToken');

  // 인용구 입력 모달창
  const [isQuoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteInput, setQuoteInput] = useState('');
  const [quoteEditInfo, setQuoteEditInfo] = useState<{
    id: string | null;
    text: string | null;
  }>({ id: null, text: null });
  const [tinymceEditor, setTinymceEditor] = useState<any>(null);
  const [quoteCount, setQuoteCount] = useState(1);
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [isWikiLinkModalOpen, setWikiLinkModalOpen] = useState(false);
  const wikiLinkBookmarkRef = useRef<any>(null);
  const appliedRequestKey = useRef<number | null>(null);
  const setNewStringRef = useRef(setNewString);
  setNewStringRef.current = setNewString;

  const insertWikiLinkAtCursor = (item: WikiLinkItem) => {
    if (!tinymceEditor) return;

    tinymceEditor.focus();
    if (wikiLinkBookmarkRef.current) {
      try {
        tinymceEditor.selection.moveToBookmark(wikiLinkBookmarkRef.current);
      } catch {
        // bookmark 복원 실패 시 현재 커서 위치 사용
      }
    }
    tinymceEditor.insertContent(buildWikiLinkHtml(item) + '&nbsp;');
    handleEditorChange(tinymceEditor.getContent(), tinymceEditor);
    wikiLinkBookmarkRef.current = null;
    setWikiLinkModalOpen(false);
  };

  useEffect(() => {
    if (!tinymceEditor || !contentRequest) return;
    if (appliedRequestKey.current === contentRequest.key) return;

    tinymceEditor.setContent(contentRequest.html);
    generateTableOfContents(tinymceEditor, (html) =>
      setNewStringRef.current(html),
    );
    appliedRequestKey.current = contentRequest.key;
  }, [tinymceEditor, contentRequest]);

  const handleEditorChange = (content: string, editor: any) => {
    setEditor({ html: content, md: editor.getContent() });
    setNewString(editor.getContent());
  };

  interface UploadFailure {
    message: string;
    remove?: boolean;
  }

  type ProgressFn = (percent: number) => void;
  type UploadHandler = (
    blobInfo: BlobInfo,
    progress: ProgressFn,
  ) => Promise<string>;

  const example_image_upload_handler: UploadHandler = (
    _blobInfo: any,
    progress: ProgressFn,
  ) =>
    new Promise((resolve) => {
      // const xhr = new XMLHttpRequest();
      // xhr.withCredentials = false;
      // xhr.open('POST', `${process.env.REACT_APP_API_URL}/image`);
      // xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);
      // xhr.send(formData);
      progress(100);
      resolve(`${process.env.PUBLIC_URL || ''}/icons/acupedia.png`);
    });

  // 에디터 안의 모든 footnote 번호를 DOM 순서대로 재정렬
  const renumberFootnotes = (editor: any) => {
    const nodes = editor.dom.select('sup.footnote') as HTMLElement[];
    nodes.forEach((node, index) => {
      const newNum = index + 1;
      node.innerHTML = `[${newNum}]`;
      node.id = `footnote-${newNum}`;
    });
  };

  // sup.footnote 바로 "뒤"에 '보이지 않는 텍스트 노드'를 만들고, 그 안에 커서 두기
  const moveCursorAfterFootnote = (editor: any, node: HTMLElement) => {
    const doc = editor.getDoc();
    if (!doc) return;

    const parent = node.parentNode;
    if (!parent) return;

    const zwsp = doc.createTextNode('\u200B'); // &#8203;

    if (node.nextSibling) {
      parent.insertBefore(zwsp, node.nextSibling);
    } else {
      parent.appendChild(zwsp);
    }

    const rng = doc.createRange();
    rng.setStart(zwsp, 1);
    rng.setEnd(zwsp, 1);

    editor.selection.setRng(rng);
    editor.focus();
  };

  return (
    <>
      <Editor
        apiKey="ablbmf6tndkwhkcqx9m0u9x20jm8xakx56kluvrf76eb7ka3"
        initialValue={oldString || ``}
        onEditorChange={handleEditorChange}
        onInit={(_evt, editor) => {
          const existing = editor.dom.select('sup.footnote')?.length || 0;
          setQuoteCount(existing + 1);
          renumberFootnotes(editor);
        }}
        init={{
          language: 'ko_KR',
          height: 600,
          menubar: true,
          paste_as_text: true,
          images_upload_handler: example_image_upload_handler,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'print',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'paste',
            'code',
            'help',
            'wordcount',
            'save',
          ],
          toolbar_mode: 'wrap',
          toolbar: [
            'blocks | forecolor backcolor | fontsize fontfamily | bold italic underline strikethrough | alignjustify alignleft aligncenter alignright | bullist numlist | quoteButton generateToc wikiLinkButton',
            'table tabledelete | link image',
          ],
          //block_formats: 'Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3',
          block_formats: '본문=p; 제목 1=h1; 제목 2=h2; 제목 3=h3',
          font_family_formats:
            '굴림체=Gulim;돋움체=Dotum;바탕체=Batang;궁서체=Gungsuh;나눔고딕=nanumgothic;나눔명조=Nanum Myoungjo;나눔붓글씨=nanumbrushscript',
          fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
          init_instance_callback: (editor) => {
            setTinymceEditor(editor);
            onBindEditor?.(() => editor.getContent({ format: 'text' }));
            if (!oldString && initialTemplate) {
              editor.setContent(initialTemplate);
              generateTableOfContents(editor, (html) =>
                setNewStringRef.current(html),
              );
            }
          },
          content_style: `
            body {font-family: nanumgothic, sans-serif; font-size: 12pt; line-height: 1.8;}
            h1 {
              font-size: 30px;
              padding-bottom: 12px;
              border-bottom: 2px solid #333;
            }
            h2 {
              font-size: 22px;
              margin-top: 38px;
              padding-bottom: 7px;
              border-bottom: 1px solid #dadde0;
            }
            h3 {
              margin-top: 25px;
              font-size: 18px;
            }
            .footnote {
              color: #1976d2;
              font-size: 0.85em;
              cursor: pointer;
            }
            .guide-box {
              background: #f4f6f8;
              color: #727c86;
              border: 1px dashed #bfc6cd;
              border-left: 4px solid #0a2996;
              padding: 11px 14px;
              border-radius: 4px;
            }
            .acupedia-toc {
              display: inline-block;
              min-width: 260px;
              max-width: 420px;
              margin: 18px 0 28px;
              border: 1px solid #c8ccd1;
              background: #ffffff;
              font-size: 14px;
            }
            .acupedia-toc-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 11px 14px;
              font-weight: 700;
              border-bottom: 1px solid #e2e4e7;
              background: #fafafa;
            }
            .acupedia-toc-toggle {
              font-size: 12px;
              font-weight: 500;
              color: #555;
              cursor: pointer;
            }
            .acupedia-toc-list {
              padding: 10px 14px 12px;
            }
            .toc-item {
              line-height: 1.8;
            }
            .toc-level-1 {
              padding-left: 0;
            }
            .toc-level-2 {
              padding-left: 20px;
            }
            .acupedia-toc a {
              color: #1769aa;
              text-decoration: none;
            }
            .acupedia-toc a:hover {
              text-decoration: underline;
            }
            a.wiki-link {
              color: #1769aa;
              text-decoration: none;
              border-bottom: 1px solid rgba(23, 105, 170, 0.35);
            }
            a.wiki-link[data-source="archive"] {
              color: #9a3412;
              border-bottom-color: rgba(154, 52, 18, 0.35);
            }`,

          setup: (editor) => {
            editor.ui.registry.addButton('generateToc', {
              text: '목차 생성/갱신',
              onAction: () => {
                generateTableOfContents(editor, (html) =>
                  setNewStringRef.current(html),
                );
              },
            });

            editor.ui.registry.addButton('wikiLinkButton', {
              text: '📖 위키링크',
              tooltip: '위키·학술자료고 링크 삽입',
              onAction: () => {
                wikiLinkBookmarkRef.current = editor.selection.getBookmark(
                  2,
                  true,
                );
                setWikiLinkModalOpen(true);
              },
            });

            // 인용버튼 추가
            editor.ui.registry.addButton('quoteButton', {
              icon: 'quote',
              tooltip: '인용 삽입',
              onAction: () => {
                setQuoteInput('');
                setQuoteEditInfo({ id: null, text: null });
                const placeholderId = `quote-placeholder-${Date.now()}`;
                editor.insertContent(
                  `<sup class="footnote" id="${placeholderId}" data-footnote="">[..]</sup>`,
                );

                setTimeout(() => {
                  const modalWidth = 500;
                  const modalHeight = 200;
                  const x = window.innerWidth / 2 - modalWidth / 2;
                  const y = window.innerHeight / 2 - modalHeight / 2;
                  setPopoverPos({ x, y });
                  setQuoteModalOpen(true);
                  setQuoteEditInfo({ id: placeholderId, text: '' });
                }, 0);
              },
            });

            // 인용 클릭 시 수정 모드
            editor.on('click', (e: any) => {
              const target = e.target as HTMLElement;
              if (
                target &&
                target.classList &&
                target.classList.contains('footnote')
              ) {
                const currentText = target.getAttribute('data-footnote') || '';
                setQuoteInput(currentText);
                setQuoteEditInfo({ id: target.id || null, text: currentText });

                const modalWidth = 500;
                const modalHeight = 200;
                const x = window.innerWidth / 2 - modalWidth / 2;
                const y = window.innerHeight / 2 - modalHeight / 2;
                setPopoverPos({ x, y });
                setQuoteModalOpen(true);
              }
            });
          },
        }}
      />

      <WikiLinkAutocomplete
        editor={tinymceEditor}
        onInsert={(html) => {
          if (tinymceEditor) {
            handleEditorChange(html, tinymceEditor);
          }
        }}
      />

      <WikiLinkModal
        isOpen={isWikiLinkModalOpen}
        onClose={() => {
          setWikiLinkModalOpen(false);
          wikiLinkBookmarkRef.current = null;
        }}
        onSelect={insertWikiLinkAtCursor}
      />

      {/* Quote Modal */}
      {isQuoteModalOpen && popoverPos && (
        <div
          className="tinyeditor-modal"
          style={{
            position: 'fixed',
            left: `50%`,
            top: `50%`,
            transform: `translate(-50%, -50%)`,
            zIndex: 9999,
          }}
        >
          <h3 className="tinyeditor-modal-title">
            {quoteEditInfo.id && quoteEditInfo.text
              ? '인용문 수정'
              : '인용문 입력'}
          </h3>
          <div className="tinyeditor-modal-cnt">
            <textarea
              className="tinyeditor-modal-textarea"
              value={quoteInput}
              onChange={(e) => setQuoteInput(e.target.value)}
              placeholder="인용 내용을 입력하세요"
              autoFocus
            />
            <div className="tinyeditor-modal-actions">
              <button
                onClick={() => {
                  // placeholder 상태에서 취소 시 삭제
                  if (
                    tinymceEditor &&
                    quoteEditInfo.id &&
                    !quoteEditInfo.text
                  ) {
                    const node = tinymceEditor.dom.get(quoteEditInfo.id);
                    if (node) {
                      tinymceEditor.dom.remove(node);
                      renumberFootnotes(tinymceEditor);
                      handleEditorChange(
                        tinymceEditor.getContent(),
                        tinymceEditor,
                      );
                    }
                  }
                  setQuoteModalOpen(false);
                  setPopoverPos(null);
                  setQuoteInput('');
                  setQuoteEditInfo({ id: null, text: null });
                }}
                className="tinyeditor-modal-btn cancel"
              >
                취소
              </button>

              <button
                onClick={() => {
                  if (!tinymceEditor) return;

                  const rawNode =
                    (quoteEditInfo.id &&
                      tinymceEditor.dom.get(quoteEditInfo.id)) ||
                    tinymceEditor.selection.getNode();

                  const node =
                    rawNode &&
                    (rawNode as HTMLElement).classList?.contains('footnote')
                      ? (rawNode as HTMLElement)
                      : null;

                  // 입력 없으면 삭제
                  if (!quoteInput.trim()) {
                    if (node) {
                      tinymceEditor.dom.remove(node);
                      renumberFootnotes(tinymceEditor);
                      handleEditorChange(
                        tinymceEditor.getContent(),
                        tinymceEditor,
                      );
                    }
                    setQuoteModalOpen(false);
                    setQuoteInput('');
                    setQuoteEditInfo({ id: null, text: null });
                    setPopoverPos(null);
                    return;
                  }

                  let targetFoot: HTMLElement | null = null;

                  if (node) {
                    // 기존 인용 수정
                    node.setAttribute('data-footnote', quoteInput);
                    targetFoot = node;
                  } else {
                    // 새 인용 추가
                    const html = `<sup class="footnote" data-footnote="${quoteInput}">[..]</sup>`;
                    tinymceEditor.insertContent(html);

                    // 방금 삽입된 마지막 footnote
                    const nodes = tinymceEditor.dom.select(
                      'sup.footnote',
                    ) as HTMLElement[];
                    targetFoot = nodes.length ? nodes[nodes.length - 1] : null;
                  }

                  // 번호 재배열
                  renumberFootnotes(tinymceEditor);

                  // footnote 뒤로 커서 이동 (sup 바깥)
                  if (targetFoot) {
                    moveCursorAfterFootnote(tinymceEditor, targetFoot);
                  }

                  // 에디터 상태 동기화
                  handleEditorChange(tinymceEditor.getContent(), tinymceEditor);

                  // 모달 정리
                  setQuoteModalOpen(false);
                  setQuoteInput('');
                  setQuoteEditInfo({ id: null, text: null });
                  setPopoverPos(null);
                }}
                className="tinyeditor-modal-btn"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TinyMCEEditor;
