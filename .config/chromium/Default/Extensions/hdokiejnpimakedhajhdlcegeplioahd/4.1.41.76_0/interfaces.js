Interfaces=function(){var g=function(a,c){this.type=a;if(this.options=c)this.options.include&&(this.options.include=[].concat(this.options.include)),this.options.exclude&&(this.options.exclude=[].concat(this.options.exclude))};g.prototype.requiredBy=function(a){var c;if(a&&this.options){if(this.options.include){for(c=0;c<this.options.include.length;++c)if(this.options.include[c]===a)return!0;return!1}if(this.options.exclude)for(c=0;c<this.options.exclude.length;++c)if(this.options.exclude[c]===a)return!1}return!0};
g.prototype.isSyncronized=function(){return this.options&&!0===this.options.sync};g.prototype.isSyncronousFunction=function(){return this.type===Interfaces.TYPE_SYNC_FUNCTION};g.prototype.isFunction=function(){return this.type===Interfaces.TYPE_FUNCTION||this.type===Interfaces.TYPE_SYNC_FUNCTION};g.prototype.isConstructor=function(){return this.type===Interfaces.TYPE_CONSTRUCTOR};g.prototype.isPrimitive=function(){return!this.isFunction()&&!this.isConstructor()};g.prototype.shouldSendIndirect=function(){return this.isPrimitive()?
this.options&&"undefined"!==typeof this.options.sendIndirect?this.options.sendIndirect:!0:this.options&&!0===this.options.sendIndirect};g.prototype.allowWrite=function(){return this.options&&!0===this.options.write};g.prototype.addIncludes=function(a){this.options=this.options||{};this.options.include=this.options.include.concat(a)};var v=function(){var a=function(d,b){return function(a){if(b.hasOwnProperty(a))return d[a];throw a+" is not defined in the interface.";}},c=function(d,b,a,c){var e=function(b,
c,e){if(!b.allowWrite())throw a.concat(c)+" is not writeable.";if(b&&typeof e===b.type)d[c]=e;else throw c+" is not defined in the interface.";};return c.direct?function(a,d){e(b[a],a,d)}:function(d,f){var k=b[d];e(k,d,f);k.shouldSendIndirect()&&c.requestFunction({cmd:"LPData.setValue",args:[a.concat(d),f]})}},m=function(d,b){return function(){return b.apply(d,arguments)}},f=function(d,b,a){if("function"===typeof a.requestFunction)return function(){for(var c=[],e=0,f=arguments.length;e<f;++e)c.push(arguments[e]);
return a.requestFunction({cmd:0<d.length?d.concat(b):b,args:c})};throw"requestFunction must be specified for this interface since it is not direct access.";},u=function(a,b,c){return function(){"function"===typeof b&&b.apply(a,arguments);"function"===typeof c&&c.apply(a,arguments)}},l=function(d,b,e,q,k,n){var r=!1,t=[],h;for(h in q){var p=q[h];p instanceof g?p.isFunction()?!p.requiredBy(n.context)||p.isSyncronousFunction()&&n.asyncOnly||(n.direct||p.isSyncronousFunction()?b&&"function"===typeof b[h]?
(d[h]=m(b,b[h]),!n.direct&&p.shouldSendIndirect()&&(d[h]=u(d,d[h],f(k,h,n)))):t.push(p.type+": "+k.concat(h).join(".")):d[h]=f(k,h,n)):p.isConstructor()?p.requiredBy(n.context)&&!n.asyncOnly&&(b&&"function"===typeof b[h]?d[h]=b[h]:t.push(p.type+": "+k.concat(h).join("."))):r=!0:(d.hasOwnProperty(h)||(d[h]={}),l(d[h],b?b[h]:b,e?e[h]:e,q[h],k.concat(h),n))}r&&(d.get=a(e,q),d.set=c(e,q,k,n));if(0<t.length)throw"Background instance does not support the following:\n"+t.join("\n");return d};return function(a,
b){return l(b.instance||{},b.source||b.sourceFunctions,b.source||b.sourceData,a,[],b)}}(),r=function(){var a={},c={},m=function(a,c,l,d){var b=[],e;for(e in a){var f=d?d.concat(e):[e],k=a[e];k instanceof g?k.isPrimitive()&&k.requiredBy(c)&&(!l||k.isSyncronized())&&b.push({sourceFunction:k.options&&k.options.sourceFunction,path:f}):b=b.concat(m(k,c,l,f))}return b};return function(f,g){var l=[];f=[].concat(f);for(var d=0;d<f.length;++d){var b=f[d],e;g.syncronizedOnly?(e=c[b],"undefined"===typeof e&&
(e=c[b]=m(g["interface"],b,!0))):(e=a[b],"undefined"===typeof e&&(e=a[b]=m(g["interface"],b,!1)));l=l.concat(e)}return l}}();return{TYPE_CONSTRUCTOR:"contsructor",TYPE_SYNC_FUNCTION:"synchronous function",TYPE_FUNCTION:"function",TYPE_STRING:"string",TYPE_BOOLEAN:"boolean",TYPE_NUMBER:"number",TYPE_OBJECT:"object",Definition:g,extend:function(a,c){for(var m in c){var f=c[m];switch(typeof f){case "object":a.hasOwnProperty(m)?Interfaces.extend(a[m],f):a[m]=f;break;default:a[m]=f}}},createInstance:v,
getPrimitives:function(a){var c={};if(a.context)for(var m=r(a.context,a),f=0,g=m.length;f<g;++f){var l=m[f],d;d=l.sourceFunction?"function"===typeof l.sourceFunction?l.sourceFunction():LPReflection.callFunction(null,l.sourceFunction,[],{context:a.source}):LPReflection.getValue(a["interface"],l.path,{context:a.source});LPReflection.setValue(null,l.path,d,{context:c})}return c},clearPrimitives:function(a){if(a.context)for(var c=r(a.context,a),g=0;g<c.length;++g)LPReflection.setValue(null,c[g].path,
null,{context:a.source})},getName:function(a){for(var c in this)if(a===this[c])return c;throw Error("Could not find interface name.");}}}();