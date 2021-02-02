!function(t){"function"==typeof define&&define.amd?define(t):t()}(function(){"use strict";var u=void 0,o={}.hasOwnProperty,r=(a.prototype.onOpen=function(t){return this._ws.addEventListener("open",t),this._listeners.open.push(t),this},a.prototype.onError=function(t){return this._ws.addEventListener("error",t),this._listeners.error.push(t),this},a.prototype.onClose=function(t){return this._ws.addEventListener("close",t),this._listeners.close.push(t),this},a.prototype.onNotify=function(t,e){return this._notifiers[t]=e,this},a.prototype.request=function(t,e,r,n){return void 0===n&&(n=!1),this._request(t,e,r,n),this},a.prototype._request=function(t,e,r,n,s){var o,i;!n&&this.requestCount>=a.MAX_REQUEST_COUNT&&!s?r(u,{code:a.ERROR_MAX_CONCURRENT,message:"Max concurrent error"}):(s===u&&(s=this._requestId++,n||this.requestCount++),this.isReady?(o={jsonrpc:"2.0",id:s,method:t,params:e},this._ws.send(JSON.stringify(o)),this._handlers[s]=r):(i=this,setTimeout(function(){i._request(t,e,r,n,s)},a.CONNECTION_CHECK_DELAY)))},a.prototype.close=function(){for(var t,e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];(t=this._ws).close.apply(t,e)},a.prototype.reconnect=function(){for(var t=this._listeners,e=new WebSocket(this.rpcPath),r=0,n=t.open;r<n.length;r++){var s=n[r];e.addEventListener("open",s)}for(var o=0,i=t.error;o<i.length;o++){s=i[o];e.addEventListener("error",s)}for(var u=0,a=t.message;u<a.length;u++){s=a[u];e.addEventListener("message",s)}for(var c=0,h=t.close;c<h.length;c++){s=h[c];e.addEventListener("close",s)}return this._ws=e,this},a.MAX_REQUEST_COUNT=8,a.CONNECTION_CHECK_DELAY=1e3,a.ERROR_MAX_CONCURRENT=-32032,a);function a(t,e){this.rpcPath=t,this.preprocess=e,this.isReady=!1,this.requestCount=0,this._ws=new WebSocket(this.rpcPath),this._requestId=0,this._listeners={open:[],error:[],message:[],close:[]},this._handlers={},this._notifiers={};var s=this;this.onOpen(function(){s.isReady=!0}),this.onClose(function(){s.isReady=!1}),this._ws.addEventListener("message",e=function(t){var e=JSON.parse(t.data),t=s.preprocess;if(t&&(e=t(e)),o.call(e,"id")){var r=e.id,n=s._handlers;if(o.call(n,r)){t=n[r];if(o.call(e,"result"))t(e.result,u);else{if(!o.call(e,"error"))throw new Error("Invalid response with no `result` or `error`");t(u,e.error)}n[r]=u,s.requestCount--}}else{if(!o.call(e,"method"))throw new Error("Invalid response with no `id` or `method`");n=e.method,r=s._notifiers;o.call(r,n)&&(n=r[n],(e=e.params)&&n(e))}}),this._listeners.message.push(e)}var i=void 0,t=(e.prototype.onNotify=function(t,e){this._jsonrpc.onNotify(t,function(t){t!==i&&e(t[0])})},e.prototype.request=function(t,e){var s=this._jsonrpc;return new Promise(function(r,n){s.request(t,e,function(t,e){e?n(e):r(t)})})},e.prototype.addUri=function(t,e,r){t=[this._secret,t];return e!==i&&(t.push(e),r!==i&&t.push(r)),this.request("aria2.addUri",t)},e.prototype.addTorrent=function(t,e,r,n){t=[this._secret,t];return e!==i&&(t.push(e),r!==i&&(t.push(r),n!==i&&t.push(n))),this.request("aria2.addTorrent",t)},e.prototype.addMetalink=function(t,e,r){t=[this._secret,t];return e!==i&&(t.push(e),r!==i&&t.push(r)),this.request("aria2.addMetalink",t)},e.prototype.remove=function(t){t=[this._secret,t];return this.request("aria2.remove",t)},e.prototype.forceRemove=function(t){t=[this._secret,t];return this.request("aria2.forceRemove",t)},e.prototype.pause=function(t){t=[this._secret,t];return this.request("aria2.pause",t)},e.prototype.pauseAll=function(){var t=[this._secret];return this.request("aria2.pauseAll",t)},e.prototype.forcePause=function(t){t=[this._secret,t];return this.request("aria2.forcePause",t)},e.prototype.forcePauseAll=function(){var t=[this._secret];return this.request("aria2.forcePauseAll",t)},e.prototype.unpause=function(t){t=[this._secret,t];return this.request("aria2.unpause",t)},e.prototype.unpauseAll=function(){var t=[this._secret];return this.request("aria2.unpauseAll",t)},e.prototype.tellStatus=function(t,e){t=[this._secret,t];return e!==i&&t.push(e),this.request("aria2.tellStatus",t)},e.prototype.getUris=function(t){t=[this._secret,t];return this.request("aria2.getUris",t)},e.prototype.getFiles=function(t){t=[this._secret,t];return this.request("aria2.getFiles",t)},e.prototype.getPeers=function(t){t=[this._secret,t];return this.request("aria2.getPeers",t)},e.prototype.getServers=function(t){t=[this._secret,t];return this.request("aria2.getServers",t)},e.prototype.tellActive=function(t){var e=[this._secret];return t!==i&&e.push(t),this.request("aria2.tellActive",e)},e.prototype.tellWaiting=function(t,e,r){e=[this._secret,t,e];return r!==i&&e.push(r),this.request("aria2.tellWaiting",e)},e.prototype.tellStopped=function(t,e,r){e=[this._secret,t,e];return r!==i&&e.push(r),this.request("aria2.tellStopped",e)},e.prototype.changePosition=function(t,e,r){r=[this._secret,t,e,r];return this.request("aria2.changePosition",r)},e.prototype.changeUri=function(t,e,r,n,s){n=[this._secret,t,e,r,n];return s!==i&&n.push(s),this.request("aria2.changeUri",n)},e.prototype.getOption=function(t){t=[this._secret,t];return this.request("aria2.getOption",t)},e.prototype.changeOption=function(t,e){e=[this._secret,t,e];return this.request("aria2.changeOption",e)},e.prototype.getGlobalOption=function(){var t=[this._secret];return this.request("aria2.getGlobalOption",t)},e.prototype.changeGlobalOption=function(t){t=[this._secret,t];return this.request("aria2.changeGlobalOption",t)},e.prototype.getGlobalStat=function(){var t=[this._secret];return this.request("aria2.getGlobalStat",t)},e.prototype.purgeDownloadResult=function(){var t=[this._secret];return this.request("aria2.purgeDownloadResult",t)},e.prototype.removeDownloadResult=function(t){t=[this._secret,t];return this.request("aria2.purgeDownloadResult",t)},e.prototype.getVersion=function(){var t=[this._secret];return this.request("aria2.getVersion",t)},e.prototype.getSessionInfo=function(){var t=[this._secret];return this.request("aria2.getSessionInfo",t)},e.prototype.saveSession=function(){var t=[this._secret];return this.request("aria2.saveSession",t)},e);function e(t,e){this.rpcPath=t,this._secret="token:"+e,this._jsonrpc=new r(t,function t(e){var r,n,s;for(s in e)"string"==(n=typeof(r=e[s]))?e[s]=function(t){var e=t.length;if(0<e&&e<=20){if((e=Number(t))||0===e)return e;if("true"===t)return!0;if("false"===t)return!1;if("null"===t)return null}return t}(r):"object"==n&&t(r);return e})}var n=function(t,i,u,a){return new(u=u||Promise)(function(r,e){function n(t){try{o(a.next(t))}catch(t){e(t)}}function s(t){try{o(a.throw(t))}catch(t){e(t)}}function o(t){var e;t.done?r(t.value):((e=t.value)instanceof u?e:new u(function(t){t(e)})).then(n,s)}o((a=a.apply(t,i||[])).next())})},s=function(r,n){var s,o,i,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]},t={next:e(0),throw:e(1),return:e(2)};return"function"==typeof Symbol&&(t[Symbol.iterator]=function(){return this}),t;function e(e){return function(t){return function(e){if(s)throw new TypeError("Generator is already executing.");for(;u;)try{if(s=1,o&&(i=2&e[0]?o.return:e[0]?o.throw||((i=o.return)&&i.call(o),0):o.next)&&!(i=i.call(o,e[1])).done)return i;switch(o=0,(e=i?[2&e[0],i.value]:e)[0]){case 0:case 1:i=e;break;case 4:return u.label++,{value:e[1],done:!1};case 5:u.label++,o=e[1],e=[0];continue;case 7:e=u.ops.pop(),u.trys.pop();continue;default:if(!(i=0<(i=u.trys).length&&i[i.length-1])&&(6===e[0]||2===e[0])){u=0;continue}if(3===e[0]&&(!i||e[1]>i[0]&&e[1]<i[3])){u.label=e[1];break}if(6===e[0]&&u.label<i[1]){u.label=i[1],i=e;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(e);break}i[2]&&u.ops.pop(),u.trys.pop();continue}e=n.call(r,u)}catch(t){e=[6,t],o=0}finally{s=i=0}if(5&e[0])throw e[1];return{value:e[0]?e[1]:void 0,done:!0}}([e,t])}}},c=new t("ws://localhost:6800/jsonrpc","arcticfox");!function(){n(this,void 0,void 0,function(){var e,r;return s(this,function(t){switch(t.label){case 0:return t.trys.push([0,2,,3]),[4,c.changeOption("0000000000000000",{"max-download-limit":"2M","max-upload-limit":"2M"})];case 1:return e=t.sent(),[3,3];case 2:return r=t.sent(),console.log("Error: ",r),[3,3];case 3:return c.onNotify("aria2.onDownloadStart",function(t){console.log("aria2.startDownload('"+t.gid+"');")}),c.onNotify("aria2.onBtDownloadComplete",function(t){console.log("aria2.btDownloadComplete('"+t.gid+"');")}),console.log(e),[2]}})})}()});
