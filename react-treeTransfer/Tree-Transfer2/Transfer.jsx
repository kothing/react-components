import React, { Component } from 'react';
import _ from 'lodash';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import Tree from './Trees';
import './transfer.less';

import {
    convertTreeToArray, 
    convertArrayToTree, 
    makeTreeAllDisabled,
    makeArrayKeysDisabled,
    makeArrayKeysEnabled,
    mergeArrayData
} from './util/MakeTreeData';

class Transfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftTreeData: _.sortBy(mergeArrayData(props.leftTreeData, makeTreeAllDisabled(_.cloneDeep(props.rightTreeData))), itn => itn.key),
            rightTreeData: _.sortBy(mergeArrayData(props.rightTreeData, makeTreeAllDisabled(_.cloneDeep(props.leftTreeData))), itn => itn.key),
            leftCheckedKeys: props.leftCheckedKeys,
            rightCheckedKeys: props.rightCheckedKeys,
        };
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
	 * 设置选中值
     * @param {Array} array
     * @param {String} key 
	 */
    handleSetCheckedKey = (checkedKeys, key) => {
        let checkedKeysVar = key === 'left' ? 'leftCheckedKeys' : 'rightCheckedKeys';
        console.log(checkedKeys);
        this.setState({
            [checkedKeysVar]: checkedKeys
        });
    }

    /**
	 * 设置穿梭值
	 *@param {String} key 
	 */
    handleSetTransData = (key) => {
        let {leftTreeData, rightTreeData, leftCheckedKeys, rightCheckedKeys} = this.state;
        let leftArrayData = convertTreeToArray(leftTreeData);
        let rightArrayData = convertTreeToArray(rightTreeData);
        let sourceArray = [];
        let checkedKeys = [];
        let targetArray = [];

        switch(key) {
            case 'allToRight':
                sourceArray = _.cloneDeep(leftArrayData);
                checkedKeys = _.cloneDeep(leftArrayData.map(item => item.key));
                targetArray = _.cloneDeep(rightArrayData);
                break;

            case 'toRight':
                sourceArray = _.cloneDeep(leftArrayData);
                checkedKeys = _.cloneDeep(leftCheckedKeys);
                targetArray = _.cloneDeep(rightArrayData);
                break;

            case 'toLeft':
                sourceArray = _.cloneDeep(rightArrayData);
                checkedKeys = _.cloneDeep(rightCheckedKeys);
                targetArray = _.cloneDeep(leftArrayData);
                break;

            case 'allToLeft':
                sourceArray = _.cloneDeep(rightArrayData);
                checkedKeys = _.cloneDeep(rightArrayData.map(item => item.key));
                targetArray = _.cloneDeep(leftArrayData);
                break;
            
            default:
                break;
        }

        sourceArray = makeArrayKeysDisabled(sourceArray, checkedKeys);
        targetArray = makeArrayKeysEnabled(targetArray, checkedKeys);

        return {
            sourceData: sourceArray,
            targetData: targetArray
        };
    };


	/**
	 * 穿梭按钮操作
	 *@param {String} key 
	 */
    handleTransClick = (key) => {
        let _this = this;
        let { sourceData, targetData} = _this.handleSetTransData(key);
        if(key === 'allToRight' || key === 'toRight') {
            _this.setState({
                leftTreeData: convertArrayToTree(sourceData),
                rightTreeData: convertArrayToTree(targetData),
                leftCheckedKeys: []
            },() => {
                console.log(_this.state.leftTreeData, _this.state.rightTreeData);
            });
        } else if(key === 'allToLeft' || key === 'toLeft') {
            _this.setState({
                leftTreeData: convertArrayToTree(targetData),
                rightTreeData: convertArrayToTree(sourceData),
                rightCheckedKeys: []
            });
        }
    };
	/**
	 * 创建操作按钮渲染
	 * @param {Array} btns
	 */
    createBtns = (btns) => {
        let {leftCheckedKeys, rightCheckedKeys} = this.state;
        return btns.map((item, index) => {
            let {
                name,
                className,
                key
            } = item;
			let enable = ( key === 'toRight' && leftCheckedKeys.length > 0) || ( key === 'toLeft' && rightCheckedKeys.length > 0) ? 'enable' : '';
            return (
                <Button key={key} className={`transfer-btn ${className} ${enable}`} onClick={this.handleTransClick.bind(this, key)} >
                    {name}
                </Button>
            );
        });
    };

	/**
	 * 获取树Tree结构值
	 */
    getTreeData = () => {
        let {leftTreeData, rightTreeData} = this.state;
        return {
            leftTreeData: leftTreeData,
            rightTreeData: rightTreeData
        }
    }
	
    render() {
        let { leftTitle, rightTitle, treeWidth, treeHeight, showSearch, searchPlaceholder, transferBtns } = this.props;
        let { leftTreeData, leftCheckedKeys, rightTreeData, rightCheckedKeys } = this.state;
        let leftTreeArray = convertTreeToArray(leftTreeData);
        let rightTreeArray = convertTreeToArray(rightTreeData);
        return (
            <div
                ref={this.createRef('treeTransfer')}
                className="tree-transfer-container" 
                style={{ "height": treeHeight }}
            >
                <div className="tree-transfer-left" style={{ "width": treeWidth }} >
                    {leftTitle.length > 0 ? <div className='tree-title'>{leftTitle}</div> : null}
                    <Tree
                        style={{ "height": `${leftTitle.length > 0 ? `calc(100% - 34px - ${showSearch ? '46px' : '0px'})` : `calc(100% - ${showSearch ? '46px' : '0px'})`}`, "marginTop": `${showSearch ? '46px' : '0px'}` }}
                        treeData={leftTreeData}
                        arrayData={leftTreeArray}
                        onCheck={(checkedKeys) => this.handleSetCheckedKey(checkedKeys,'left')}
                        checkedKeys={leftCheckedKeys}
                        showSearch={showSearch}
                        placeholder={searchPlaceholder}
                    />
                </div>
                <div className="tree-transfer-middle" >
                    {this.createBtns(transferBtns)}
                </div>
                <div className="tree-transfer-right" style={{ "width": treeWidth }}>
                    {rightTitle.length > 0 ? <div className='tree-title'>{rightTitle}</div> : null}
                    <Tree
                        style={{ "height": `${leftTitle.length > 0 ? `calc(100% - 34px - ${showSearch ? '46px' : '0px'})` : `calc(100% - ${showSearch ? '46px' : '0px'})`}`, "marginTop": `${showSearch ? '46px' : '0px'}` }}
                        treeData={rightTreeData}
                        arrayData={rightTreeArray}
                        onCheck={(checkedKeys) => this.handleSetCheckedKey(checkedKeys,'right')}
                        checkedKeys={rightCheckedKeys}
                        showSearch={showSearch}
                        placeholder={searchPlaceholder}
                    />
                </div>
            </div>
        );
    }
}
Transfer.propTypes = {
    leftTreeData: PropTypes.array,
    rightTreeData: PropTypes.array,
    leftCheckedKeys: PropTypes.array,
    rightCheckedKeys: PropTypes.array,
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
    leftCheckedKeys: [],
    rightCheckedKeys: [],
    leftTitle: '',
    rightTitle: '',
    treeWidth: 260,
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
        }
    ]
};
export default Transfer;
