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
 * 整理树对象,将原始树对象进行合并,为每个节点添加是否为叶子节点属性
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
 * @param {Array} arry 所有Tree的平铺Array 
 * @param {Array} keys 被选中key的Array
 * @returns {Array} 被选中key的父Array
 */
export const getParentKeysArray = (arry = [], keys = []) => {
	let parentObjs = [];
	const getParentKey = (key) => {
		let parentObj;
		let arr = _.cloneDeep(arry);
		for(let i = 0; i < arr.length; i++) {
			if(arr[i].key === key) {
				parentObj = arr[i];
				break;
			}
		}
		if(parentObj) {
			parentObjs.push(parentObj);
			if(parentObj.parentKey) getParentKey(parentObj.parentKey);
		}
	}
	keys.forEach(item => {
		getParentKey(item);
	});
	return _.uniq(parentObjs);
}


/**
 * 数组整理成key:value
 * @param {Array} array
 */
export const makeKVArray = (array = []) => {
	return array.map(item => ( {key: item} ));
}


/**
 * 把一维数组转成 对象名为key 对象值是原对象的格式
 */
const makeByKeyObj = (array) => {
	let obj = {};
	array.forEach(item => {
		obj[item.key] = item;
	});
	return obj;
};


/**
 * 数组合并去重
 * @param {Array} array1 
 * @param {Array} array2 
 */
export const mergeArrayData = (array1, array2) => {
	return _.uniqWith(array1.concat(array2), _.isEqual);
}


/**
 * 数组去重
 * @param {Array} array
 */
export const makeArrayUniq = (array) => {
	let keysObj = makeByKeyObj(array);
	let newArray = [];
	for(let key in keysObj) {
		newArray.push(keysObj[key]);
	}
	return newArray
}
