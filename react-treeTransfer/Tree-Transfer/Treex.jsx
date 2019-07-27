import React from 'react';
import PropTypes from 'prop-types';
import { getParentKey } from './util/MakeTreeData';
import { Tree, Input } from 'antd';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

class Treex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expandedKeys: props.expandedKeys ? props.expandedKeys : [],
			checkedKeys: props.checkedKeys ? props.checkedKeys : [],
			autoExpandParent: true,
			searchValue: ''
		};
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			checkedKeys: newProps.checkedKeys,
		});
		if(newProps.updateFrom === 'trans') {
			this.setState({
				expandedKeys: newProps.expandedKeys,
				autoExpandParent: false
			});
		}
	}

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
		this.props.onExpand(expandedKeys);
	};

	onCheck = checkedKeys => {
		this.setState({
			checkedKeys
		});
		this.props.onCheck(checkedKeys);
	};

	onSearch = (e) => {
		let value = e.target.value;
		let expandedKeys = [];
		if (value !== '') {
			expandedKeys = this.props.arrayData.map((item) => {
				return item.title.toLowerCase().indexOf(value.toLowerCase()) > -1 ? getParentKey(item.key, this.props.arrayData) : null;
			}).filter((item, i, self) => item && self.indexOf(item) === i);
		}
		this.setState({
			expandedKeys,
			searchValue: value,
			autoExpandParent: false
		});
	};

	render() {
		const { searchValue, expandedKeys, checkedKeys, autoExpandParent } = this.state;
		let { showSearch, searchPlaceholder } = this.props;
		const renderTreeNode = (treeData) =>
			treeData.map((item) => {
				const titleText = item.title;
				const index = titleText.toLowerCase().indexOf(searchValue.toLowerCase());
				const beforeStr = titleText.substr(0, index);
				const searchStr = titleText.substr(index, searchValue.length);
				const afterStr = titleText.substr(index + searchValue.length);
				const title = index > -1 ? (
					<span>
						{beforeStr}
						<span style={{ color: '#f50' }}>{searchStr}</span>
						{afterStr}
					</span>
				) : (<span>{titleText}</span>);
				if (item.children) {
					return (
						<TreeNode key={item.key} title={title} className={item.isNew ? 'tree-li new' : 'tree-li'}>
							{renderTreeNode(item.children)}
						</TreeNode>
					);
				}
				return <TreeNode key={item.key} title={title} className={item.isNew ? 'tree-li new' : 'tree-li'}/>;
			});

		return (
			<div className='tree-container' style={this.props.style}>
				{
					showSearch ? <div className='tree-search'>
						<Search placeholder={searchPlaceholder} onChange={this.onSearch.bind(this)} />
					</div> : null
				}
				<div className="tree-list" style={{ height: `${showSearch ? `calc(100% - 46px)` : '100%'}`, marginTop: `${showSearch ? '46px' : '0'}` }}>
					<Tree
						checkable={true}
						onExpand={this.onExpand.bind(this)}
						onCheck={this.onCheck.bind(this)}
						checkedKeys={checkedKeys}
						expandedKeys={expandedKeys}
						autoExpandParent={autoExpandParent}
						selectable={false}
					>
						{renderTreeNode(this.props.treeData)}
					</Tree>
				</div>
			</div>
		);
	}
}
Treex.propTypes = {
	showSearch: PropTypes.bool.isRequired,
	searchPlaceholder: PropTypes.string.isRequired,
	onCheck: PropTypes.func.isRequired,
	arrayData: PropTypes.array
};
export default Treex;
