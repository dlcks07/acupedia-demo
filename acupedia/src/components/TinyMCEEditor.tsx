import { Editor } from '@tinymce/tinymce-react';
// import axiosInstance from 'components/AxiosInstance';
import { Dispatch, SetStateAction, useState } from 'react';
import React from 'react';
import '../styles/tinyeditor.css';

interface Props {
  oldString: string;
  setNewString: Dispatch<SetStateAction<string>>;
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

function TinyMCEEditor({ oldString, setNewString }: Props) {
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
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number } | null>(null);

  const handleEditorChange = (content: string, editor: any) => {
    setEditor({ html: content, md: editor.getContent() });
    setNewString(editor.getContent());
  };

  interface UploadFailure {
    message: string;
    remove?: boolean;
  }

  type ProgressFn = (percent: number) => void;
  type UploadHandler = (blobInfo: BlobInfo, progress: ProgressFn) => Promise<string>;

  const example_image_upload_handler: UploadHandler = (_blobInfo: any, progress: ProgressFn) =>
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
        apiKey="yklugaruw5igysliyx4ndawsdg2qfzeznw7u7czb5uwwjt2d"
        initialValue={oldString || ``}
        onEditorChange={handleEditorChange}
        onInit={(evt, editor) => {
          setTinymceEditor(editor);
          const existing = editor.dom.select('sup.footnote')?.length || 0;
          setQuoteCount(existing + 1);
          renumberFootnotes(editor); // 혹시 기존 footnote 있으면 정렬
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
          toolbar:
            ' blocks | forecolor backcolor |' +
            ' fontsize fontfamily |' +
            ' bold italic underline strikethrough |' +
            ' alignjustify alignleft aligncenter alignright |' +
            ' bullist numlist |' +
            ' quoteButton |' +
            ' table tabledelete |' +
            ' link image',
          //block_formats: 'Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3',
          block_formats: '본문=p; 제목 1=h1; 제목 2=h2; 제목 3=h3',
          font_family_formats:
            '굴림체=Gulim;돋움체=Dotum;바탕체=Batang;궁서체=Gungsuh;나눔고딕=nanumgothic;나눔명조=Nanum Myoungjo;나눔붓글씨=nanumbrushscript',
          fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
          content_style: `
            body {font-family: nanumgothic, sans-serif; font-size: 12pt;}
            .footnote {
              color: #1976d2;
              font-size: 0.85em;
              cursor: pointer;
            }`,

          setup: (editor) => {
            // 인용버튼 추가
            editor.ui.registry.addButton('quoteButton', {
              icon: 'quote',
              tooltip: '인용 삽입',
              onAction: () => {
                setQuoteInput('');
                setQuoteEditInfo({ id: null, text: null });
                const placeholderId = `quote-placeholder-${Date.now()}`;
                editor.insertContent(
                  `<sup class="footnote" id="${placeholderId}" data-footnote="">[..]</sup>`
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
              if (target && target.classList && target.classList.contains('footnote')) {
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
            {quoteEditInfo.id && quoteEditInfo.text ? '인용문 수정' : '인용문 입력'}
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
                  if (tinymceEditor && quoteEditInfo.id && !quoteEditInfo.text) {
                    const node = tinymceEditor.dom.get(quoteEditInfo.id);
                    if (node) {
                      tinymceEditor.dom.remove(node);
                      renumberFootnotes(tinymceEditor);
                      handleEditorChange(tinymceEditor.getContent(), tinymceEditor);
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
                    (quoteEditInfo.id && tinymceEditor.dom.get(quoteEditInfo.id)) ||
                    tinymceEditor.selection.getNode();

                  const node =
                    rawNode && (rawNode as HTMLElement).classList?.contains('footnote')
                      ? (rawNode as HTMLElement)
                      : null;

                  // 입력 없으면 삭제
                  if (!quoteInput.trim()) {
                    if (node) {
                      tinymceEditor.dom.remove(node);
                      renumberFootnotes(tinymceEditor);
                      handleEditorChange(tinymceEditor.getContent(), tinymceEditor);
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
                    const nodes = tinymceEditor.dom.select('sup.footnote') as HTMLElement[];
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