///<reference path="../../../import.d.ts"/>

import ArrayEnumerator from "../../../../../dist/commonjs/System/Collections/Enumeration/ArrayEnumerator";
import * as assert from "assert";


it("should allow empty arrays", ()=>
{
	assert.doesNotThrow(()=>
	{
		var i = new ArrayEnumerator([]);
		i.moveNext();
	});

	assert.doesNotThrow(()=>
	{
		var i = new ArrayEnumerator(null);
		i.moveNext();
	});

});
