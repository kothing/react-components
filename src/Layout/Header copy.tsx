import React, { FC, CSSProperties, ReactNode } from "react";
import { WrapperClassName } from "./index";

/**
 * Header
 */
interface PropsType {
  className?: string;
  fixed?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

const Header: FC<PropsType> = ({
  className,
  fixed = true,
  style,
  children,
}) => (
  <div
    className={`${WrapperClassName}-header${fixed ? " fixed" : ""}${
      className ? ` ${className}` : ""
    }`}
    style={style}
  >
    {children}
  </div>
);

export default Header;
