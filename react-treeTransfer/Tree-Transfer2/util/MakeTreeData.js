import _ from 'lodash';

/**
 * 扁平化TreeData数据结构为一维数组
 * @param {Array} treeData 
 */
export const convertTreeToArray = (treeData) => {
	let dataArray = [];
	let treeArray = _.cloneDeep(treeData);
	const recursion = (data, parentKey) => {
		data.forEach(item => {
			let copyItem = _.cloneDeep(item);
			delete copyItem.children;
			if (parentKey) copyItem.parentKey = parentKey;
			dataArray.push(copyItem);
			if (item.children) {
				let parent2Key = item.key;
				recursion(item.children, parent2Key);
			}
		});
	}
	recursion(treeArray);
	return dataArray;
}


/**
 * 树化一维数组为TreeData数据结构
 * @param {Array} dataArray 
 */
export const convertArrayToTree = (dataArray) => {
	let treeArray = _.cloneDeep(dataArray);
	let treeData = mergeTreeData(separateData(treeArray));
	return treeData;
}


/**
 * 获取所有父节点以及属性
 * @param {Array} dataArray 
 */
export const getParentNodeData = (allArray = [], dataArray = []) => {
	let parentArray = [];
	parentArray = allArray.filter(item => {
		let isPraent = false;
		for (let i = 0; i < dataArray.length; i++) {
			if (dataArray[i].parentKey === item.key) {
				isPraent = true;
				break;
			}
		}
		return isPraent;
	});
	return parentArray;
}

/**
 * 将树形平铺数据进行分离整理
 * @param {Array} treeData 
 * @returns {treeOBj,treeArray}
 */
const separateData = (treeData) => {
	let treeObj = {},
		treeArray = [];
	treeData.forEach((item, index) => {
		if (item.parentKey) {
			if (!treeObj[item.parentKey]) {
				treeObj[item.parentKey] = [];
			}
			treeObj[item.parentKey].push(item);
		} else {
			treeArray.push(item);
		}
	});
	return {
		treeObj,
		treeArray
	};
};


/**
 * 整理树对象,将原始树对象进行合并
 * @param {Object} treeObj 
 */
const makeTreeObject = (treeObj) => {
	let dataObject = _.cloneDeep(treeObj);
	for (const itemKey in dataObject) {
		if (dataObject.hasOwnProperty(itemKey)) {
			const itemEl = dataObject[itemKey];
			itemEl.map((item, i) => {
				if (dataObject.hasOwnProperty(item.key)) {
					item.children = _.sortBy(dataObject[item.key], itn => itn.key);
				}
				return item;
			});
			dataObject[itemKey] = itemEl;
		}
	}
	return dataObject;
};


/**
 * 整理树数组
 * @param {Array} treeArray 
 * @returns 最终的树数组
 */
const makeTreeArray = (treeArray) => {
	let dataArray = _.cloneDeep(treeArray);
	return (treeObj) => {
		return dataArray.map((item, index) => {
			if (treeObj.hasOwnProperty(item.key)) {
				item.children = _.sortBy(treeObj[item.key], itn => itn.key);
			}
			return item;
		});
	};
};


/**
 * 
 * @param {Object} Object - treeObj 树数组除第一层外的元素对象 treeArray 树数组第一层元素数组  
 */
const mergeTreeData = ({
	treeObj,
	treeArray
}) => {
	let andData = makeTreeArray(treeArray)(makeTreeObject(treeObj))
	return _.sortBy(andData, itn => itn.key);
};


/**
 * 获取CheckedKeys的父级Keys
 * @param {Array} array
 */

export const getParentKeysArray = (arry = [], keys = []) => {
	let parentKeys = [];
	const getParentKey = (key) => {
		let parentKey;
		let arr = _.cloneDeep(arry);
		for(let i = 0; i < arr.length; i++) {
			if(arr[i].key === key) {
				parentKey = arr[i].parentKey;
				break;
			}
		}
		if(parentKey) {
			parentKeys.push(parentKey);
			getParentKey(parentKey);
		}
	}
	keys.forEach(item => {
		getParentKey(item);
	});
	return _.uniq(parentKeys);
}

/**
 * Tree数组全部添加disabled属性
 * @param {Array} array
 */
export const makeTreeAllDisabled = (array = []) => {
	return array.map(item => {
		item.disabled = true;
		if (item.children) {
			makeTreeAllDisabled(item.children);
		}
		return item;
	});
}

/**
 * Tree数组给指定Keys添加disabled属性
 * @param {Array} array
 */
export const makeArrayKeysDisabled = (array = [], keys = []) => {
	return _.cloneDeep(array).map(item => {
		let isDisable = false;
		for (let i = 0; i < keys.length; i++) {
			if (keys[i] === item.key) {
				isDisable = true;
				break;
			}
		}
		if (isDisable) item.disabled = true;
		return item;
	});
}


/**
 * Tree数组给指定Keys删除disabled属性
 * @param {Array} array
 */
export const makeArrayKeysEnabled = (array = [], keys = []) => {
	let subEnableKeys = _.cloneDeep(array).map(item => {
		let enable = false;
		for (let i = 0; i < keys.length; i++) {
			if (keys[i] === item.key) {
				enable = true;
				break;
			}
		}
		if (enable) item.disabled = false;
		return item;
	});

	let parentKeysArray = getParentKeysArray(array, keys);

	return subEnableKeys.map(item => {
		let enable = false;
		for (let i = 0; i < parentKeysArray.length; i++) {
			if (parentKeysArray[i] === item.key) {
				enable = true;
				break;
			}
		}
		if (enable) item.disabled = false;
		return item;
	});
}


/**
 * 数组合并去重
 * @param {Array} array1 
 * @param {Array} array2 
 */
export const mergeArrayData = (array1, array2) => {
	return _.uniqWith(array1.concat(array2), _.isEqual);
}