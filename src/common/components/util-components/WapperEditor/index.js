import React from 'react'
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const WrappedEditor = (props) => {
  const { forwardedRef } = props;

  return <Editor
    {...props}
    ref={forwardedRef}
    usageStatistics={false}
  />
}

export default WrappedEditor;