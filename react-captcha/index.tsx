/**
 * Captcha
 * @width canvas width
 * @height canvas height
 * @type 'blend' | 'number' | 'letter'
 * @numbers [0-9]
 * @letters [a-z,A-Z]
 * @length response string's length
 * @className canvas class name
 * @style response CSS Properties
 * @onChange code change callback
 * @onInputChange input value change callback
 */

import React, { useRef, useState, useEffect, useCallback, CSSProperties, MutableRefObject } from 'react';
import classnames from 'classnames';

type LowerLetter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';
type UpperLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';
type Letter = LowerLetter | UpperLetter;
type CodeType = 'blend' | 'number' | 'letter';

interface CaptchaProps {
  // canvas width
  width?: number;
  // canvas height
  height?: number;
  // response validate code
  type?: CodeType;
  // [0-9]
  numbers?: number[];
  // [a-z,A-Z]
  letters?: Letter[];
  // response string's length
  length?: number;
  // canvas class name
  className?: string;
  // code change callback
  style?: CSSProperties;
  // canvas ref
  ref?: MutableRefObject<HTMLDivElement | null>;
  // code change callback
  onChange?: (captcha: string) => void;
  // code change callback
  onInputChange?: (value: string, validation: boolean) => void;
}

// warning
const warning = (message: any) => {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
};

// switch type
const switchTypeAndSetStringToArray = (type: string, numbers: any[], letters: any[]) => {
  let txtArr = [];
  switch (type) {
    case 'blend':
      txtArr = numbers.concat(letters);
      break;
    case 'number':
      txtArr = numbers;
      break;
    case 'letter':
      txtArr = letters;
      break;
    default:
      txtArr = letters;
  }
  return txtArr;
};

// random num
const randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// random color
const randomColor = (min: number, max: number) => {
  return `rgb(${randomNum(min, max)}, ${randomNum(min, max)}, ${randomNum(min, max)})`;
};

// draw lines
const drawLine = (
  ctx: CanvasRenderingContext2D,
  color: string,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) => {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
};

// draw point
const drawPoint = (
  ctx: CanvasRenderingContext2D,
  color: string,
  x: number,
  y: number,
  r: number,
  sAngle: number,
  eAngle: number,
) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, sAngle, eAngle);
  ctx.fill();
};

// draw text
const drawTxt = (
  ctx: CanvasRenderingContext2D,
  length: number,
  txtArr: string | any[],
  width: number,
  height: number,
) => {
  let newCode = '';
  for (let i = 1; i <= length; i += 1) {
    const txt = txtArr[randomNum(0, txtArr.length)];
    newCode += txt;
    // random font size
    // ctx.font = `${randomNum(height / 1.2, height)}px SimHei`;
    ctx.font = `${randomNum(height / 1.2, height)}px serif`;
    // random font color
    ctx.fillStyle = randomColor(50, 160);
    ctx.shadowOffsetX = randomNum(-3, 3);
    ctx.shadowOffsetY = randomNum(-3, 3);
    ctx.shadowBlur = randomNum(-3, 3);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    const x = (width / (length + 1)) * i;
    const y = height / 2;
    const deg = randomNum(-30, 30);
    // set translate deg ,origin of coordinates
    ctx.translate(x, y);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillText(txt, 0, 0);
    // reset translate deg ,origin of coordinates
    ctx.rotate((-deg * Math.PI) / 180);
    ctx.translate(-x, -y);
  }
  return newCode;
};

// default props
const defaultProps = {
  width: 100,
  height: 30,
  type: 'blend',
  length: 4,
  letters: 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(
    ',',
  ),
  numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  className: '',
  style: { cursor: 'pointer' },
};

/**
 * Captcha Function components
 */
const Captcha: React.FC<CaptchaProps> = ({
  width = defaultProps.width,
  height = defaultProps.height,
  type = defaultProps.type,
  length = defaultProps.length,
  letters = defaultProps.letters,
  numbers = defaultProps.numbers,
  className = defaultProps.className,
  style = defaultProps.style,
  onChange,
  onInputChange,
}) => {
  const [captchaValue, setCaptchaValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [validation, setValidation] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // start draw
  const draw = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'middle';
        ctx.fillStyle = randomColor(220, 255);
        ctx.fillRect(0, 0, width, height);
        // switch type
        const txtArr = switchTypeAndSetStringToArray(type, numbers, letters);
        // draw txt
        const newCode = drawTxt(ctx, length, txtArr, width, height);
        // draw line
        for (let i = 0; i < length; i += 1) {
          drawLine(
            ctx,
            randomColor(180, 255),
            randomNum(0, width),
            randomNum(0, height),
            randomNum(0, width),
            randomNum(0, height),
          );
        }
        // draw point
        for (let i = 0; i < width / length; i += 1) {
          drawPoint(
            ctx,
            randomColor(0, 255),
            randomNum(0, width),
            randomNum(0, height),
            1,
            0,
            2 * Math.PI,
          );
        }

        setCaptchaValue(newCode);
        setValidation(inputValue === newCode.toLowerCase());

        // callback
        if (onChange) {
          onChange(newCode);
        }
      }
    } else {
      warning('Can not use canvas');
      return false;
    }
    return true;
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputValue]);

  useEffect(() => {
    draw();
  }, []);

  const inputOnChange = (e: any) => {
    if (e.target.value.length <= length) {
      setInputValue(e.target.value);
      setValidation(e.target.value === captchaValue.toLowerCase());
      if (onInputChange) {
        onInputChange(e.target.value, e.target.value === captchaValue.toLowerCase());
      }
    } else {
      setValidation(e.target.value.substr(0, length) === captchaValue.toLowerCase());
      if (onInputChange) {
        onInputChange(
          e.target.value.substr(0, length),
          e.target.value.substr(0, length) === captchaValue.toLowerCase(),
        );
      }
    }
  };

  const validTips = () => {
    let tips: HTMLSpanElement | any = '';
    if (inputValue.length === length) {
      tips = validation ? (
        <span style={{ color: '#52c41a' }}>True</span>
      ) : (
        <span style={{ color: '#ff0000' }}>False</span>
      );
    }
    return tips;
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={(e) => inputOnChange(e)} ref={inputRef} />
      {validTips()}
      <canvas
        ref={canvasRef}
        className={classnames('react-captcha', className)}
        onClick={() => draw()}
        style={style}
        height={height}
        width={width}
      />
    </div>
  );
};

export default Captcha;
