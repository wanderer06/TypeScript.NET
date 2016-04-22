/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import ArgumentNullException from "../../Exceptions/ArgumentNullException";
import {from as enumeratorFrom} from "../Enumeration/Enumerator";
import ReadOnlyCollection from "../ReadOnlyCollectionBase";

export default class ReadOnlyArrayWrapper<T> extends ReadOnlyCollection<T>
{

	constructor(array:IArray<T>)
	{
		super();
		if(!array)
			throw new ArgumentNullException('array');

		var _ = this;
		_._getCount = () => array.length;
		_.getEnumerator = () => enumeratorFrom(array);
		_.getValueAt = i => array[i];
	}

	getValueAt:(index:number)=>T;
}
