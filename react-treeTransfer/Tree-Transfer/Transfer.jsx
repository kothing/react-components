import React, { Component } from 'react';
import _ from 'lodash';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import Treex from './Treex';
import { convertTreeToArray, convertArrayToTree, getParentKeyArray, getParentKeyArrayObj, makeKVArray, mergeArrayData, compareInitData } from './util/MakeTreeData';
import './transfer.less';

/**
 * 组件类
 */
class Transfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftTreeDataInit: props.leftTreeData,
            rightTreeDataInit: props.rightTreeData,
            leftTreeData: props.leftTreeData,
            rightTreeData: props.rightTreeData,
            leftCheckedKeys: [],
            rightCheckedKeys: [],
            leftExpandedKeys: [],
            rightExpandedKeys: [],
            updateFrom: ''
        };
    }

	/**
	 * 接收新的Props
	 */
    componentWillReceiveProps(nextProps) {
        if(!_.isEqual(this.props.leftTreeData, nextProps.leftTreeData) || !_.isEqual(this.props.rightTreeData, nextProps.rightTreeData)) {
            this.setState({
                leftTreeDataInit: nextProps.leftTreeData,
                rightTreeDataInit: nextProps.rightTreeData,
                leftTreeData: nextProps.leftTreeData,
                rightTreeData: nextProps.rightTreeData
            });
        }
    }	
	
	/**
	 * 创建Ref
     * @param {String} ref
	 */
    createRef = (ref) => {
        const _this = this;
        return (node) => {
            _this[ref] = node;
        };
    };

	/**
	 * 设置展开
	 */

    handleExpand(expandedKeys, key) {
        let expandedKeysVar = key === 'left' ? 'leftExpandedKeys' : 'rightExpandedKeys';
        this.setState({
            [expandedKeysVar]: expandedKeys,
            updateFrom: 'expand'
        });
        console.log(`${expandedKeysVar}:`, expandedKeys);
    }

	/**
	 * 设置选中值
	 */
    handleCheck = (checkedKeys, key) => {
        let checkedKeysVar = key === 'left' ? 'leftCheckedKeys' : 'rightCheckedKeys';
        this.setState({
            [checkedKeysVar]: checkedKeys,
            updateFrom: 'check'
        });
        console.log(`${checkedKeysVar}`, checkedKeys);
    }


	/**
	 * 穿梭操作
	 *@param {String} key 
	 */
    handleTransClick = (key) => {
        let _this = this;
        let { leftTreeDataInit, rightTreeDataInit, leftTreeData, rightTreeData, leftCheckedKeys, rightCheckedKeys, leftExpandedKeys, rightExpandedKeys } = _this.state;
        let leftArrayDataInit = _.cloneDeep(convertTreeToArray(leftTreeDataInit));
        let rightArrayDataInit = _.cloneDeep(convertTreeToArray(rightTreeDataInit));
        let leftArrayData = _.cloneDeep(convertTreeToArray(leftTreeData));
        let rightArrayData = _.cloneDeep(convertTreeToArray(rightTreeData));
        let allArrayData = mergeArrayData(_.cloneDeep(leftArrayData), _.cloneDeep(rightArrayData));
        let newLeftArrayData = [];
        let newRightArrayData = [];
        let newLeftExpandedKeys = [];
        let newRightExpandedKeys = [];
        if (key === 'allToRight' || key === 'toRight') {
            let checkedKeys = key === 'allToRight' ? leftArrayData.map(item => item.key) : leftCheckedKeys;
            newLeftArrayData = _.pullAllBy(_.cloneDeep(leftArrayData), makeKVArray(checkedKeys), 'key');
            newRightArrayData = compareInitData(mergeArrayData(getParentKeyArrayObj(checkedKeys, allArrayData), _.cloneDeep(rightArrayData)),  _.cloneDeep(rightArrayDataInit));
            newLeftExpandedKeys = Array.from(new Set(leftExpandedKeys.concat(_this.leftTree.state.expandedKeys)));
            newRightExpandedKeys = getParentKeyArray(checkedKeys, newRightArrayData);
        } else if (key === 'allToLeft' || key === 'toLeft') {
            let checkedKeys = key === 'allToLeft' ? rightArrayData.map(item => item.key) : rightCheckedKeys;
            newLeftArrayData = compareInitData(mergeArrayData(getParentKeyArrayObj(checkedKeys, allArrayData), _.cloneDeep(leftArrayData)), _.cloneDeep(leftArrayDataInit));
            newRightArrayData = _.pullAllBy(_.cloneDeep(rightArrayData), makeKVArray(checkedKeys), 'key');
            newLeftExpandedKeys = getParentKeyArray(checkedKeys, newLeftArrayData);
            newRightExpandedKeys = Array.from(new Set(rightExpandedKeys.concat(_this.rightTree.state.expandedKeys)));
        } else if (key === 'reset') {
            newLeftArrayData = leftTreeDataInit;
            newRightArrayData = rightTreeDataInit;
        }
        _this.setState({
            leftTreeData: convertArrayToTree(newLeftArrayData),
            rightTreeData: convertArrayToTree(newRightArrayData),
            leftCheckedKeys: [],
            rightCheckedKeys: [],
            leftExpandedKeys: newLeftExpandedKeys,
            rightExpandedKeys: newRightExpandedKeys,
            updateFrom: 'trans'
        });
    };

	/**
	 * 创建操作按钮渲染
	 * @param {Array} btns
	 */
    renderBtns = (btns) => {
        let { leftCheckedKeys, rightCheckedKeys } = this.state;
        return btns.map(item => {
            let { name, className, key } = item;
            let enable = key === 'allToRight' || key === 'allToLeft' || key === 'reset' || (key === 'toRight' && leftCheckedKeys.length > 0) || (key === 'toLeft' && rightCheckedKeys.length > 0) ? 'enable' : 'disable';
            return (
                <Button
                    key={key}
                    disabled={key === 'allToRight' || key === 'allToLeft' || key === 'reset' || (key === 'toRight' && leftCheckedKeys.length > 0) || (key === 'toLeft' && rightCheckedKeys.length > 0) ? false : true}
                    className={`transfer-btn ${className} ${enable}`}
                    onClick={key === 'allToRight' || key === 'allToLeft' || key === 'reset' || (key === 'toRight' && leftCheckedKeys.length > 0) || (key === 'toLeft' && rightCheckedKeys.length > 0) ? this.handleTransClick.bind(this, key) : () => { console.log('No check') }}
                >
                    {name}
                </Button>
            );
        });
    };

	/**
	 * 获取树Tree结构值
	 */
    getTreeData = () => {
        let { leftTreeData, rightTreeData } = this.state;
        return {
            leftTreeData: leftTreeData,
            rightTreeData: rightTreeData
        }
    }

    render() {
        let { leftTitle, rightTitle, treeWidth, treeHeight, showSearch, searchPlaceholder, transferBtns } = this.props;
        let { leftTreeData, rightTreeData, leftCheckedKeys, rightCheckedKeys, leftExpandedKeys, rightExpandedKeys, updateFrom } = this.state;
        let leftTreeArray = convertTreeToArray(leftTreeData);
        let rightTreeArray = convertTreeToArray(rightTreeData);
        let treeStyle = { "height": `${leftTitle.length > 0 ? `calc(100% - 34px)` : `100%`}` };
        return (
            <div
                ref={this.createRef('treeTransfer')}
                className="tree-transfer-container"
                style={{ "height": treeHeight }}
            >
                <div className="tree-transfer-left" style={{ "width": treeWidth }} >
                    {leftTitle.length > 0 ? <div className='tree-title'>{leftTitle} <i className='tree-nums'>{leftTreeArray.length}</i></div> : null}
                    <Treex
                        ref={this.createRef('leftTree')}
                        style={treeStyle}
                        showSearch={showSearch}
                        searchPlaceholder={searchPlaceholder}
                        treeData={leftTreeData}
                        arrayData={leftTreeArray}
                        checkedKeys={leftCheckedKeys}
                        expandedKeys={leftExpandedKeys}
                        onCheck={(checkedKeys) => this.handleCheck(checkedKeys, 'left')}
                        onExpand={(expandedKeys) => this.handleExpand(expandedKeys, 'left')}
                        updateFrom={updateFrom}
                        position="left"
                    />
                </div>
                <div className="tree-transfer-middle" >
                    {this.renderBtns(transferBtns)}
                </div>
                <div className="tree-transfer-right" style={{ "width": treeWidth }}>
                    {rightTitle.length > 0 ? <div className='tree-title'>{rightTitle} <i className='tree-nums'>{rightTreeArray.length}</i></div> : null}
                    <Treex
                        ref={this.createRef('rightTree')}
                        style={treeStyle}
                        showSearch={showSearch}
                        searchPlaceholder={searchPlaceholder}
                        treeData={rightTreeData}
                        arrayData={rightTreeArray}
                        checkedKeys={rightCheckedKeys}
                        expandedKeys={rightExpandedKeys}
                        onCheck={(checkedKeys) => this.handleCheck(checkedKeys, 'right')}
                        onExpand={(expandedKeys) => this.handleExpand(expandedKeys, 'right')}
                        updateFrom={updateFrom}
                        position="right"
                    />
                </div>
            </div>
        );
    }
}
Transfer.propTypes = {
    leftTreeData: PropTypes.array,
    rightTreeData: PropTypes.array,
    leftTitle: PropTypes.string,
    rightTitle: PropTypes.string,
    treeWidth: PropTypes.number,
    treeHeight: PropTypes.number,
    showSearch: PropTypes.bool,
    searchPlaceholder: PropTypes.string,
    transferBtns: PropTypes.array
};
Transfer.defaultProps = {
    leftTreeData: [],
    rightTreeData: [],
    leftTitle: '',
    rightTitle: '',
    treeWidth: 350,
    treeHeight: 450,
    showSearch: true,
    searchPlaceholder: 'Search',
    transferBtns: [
        {
            key: 'allToRight',
            name: '>>',
            className: 'all-to-right'
        },
        {
            key: 'toRight',
            name: '>',
            className: 'to-right'
        },
        {
            key: 'toLeft',
            name: '<',
            className: 'to-left'
        },
        {
            key: 'allToLeft',
            name: '<<',
            className: 'all-to-left'
        },
        {
            key: 'reset',
            name: 'Reset',
            className: 'reset'
        }
    ]
};
export default Transfer;
