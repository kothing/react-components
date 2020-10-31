import React, { Component, CSSProperties, ReactNode } from "react";
import { WrapperClassName } from "./index";

/**
 * Footer
 */
interface PropsType {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}
interface StateType {}

class Footer extends Component<PropsType, StateType> {
  public name: string = "Footer";
  render() {
    const { className, style, children } = this.props;
    return (
      <div
        className={`${WrapperClassName}-footer${
          className ? ` ${className}` : ""
        }`}
        style={style}
      >
        {children}
      </div>
    );
  }
}

export default Footer;
