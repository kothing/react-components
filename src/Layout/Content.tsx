import React, { FC, CSSProperties, ReactNode } from "react";
import { WrapperClassName } from "./index";

/**
 * Content
 */
interface PropsType {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}
const Content: FC<PropsType> = ({ className, style, children }) => {
  return (
    <div
      className={`${WrapperClassName}-content${
        className ? ` ${className}` : ""
      }`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Content;
