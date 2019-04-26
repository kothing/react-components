# Modal
A React modal with animations.  
React动画特效弹框组件


## Usage 使用
``` javascript
import React from 'react';
import Modal from 'modal';

// include styles
import './modal.css';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { visible: false };
    }

    showModal() {
        this.setState({ visible: true });
    }

    hideModal() {
        this.setState({ visible: false });
    }

    render() {
        return (
            <div>
                <button onClick={this.showModal.bind(this)}>show</button>

                <Modal visible={this.state.visible} onClose={this.hideModal.bind(this)}>
                    <div>Content</div>
                </Modal>
            </div>
        )
    }
}
```

## Props 属性

Property|Type|Default|Description
---|---|---|---
width|number|400|弹框宽度
measure|string|px|测定的高和宽
onClose|func|/|弹框关闭后的回调函数
onAnimationEnd|func|/|动画结束后的回调函数
visible|bool|false|是否显示对话框
showMask|bool|true|是否显示蒙层
closeOnEsc|bool|false|按ESC键是否关闭弹框
closeMaskOnClick|bool|true|点击蒙层Mask是否关闭弹框
showCloseIcon|bool|true|是否显示关闭按钮
showModalHeader|bool|true|是否显示页眉标题
showModalFooter|bool|true|是否显示页脚按钮
animation|string|zoom|动画类型
enterAnimation|string|/|显示弹框时的动画类型(优先级高于'animation')
leaveAnimation|string|/|隐藏弹框时的动画类型(优先级高于'animation')
duration|number|300|动画停留时间
className|string|/|弹框的容器类名
customStyles|object|/|自定义样式
customMaskStyles|object|/|自定义蒙层样式

## Animation Types 动画类型
* zoom
* fade
* flip
* door
* rotate
* slideUp
* slideDown
* slideLeft
* slideRight
