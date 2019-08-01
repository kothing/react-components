# React Toast

## Usage

```js
import Toast from './Toast';

class Button extends React.Component {
  handleShowToast = () => {
    Toast.info('message...', 3000, () => {
      // do something after the toast disappears
    });
  };

  render() {
    return <div onClick={this.handleShowToast}>btn</div>;
  }
}
```

## API

```js
Toast.info(content, duration, onClose);
Toast.success(content, duration, onClose);
Toast.fail(content, duration, onClose);
Toast.loading(content, onClose);
Toast.hide();
```

| param    | detail                                    | type     | default |
| -------- | ----------------------------------------- | -------- | ------- |
| content  | toast message                             | string   |         |
| duration | milliseconds delay to close               | number   | 3000    |
| onClose  | callback function after closing the toast | function |         |

## Notice

If you use `Toast.loading()`, you should call `Toast.hide()` by yourself to close the toast,  
since this often happens when you make an asynchronous request.

When you are in loading state, you can call `Toast.info()`, `Toast.success()`, `Toast.fail()` directly to hide the loading message. This is useful when you want to hint something after waiting.
