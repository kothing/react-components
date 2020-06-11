# react-captcha

# Usage

**example**

```
import React from 'react'
import ReactDOM from 'react-dom';
import Captcha from './react-captcha'

class App extends React.Component {
    render() {
        return (
            <>
              <Captcha />
            </>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
```
**Props**:

Prop | Default | Type | Description
---- |---------| ---- |-----------
width | 100 | number | canvas width
height | 30 | number | canvas height
type | "blend" | string | response validate code
numbers | [0-9] | array | [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
letters | [a-z,A-Z] | array | ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
length | 4 | number | response string's length
className | 'react-captcha' | string | canvas class name
style | - | - | response CSS Properties
onChange | value=>void | func | code change callback
```

# LICENSE
MIT
