import React, { Component, CSSProperties, ReactNode } from "react";
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
interface StateType {}

class Header extends Component<PropsType, StateType> {
  public name: string = "Header";
  state: StateType = {};

  static defaultProps = {
    fixed: true,
  };

  render() {
    const { className, fixed, style, children } = this.props;
    return (
      <div
        className={`${WrapperClassName}-header${fixed ? " fixed" : ""}${
          className ? ` ${className}` : ""
        }`}
        style={style}
      >
        {children}
      </div>
    );
  }
}

export default Header;
