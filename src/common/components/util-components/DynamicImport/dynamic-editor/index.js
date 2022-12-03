import React,  from "react";
import dynamic from "next/dynamic"

const Editor = dynamic(() => import('../../WapperEditor'), { ssr: false })

const EditorWithForwardedRef = React.forwardRef((props, ref) => (
  <Editor {...props} forwardedRef={ref} />
))


export default EditorWithForwardedRef;