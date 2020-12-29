import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from './styles.less';

interface EditingProps {
  content: string;
  onChange?: (e: any, s: string) => void;
  onKeyDown?: (e: any, s: string) => void;
  onFocus?: () => void;
}

/**
 * Editing
 */
const Editing: React.FC<EditingProps> = ({ content, onChange, onFocus, onKeyDown }) => {
  const editRef = useRef<HTMLParagraphElement>(null);
  const [value, setValue] = useState<string>(content);

  //触发input事件，改变state并且改变父组件的state
  const handleInput = (event) => {
    const newValue = editRef.current?.innerText || '';
    setValue(newValue);
    if (onChange) {
      onChange(event, newValue);
    }
  };

  //触发键盘事件，拦截回车:自己处理，或者返回给父组件处理
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (onKeyDown) {
        onKeyDown(event, editRef.current?.innerText || '');
      }
    }
  };

  const handleKeyUp = (_event) => {};

  //设置光标到一行的末尾
  const setCursorToEnd = () => {
    if (onFocus && editRef.current) {
      /**
       * 设置光标到最后一个字后面,如果存在则设置为1，否则为0.
       * 如果起始节点类型是 Text， Comment, or CDATASection之一, 那么 startOffset指的是从起始节点算起字符的偏移量。
       * 对于其他 Node 类型节点， startOffset 是指从起始结点开始算起子节点的偏移量。
       */
      const offset = value?.length ? 1 : 0;
      const range = document.createRange();
      range.setStart(editRef.current, offset);
      range.collapse(true);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const setFocus = () => {
    if ((onFocus && editRef.current, editRef.current?.focus)) {
      editRef.current?.focus();
    }
  };

  useEffect(() => {
    setFocus();
    setCursorToEnd();
  }, []);

  const edit = useMemo(
    () => (
      <p
        className={styles.editing}
        contentEditable="true"
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        ref={editRef}
      />
    ),
    [editRef],
  );

  return edit;
};

export default Editing;
