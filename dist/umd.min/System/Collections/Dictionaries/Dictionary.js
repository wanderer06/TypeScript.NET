/*!
 * @author electricessence / https://github.com/electricessence/
 * Original: http://linqjs.codeplex.com/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(t,e){function r(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)};!function(t){if("object"==typeof module&&"object"==typeof module.exports){var e=t(require,exports);void 0!==e&&(module.exports=e)}else"function"==typeof define&&define.amd&&define(["require","exports","../../Compare","../../Types","../../Functions","./DictionaryBase","../Enumeration/EnumeratorBase"],t)}(function(t,e){"use strict";function r(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function n(t){return null===t?"null":t===l?"undefined":typeof t.toString===i["default"].FUNCTION?t.toString():Object.prototype.toString.call(t)}var o=t("../../Compare"),i=t("../../Types"),u=t("../../Functions"),s=t("./DictionaryBase"),a=t("../Enumeration/EnumeratorBase"),l=void 0,p=function(){function t(t,e,r,n){this.key=t,this.value=e,this.previous=r,this.next=n}return t}(),c=function(){function t(t,e){this.first=t,this.last=e}return t.prototype.addLast=function(t){var e=this;null!=e.last?(e.last.next=t,t.previous=e.last,e.last=t):e.first=e.last=t},t.prototype.replace=function(t,e){var r=this;null!=t.previous?(t.previous.next=e,e.previous=t.previous):r.first=e,null!=t.next?(t.next.previous=e,e.next=t.next):r.last=e},t.prototype.remove=function(t){var e=this;null!=t.previous?t.previous.next=t.next:e.first=t.next,null!=t.next?t.next.previous=t.previous:e.last=t.previous},t.prototype.clear=function(){for(var t=this;t.last;)t.remove(t.last)},t.prototype.forEach=function(t){for(var e=this,r=e.first;r;)t(r),r=r.next},t}(),f=function(t){function e(e){void 0===e&&(e=u["default"].Identity),t.call(this),this._compareSelector=e,this._count=0,this._entries=new c,this._buckets={}}return __extends(e,t),e.prototype.setKV=function(t,e,i){var u,s=this,a=s._buckets,c=s._entries,f=s._compareSelector,v=f(t),y=n(v);if(r(a,y)){for(var h=o.areEqual,d=a[y],_=0;_<d.length;_++){var x=d[_];if(f(x.key)===v){if(!i)throw new Error("Key already exists.");var m=!h(x.value,e);return m&&(e===l?(c.remove(x),d.splice(_,1),d.length||delete a[y],--s._count):(u=new p(t,e),c.replace(x,u),d[_]=u),s._onValueUpdate(t,e,x.value)),m}}d.push(u=u||new p(t,e))}else{if(e===l){if(i)return!1;throw new Error("Cannot add 'undefined' value.")}a[y]=[u=new p(t,e)]}return++s._count,c.addLast(u),s._onValueUpdate(t,e,void 0),!0},e.prototype.addByKeyValue=function(t,e){this.setKV(t,e,!1)},e.prototype.getValue=function(t){var e=this._buckets,o=this._compareSelector,i=o(t),u=n(i);if(!r(e,u))return void 0;for(var s=e[u],a=0,l=s;a<l.length;a++){var p=l[a];if(o(p.key)===i)return p.value}return void 0},e.prototype.setValue=function(t,e){return this.setKV(t,e,!0)},e.prototype.containsKey=function(t){var e=this,o=e._buckets,i=e._compareSelector,u=i(t),s=n(u);if(!r(o,s))return!1;for(var a=o[s],l=0,p=a.length;p>l;l++)if(i(a[l].key)===u)return!0;return!1},e.prototype.clear=function(){var e=this,r=e._buckets,n=t.prototype.clear.call(this);e._count=0;for(var o in r)r.hasOwnProperty(o)&&delete r[o];return e._entries.clear(),n},e.prototype.getCount=function(){return this._count},e.prototype.getEnumerator=function(){var t,e=this;return new a["default"](function(){t=e._entries.first},function(e){if(null!=t){var r={key:t.key,value:t.value};return t=t.next,e.yieldReturn(r)}return e.yieldBreak()})},e.prototype.getKeys=function(){var t=this,e=[];return t._entries.forEach(function(t){return e.push(t.key)}),e},e.prototype.getValues=function(){var t=this,e=[];return t._entries.forEach(function(t){return e.push(t.value)}),e},e}(s["default"]);Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=f});
//# sourceMappingURL=Dictionary.js.map
