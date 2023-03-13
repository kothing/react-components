import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from './styles.css';

interface EditingProps {
  content?: string;
  onChange?: (s: string) => void;
}
/**
 * Editing
 * @param { content, onChange }
 */
const Editing: React.FC<EditingProps> = ({ content, onChange }) => {
  const [value, setValue] = useState<string>(content || '');
  const editRef = useRef<HTMLDivElement>(null);

  const onInput = () => {
    const newValue = editRef.current?.innerText || '';
    if (onChange) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    if (content === editRef.current?.innerText && content !== value) {
      setValue(content || '');
    }
  }, [content, value]);

  const edit = useMemo(
    () => (
      <div
        ref={editRef}
        className={styles.editing}
        contentEditable="true"
        suppressContentEditableWarning
        onInput={onInput}
      >
        {value}
      </div>
    ),
    [editRef],
  );

  return edit;
};

export default Editing;
