import dynamic from 'next/dynamic';
import React, { useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';

const Editor = dynamic(() => import('@toast-ui/react-editor')
  .then(m => m.Editor), { ssr: false });

const ToastEditorComponent = (props) => {
  const editorRef = useRef(null);

  return (
    <Editor
      initialValue={props.initialValue}
      previewStyle="vertical"
      height={props.height}
      initialEditType={props.initialEditType}
      useCommandShortcut={true}
      editorStyle={{
        padding: "0 8px",
        borderRadius: "0 0 .625rem .625rem",
        minHeight: "65vh",
        maxHeight: "65vh",
        overflow: "hidden auto",
        border: "1px solid #F1F1F1"
      }}
      ref={editorRef}
    />
)}

export default ToastEditorComponent;