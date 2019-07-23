import React from 'react';
import { Tree, Input } from 'antd';
import PropTypes from 'prop-types';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

const getParentKey = (key, tree) => {
	let parentKey;
	for (let i = 0; i < tree.length; i++) {
		const node = tree[i];
		if (node.children) {
			if (node.children.some((item) => item.key === key)) {
				parentKey = node.key;
			} else if (getParentKey(key, node.children)) {
				parentKey = getParentKey(key, node.children);
			}
		}
	}
	return parentKey;
};

class Trees extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expandedKeys: [],
			searchValue: '',
			autoExpandParent: true
		};
	}

	//创建Ref
	createRef = (ref) => {
		const _this = this;
		return (node) => {
			_this[ref] = node;
		};
	};

	onExpand = (expandedKeys) => {
		this.setState({
			expandedKeys,
			autoExpandParent: false
		});
	};

	onChange = (e) => {
		const value = e.target.value;
		let expandedKeys;
		if (value === '') {
			expandedKeys = [];
		} else {
			expandedKeys = this.props.arrayData
				.map((item) => {
					const titleText = `${item.title}`;
					console.log(titleText.indexOf(value) > -1);
					if (titleText.indexOf(value) > -1) {
						return getParentKey(item.key, this.props.arrayData);
					}
					return null;
				})
				.filter((item, i, self) => item && self.indexOf(item) === i);
		}
		this.setState({
			expandedKeys,
			searchValue: value,
			autoExpandParent: true
		});
	};

	render() {
		const { searchValue, expandedKeys, autoExpandParent } = this.state;
		let { onCheck, showSearch, placeholder, checkedKeys } = this.props;
		const loop = (data) =>
			data.map((item) => {
				const titleText = item.title;
				const index = titleText.indexOf(searchValue);
				const beforeStr = titleText.substr(0, index);
				const afterStr = titleText.substr(index + searchValue.length);
				const title =
					index > -1 ? (
						<span>
							{beforeStr}
							<span style={{ color: '#f50' }}>{searchValue}</span>
							{afterStr}
						</span>
					) : (
							<span>{titleText}</span>
						);
				if (item.children) {
					return (
						<TreeNode key={item.key} title={title}>
							{loop(item.children)}
						</TreeNode>
					);
				}
				return <TreeNode key={item.key} title={title} />;
			});
			
		return (
			<div className='tree-container' style={this.props.style}>
				{
					showSearch ? <div className='tree-search'>
						<Search placeholder={placeholder} onChange={this.onChange.bind(this)} />
					</div> : null
				}
				<div className="tree-list" style={{height: `${showSearch ? `calc(100% - 46px)` : '100%'}`, marginTop: `${showSearch ? '46px' : '0'}`}}>
					<Tree
						checkable={true}
						onExpand={this.onExpand.bind(this)}
						onCheck={onCheck}
						checkedKeys={checkedKeys}
						expandedKeys={expandedKeys}
						autoExpandParent={autoExpandParent}
					>
						{loop(this.props.treeData)}
					</Tree>
				</div>
			</div>
		);
	}
}
Trees.propTypes = {
	showSearch: PropTypes.bool.isRequired,
	placeholder: PropTypes.string.isRequired,
	onCheck: PropTypes.func.isRequired,
	checkedKeys: PropTypes.array.isRequired,
	arrayData: PropTypes.array
};
export default Trees;
