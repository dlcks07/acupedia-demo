import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Editor } from '@toast-ui/react-editor';
import { useRef } from 'react';
import axiosInstance from './AxiosInstance';
import 'styles/editor.css';

interface Props {
  oldString: string;
  setNewString: Dispatch<SetStateAction<string>>;
}

function TUI({ oldString, setNewString }: Props) {
  const ref = useRef<Editor>(null);
  const [editor, setEditor] = useState({ html: '', md: '' });
  const jwtToken = sessionStorage.getItem('jwtToken');
  // console.log(editor);

  const onChange = React.useCallback(() => {
    const editor_instance = ref.current?.getInstance();
    if (editor_instance) {
      setEditor({
        html: editor_instance?.getHTML(),
        md: editor_instance?.getMarkdown()
      });
      setNewString(editor_instance?.getMarkdown());
    }
  }, []);
  // console.log(editor);

  useEffect(() => {
    if (ref.current) {
      ref.current.getInstance().removeHook('addImageBlobHook');
      ref.current.getInstance().addHook('addImageBlobHook', (blob, callback) => {
        (async () => {
          console.log(blob);

          const formData = new FormData();
          formData.append('wikiImage', blob);

          // axiosInstance.defaults.withCredentials = true;
          const response = await axiosInstance.post('/image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${jwtToken}`
            }
          });

          if (response.status === 200) {
            callback(response.data.data.imageUrl, blob.name);
          }
        })();

        return false;
      });
    }

    return () => {};
  }, [ref]);

  return (
    <Editor
      customHTMLRenderer={{
        tip(node: any, context) {
          console.log(node.literal);

          return [
            { type: 'openTag', tagName: 'p' },
            { type: 'html', content: `${node.literal}입력함` },
            { type: 'closeTag', tagName: 'p' }
          ];
        },
        tmp(node: any, context) {
          console.log(node.literal);

          return [
            {
              type: 'openTag',
              tagName: 'a',
              attributes: {
                href: 'http://ui.toast.com',
                title: 'TOAST UI'
              }
            },
            { type: 'html', content: `${node.literal}` },
            { type: 'closeTag', tagName: 'a' }
          ];
        }
      }}
      usageStatistics={false}
      ref={ref}
      initialValue={oldString}
      language="ko"
      previewStyle="tab"
      height="600px"
      hideModeSwitch={true}
      onChange={onChange}
    />
  );
}

export default TUI;
