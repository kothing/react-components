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
import './style.css';

type LowerLetter =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';
type UpperLetter =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';
type Letter = LowerLetter | UpperLetter;
type CodeType = 'blend' | 'number' | 'letter';

interface CaptchaProps {
  // canvas width
  width?: number;
  // canvas height
  height?: number;
  // response validate code
  type?: CodeType | string;
  // [0-9]
  numbers?: number[];
  // [a-z,A-Z]
  letters?: Letter[] | string[];
  // response string's length
  length?: number;
  // canvas class name
  className?: string;
  // code change callback
  style?: CSSProperties;
  // input placeholder
  placeholder?: string;
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
  let txtArr: any[] = [];
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
  let captchaTxt = '';
  for (let i = 1; i <= length; i += 1) {
    const txt = txtArr[randomNum(0, txtArr.length)];
    captchaTxt += txt;
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
  return captchaTxt;
};

// custom hook
const useRefCallback = (fn: () => void, dependencies: any) => {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
};

// default props
const defaultProps = {
  width: 150,
  height: 30,
  type: 'blend',
  length: 4,
  letters: 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(
    ',',
  ),
  numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  className: '',
  style: { cursor: 'pointer' },
  placeholder: 'Insert captcha',
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
  placeholder = defaultProps.placeholder,
  onChange,
  onInputChange,
}: CaptchaProps) => {
  const [captchaValue, setCaptchaValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [validation, setValidation] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // start draw
  const draw = useRefCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'middle';
        ctx.fillStyle = randomColor(255, 255);
        ctx.fillRect(0, 0, width, height);
        // switch type
        const txtArr = switchTypeAndSetStringToArray(type, numbers, letters);
        // draw txt
        const captchaValue = drawTxt(ctx, length, txtArr, width, height);
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
          drawPoint(ctx, randomColor(0, 255), randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI);
        }
        // set captcha value
        setCaptchaValue(captchaValue);
        // set validation
        setValidation(inputValue === captchaValue.toLowerCase());
        // callback
        if (onChange) {
          onChange(captchaValue);
        }
      }
    } else {
      warning('Can not use canvas');
    }
  }, [width, height, type, numbers, letters, length, inputValue, onChange]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputValue]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Refresh
  const handleRefresh = () => {
    draw();
  };

  // PlayAudio
  const handlePlayAudio = () => {
    const audio = new SpeechSynthesisUtterance(captchaValue.toString().split('').join(' '));
    audio.rate = 0.6;
    window.speechSynthesis.speak(audio);
  };

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
    <div className={classnames('react-captcha', className)}>
      <div className="captcha-row">
        <canvas
          ref={canvasRef}
          onClick={() => draw()}
          style={style}
          height={height}
          width={width}
          className="captcha-canvas"
        />
        <div className="captcha-column">
          <button type="button" onClick={handleRefresh} className="captcha-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g data-name="Layer 2">
                <g data-name="refresh">
                  <rect width="24" height="24" opacity="0" />
                  <path d="M20.3 13.43a1 1 0 0 0-1.25.65A7.14 7.14 0 0 1 12.18 19 7.1 7.1 0 0 1 5 12a7.1 7.1 0 0 1 7.18-7 7.26 7.26 0 0 1 4.65 1.67l-2.17-.36a1 1 0 0 0-1.15.83 1 1 0 0 0 .83 1.15l4.24.7h.17a1 1 0 0 0 .34-.06.33.33 0 0 0 .1-.06.78.78 0 0 0 .2-.11l.09-.11c0-.05.09-.09.13-.15s0-.1.05-.14a1.34 1.34 0 0 0 .07-.18l.75-4a1 1 0 0 0-2-.38l-.27 1.45A9.21 9.21 0 0 0 12.18 3 9.1 9.1 0 0 0 3 12a9.1 9.1 0 0 0 9.18 9A9.12 9.12 0 0 0 21 14.68a1 1 0 0 0-.7-1.25z" />
                </g>
              </g>
            </svg>
          </button>
          <button
            type="button"
            aria-label="play audio"
            onClick={handlePlayAudio}
            className="captcha-button"
            data-testid="captcha-audio"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g data-name="Layer 2">
                <g data-name="volume-up">
                  <rect width="24" height="24" opacity="0" />
                  <path d="M18.28 8.37a1 1 0 1 0-1.56 1.26 4 4 0 0 1 0 4.74A1 1 0 0 0 17.5 16a1 1 0 0 0 .78-.37 6 6 0 0 0 0-7.26z" />
                  <path d="M19.64 5.23a1 1 0 1 0-1.28 1.54A6.8 6.8 0 0 1 21 12a6.8 6.8 0 0 1-2.64 5.23 1 1 0 0 0-.13 1.41A1 1 0 0 0 19 19a1 1 0 0 0 .64-.23A8.75 8.75 0 0 0 23 12a8.75 8.75 0 0 0-3.36-6.77z" />
                  <path d="M15 3.12a1 1 0 0 0-1 0L7.52 7.57h-5a1 1 0 0 0-1 1v6.86a1 1 0 0 0 1 1h5l6.41 4.4a1.06 1.06 0 0 0 .57.17 1 1 0 0 0 1-1V4a1 1 0 0 0-.5-.88zm-1.47 15L8.4 14.6a1 1 0 0 0-.57-.17H3.5V9.57h4.33a1 1 0 0 0 .57-.17l5.1-3.5z" />
                </g>
              </g>
            </svg>
          </button>
        </div>
      </div>
      <div className="captcha-row">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => inputOnChange(e)}
          placeholder={placeholder}
          className="captcha-input captcha-ui-input"
        />
      </div>
      <div className="captcha-row">{validTips()}</div>
    </div>
  );
};

export default Captcha;
