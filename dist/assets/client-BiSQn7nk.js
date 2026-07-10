var e=typeof globalThis<`u`?globalThis:typeof self<`u`?self:typeof window<`u`?window:Function(`return this`)(),t=__DEFINES__;Object.keys(t).forEach(n=>{let r=n.split(`.`),i=e;for(let e=0;e<r.length;e++){let a=r[e];e===r.length-1?i[a]=t[n]:i=i[a]||(i[a]={})}});var n=`modulepreload`,r=function(e){return`/`+e},i={},a=function(e,t,a){let o=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),s=document.querySelector(`meta[property=csp-nonce]`),c=s?.nonce||s?.getAttribute(`nonce`);function l(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function u(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,new URL(`../../../src/node/plugins/importAnalysisBuild.ts`,import.meta.url)).href}o=l(t.map(t=>{if(t=r(t,a),t=u(t),t in i)return;i[t]=!0;let o=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let r=e[n];if(r.href===t&&(!o||r.rel===`stylesheet`))return}let s=document.createElement(`link`);if(s.rel=o?`stylesheet`:n,o||(s.as=`script`),s.crossOrigin=``,s.href=t,c&&s.setAttribute(`nonce`,c),document.head.appendChild(s),o)return new Promise((e,n)=>{s.addEventListener(`load`,e),s.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function s(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return o.then(t=>{for(let e of t||[])e.status===`rejected`&&s(e.reason);return e().catch(s)})},o=`useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict`,s=(e=21)=>{let t=``,n=e|0;for(;n-->0;)t+=o[Math.random()*64|0];return t};function c(e){"@babel/helpers - typeof";return c=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},c(e)}function l(e,t){if(c(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(c(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function u(e){var t=l(e,`string`);return c(t)==`symbol`?t:t+``}function d(e,t,n){return(t=u(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var f=class{constructor(e,t){this.hmrClient=e,this.ownerPath=t,d(this,`newListeners`,void 0),e.dataMap.has(t)||e.dataMap.set(t,{});let n=e.hotModulesMap.get(t);n&&(n.callbacks=[]);let r=e.ctxToListenersMap.get(t);if(r)for(let[t,n]of r){let r=e.customListenersMap.get(t);r&&e.customListenersMap.set(t,r.filter(e=>!n.includes(e)))}this.newListeners=new Map,e.ctxToListenersMap.set(t,this.newListeners)}get data(){return this.hmrClient.dataMap.get(this.ownerPath)}accept(e,t){if(typeof e==`function`||!e)this.acceptDeps([this.ownerPath],([t])=>e?.(t));else if(typeof e==`string`)this.acceptDeps([e],([e])=>t?.(e));else if(Array.isArray(e))this.acceptDeps(e,t);else throw Error(`invalid hot.accept() usage.`)}acceptExports(e,t){this.acceptDeps([this.ownerPath],([e])=>t?.(e))}dispose(e){this.hmrClient.disposeMap.set(this.ownerPath,e)}prune(e){this.hmrClient.pruneMap.set(this.ownerPath,e)}decline(){}invalidate(e){let t=this.hmrClient.currentFirstInvalidatedBy??this.ownerPath;this.hmrClient.notifyListeners(`vite:invalidate`,{path:this.ownerPath,message:e,firstInvalidatedBy:t}),this.send(`vite:invalidate`,{path:this.ownerPath,message:e,firstInvalidatedBy:t}),this.hmrClient.logger.debug(`invalidate ${this.ownerPath}${e?`: ${e}`:``}`)}on(e,t){let n=n=>{let r=n.get(e)||[];r.push(t),n.set(e,r)};n(this.hmrClient.customListenersMap),n(this.newListeners)}off(e,t){let n=n=>{let r=n.get(e);if(r===void 0)return;let i=r.filter(e=>e!==t);if(i.length===0){n.delete(e);return}n.set(e,i)};n(this.hmrClient.customListenersMap),n(this.newListeners)}send(e,t){this.hmrClient.send({type:`custom`,event:e,data:t})}acceptDeps(e,t=()=>{}){let n=this.hmrClient.hotModulesMap.get(this.ownerPath)||{id:this.ownerPath,callbacks:[]};n.callbacks.push({deps:e,fn:t}),this.hmrClient.hotModulesMap.set(this.ownerPath,n)}},ee=class{constructor(e,t,n){this.logger=e,this.transport=t,this.importUpdatedModule=n,d(this,`hotModulesMap`,new Map),d(this,`disposeMap`,new Map),d(this,`pruneMap`,new Map),d(this,`dataMap`,new Map),d(this,`customListenersMap`,new Map),d(this,`ctxToListenersMap`,new Map),d(this,`currentFirstInvalidatedBy`,void 0),d(this,`updateQueue`,[]),d(this,`pendingUpdateQueue`,!1)}async notifyListeners(e,t){let n=this.customListenersMap.get(e);n&&await Promise.allSettled(n.map(e=>e(t)))}send(e){this.transport.send(e).catch(e=>{this.logger.error(e)})}clear(){this.hotModulesMap.clear(),this.disposeMap.clear(),this.pruneMap.clear(),this.dataMap.clear(),this.customListenersMap.clear(),this.ctxToListenersMap.clear()}async prunePaths(e){await Promise.all(e.map(e=>{let t=this.disposeMap.get(e);if(t)return t(this.dataMap.get(e))})),await Promise.all(e.map(e=>{let t=this.pruneMap.get(e);if(t)return t(this.dataMap.get(e))}))}warnFailedUpdate(e,t){(!(e instanceof Error)||!e.message.includes(`fetch`))&&this.logger.error(e),this.logger.error(`Failed to reload ${t}. This could be due to syntax errors or importing non-existent modules. (see errors above)`)}async queueUpdate(e){if(this.updateQueue.push(this.fetchUpdate(e)),!this.pendingUpdateQueue){this.pendingUpdateQueue=!0,await Promise.resolve(),this.pendingUpdateQueue=!1;let e=[...this.updateQueue];this.updateQueue=[],(await Promise.all(e)).forEach(e=>e&&e())}}async fetchUpdate(e){let{path:t,acceptedPath:n,firstInvalidatedBy:r}=e,i=this.hotModulesMap.get(t);if(!i)return;let a,o=t===n,s=i.callbacks.filter(({deps:e})=>e.includes(n));if(o||s.length>0){let t=this.disposeMap.get(n);t&&await t(this.dataMap.get(n));try{a=await this.importUpdatedModule(e)}catch(e){this.warnFailedUpdate(e,n)}}return()=>{try{this.currentFirstInvalidatedBy=r;for(let{deps:e,fn:t}of s)t(e.map(e=>e===n?a:void 0));let e=o?t:`${n} via ${t}`;this.logger.debug(`hot updated: ${e}`)}finally{this.currentFirstInvalidatedBy=void 0}}}},te=`sourceMa`;te+=`ppingURL`,typeof process<`u`&&process.platform,(async function(){}).constructor;function ne(){let e,t;return{promise:new Promise((n,r)=>{e=n,t=r}),resolve:e,reject:t}}function p(e){let t=Error(e.message||`Unknown invoke error`);return Object.assign(t,e,{runnerError:Error(`RunnerError`)}),t}var re=e=>{if(e.invoke)return{...e,async invoke(t,n){let r=await e.invoke({type:`custom`,event:`vite:invoke`,data:{id:`send`,name:t,data:n}});if(`error`in r)throw p(r.error);return r.result}};if(!e.send||!e.connect)throw Error(`transport must implement send and connect when invoke is not implemented`);let t=new Map;return{...e,connect({onMessage:n,onDisconnection:r}){return e.connect({onMessage(e){if(e.type===`custom`&&e.event===`vite:invoke`){let n=e.data;if(n.id.startsWith(`response:`)){let e=n.id.slice(9),r=t.get(e);if(!r)return;r.timeoutId&&clearTimeout(r.timeoutId),t.delete(e);let{error:i,result:a}=n.data;i?r.reject(i):r.resolve(a);return}}n(e)},onDisconnection:r})},disconnect(){return t.forEach(e=>{e.reject(Error(`transport was disconnected, cannot call ${JSON.stringify(e.name)}`))}),t.clear(),e.disconnect?.()},send(t){return e.send(t)},async invoke(n,r){let i=s(),a={type:`custom`,event:`vite:invoke`,data:{name:n,id:`send:${i}`,data:r}},o=e.send(a),{promise:c,resolve:l,reject:u}=ne(),d=e.timeout??6e4,f;d>0&&(f=setTimeout(()=>{t.delete(i),u(Error(`transport invoke timed out after ${d}ms (data: ${JSON.stringify(a)})`))},d),f?.unref?.()),t.set(i,{resolve:l,reject:u,name:n,timeoutId:f}),o&&o.catch(e=>{clearTimeout(f),t.delete(i),u(e)});try{return await c}catch(e){throw p(e)}}}},m=e=>{let t=re(e),n=!t.connect,r;return{...e,...t.connect?{async connect(e){if(n)return;if(r){await r;return}let i=t.connect({onMessage:e??(()=>{}),onDisconnection(){n=!1}});i&&(r=i,await r,r=void 0),n=!0}}:{},...t.disconnect?{async disconnect(){n&&(r&&await r,n=!1,await t.disconnect())}}:{},async send(e){if(t.send){if(!n)if(r)await r;else throw new h(`send was called before connect`);await t.send(e)}},async invoke(e,i){if(!n)if(r)await r;else throw new h(`invoke was called before connect`);return t.invoke(e,i)}}},h=class extends Error{constructor(e){super(e),this.name=`SendBeforeConnectError`}},g=e=>{let t=e.pingInterval??3e4,n,r;return{async connect({onMessage:i,onDisconnection:a}){let o=e.createConnection();o.addEventListener(`message`,({data:e})=>{i(JSON.parse(e))});let s=o.readyState===o.OPEN;s||await new Promise((e,t)=>{o.addEventListener(`open`,()=>{s=!0,e()},{once:!0}),o.addEventListener(`close`,()=>{if(!s){t(Error(`WebSocket closed without opened.`));return}i({type:`custom`,event:`vite:ws:disconnect`,data:{webSocket:o}}),a()})}),i({type:`custom`,event:`vite:ws:connect`,data:{webSocket:o}}),n=o,r=setInterval(()=>{o.readyState===o.OPEN&&o.send(JSON.stringify({type:`ping`}))},t)},disconnect(){clearInterval(r),n?.close()},send(e){n.send(JSON.stringify(e))}}};function ie(e){let t=new ae;return n=>t.enqueue(()=>e(n))}var ae=class{constructor(){d(this,`queue`,[]),d(this,`pending`,!1)}enqueue(e){return new Promise((t,n)=>{this.queue.push({promise:e,resolve:t,reject:n}),this.dequeue()})}dequeue(){if(this.pending)return!1;let e=this.queue.shift();return e?(this.pending=!0,e.promise().then(e.resolve).catch(e.reject).finally(()=>{this.pending=!1,this.dequeue()}),!0):!1}};function _(e,t,n=globalThis.console){if(!t.enabled)return;async function r(t,n){await e.send({type:`custom`,event:`vite:forward-console`,data:{type:t,data:{name:n?.name||`Unknown Error`,message:n?.message||String(n),stack:n?.stack}}})}async function i(t,n){try{await e.send({type:`custom`,event:`vite:forward-console`,data:{type:`log`,data:{level:t,message:oe(n)}}})}catch(e){try{await r(`unhandled-rejection`,e)}catch(e){e instanceof h||a(`Failed to send error to Vite server:`,e)}}}let a=n.error;for(let e of t.logLevels){let t=n[e];typeof t==`function`&&(n[e]=(...n)=>{t(...n),i(e,n)})}t.unhandledErrors&&typeof window<`u`&&(window.addEventListener(`error`,async e=>{let t=e.error??(e.message?Error(e.message):e);try{await r(`error`,t)}catch(e){e instanceof h||a(`Failed to send error to Vite server:`,e)}}),window.addEventListener(`unhandledrejection`,async e=>{try{await r(`unhandled-rejection`,e.reason)}catch(e){e instanceof h||a(`Failed to send error to Vite server:`,e)}}))}function oe(e){if(e.length===0)return``;if(typeof e[0]!=`string`)return e.map(e=>v(e)).join(` `);let t=e.length,n=1,r=e[0].replace(/%[sdjifoOc%]/g,r=>{if(r===`%%`)return`%`;if(n>=t)return r;let i=e[n++];switch(r){case`%s`:return typeof i==`bigint`?`${i.toString()}n`:typeof i==`object`&&i?v(i):String(i);case`%d`:return typeof i==`bigint`?`${i.toString()}n`:typeof i==`symbol`?`NaN`:Number(i).toString();case`%i`:return typeof i==`bigint`?`${i.toString()}n`:Number.parseInt(String(i),10).toString();case`%f`:return Number.parseFloat(String(i)).toString();case`%o`:case`%O`:return v(i);case`%j`:try{return JSON.stringify(i)??`undefined`}catch{return`[Circular]`}case`%c`:return``;default:return r}});for(let i=e[n];n<t;i=e[++n])typeof i!=`object`||!i?r+=` ${typeof i==`symbol`?i.toString():String(i)}`:r+=` ${v(i)}`;return r}function v(e){if(typeof e==`string`)return e;if(typeof e==`number`||typeof e==`boolean`||e===void 0)return String(e);if(typeof e==`symbol`)return e.toString();if(typeof e==`function`)return e.name?`[Function: ${e.name}]`:`[Function]`;if(e instanceof Error)return e.stack||`${e.name}: ${e.message}`;if(typeof e==`bigint`)return`${e}n`;let t=new WeakSet;try{return JSON.stringify(e,(e,n)=>{if(typeof n==`bigint`)return`${n}n`;if(n instanceof Error)return{name:n.name,message:n.message,stack:n.stack};if(n&&typeof n==`object`){if(t.has(n))return`[Circular]`;t.add(n)}return n})??String(e)}catch{return String(e)}}var se=__HMR_CONFIG_NAME__,ce=__BASE__||`/`,y=`document`in globalThis?document.querySelector(`meta[property=csp-nonce]`)?.nonce:void 0;function b(e,t={},...n){let r=document.createElement(e);for(let[e,n]of Object.entries(t))n!==void 0&&r.setAttribute(e,n);return r.append(...n),r}var le=`
:host {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  --monospace: 'SFMono-Regular', Consolas,
  'Liberation Mono', Menlo, Courier, monospace;
  --red: #ff5555;
  --yellow: #e2aa53;
  --purple: #cfa4ff;
  --cyan: #2dd9da;
  --dim: #c9c9c9;

  --window-background: #181818;
  --window-color: #d8d8d8;
}

.backdrop {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  margin: 0;
  background: rgba(0, 0, 0, 0.66);
}

.window {
  font-family: var(--monospace);
  line-height: 1.5;
  max-width: 80vw;
  color: var(--window-color);
  box-sizing: border-box;
  margin: 30px auto;
  padding: 2.5vh 4vw;
  position: relative;
  background: var(--window-background);
  border-radius: 6px 6px 8px 8px;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
  overflow: hidden;
  border-top: 8px solid var(--red);
  direction: ltr;
  text-align: left;
}

pre {
  font-family: var(--monospace);
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 1em;
  overflow-x: scroll;
  scrollbar-width: none;
}

pre::-webkit-scrollbar {
  display: none;
}

pre.frame::-webkit-scrollbar {
  display: block;
  height: 5px;
}

pre.frame::-webkit-scrollbar-thumb {
  background: #999;
  border-radius: 5px;
}

pre.frame {
  scrollbar-width: thin;
}

.message {
  line-height: 1.3;
  font-weight: 600;
  white-space: pre-wrap;
}

.message-body {
  color: var(--red);
}

.plugin {
  color: var(--purple);
}

.file {
  color: var(--cyan);
  margin-bottom: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.frame {
  color: var(--yellow);
}

.stack {
  font-size: 13px;
  color: var(--dim);
}

.tip {
  font-size: 13px;
  color: #999;
  border-top: 1px dotted #999;
  padding-top: 13px;
  line-height: 1.8;
}

code {
  font-size: 13px;
  font-family: var(--monospace);
  color: var(--yellow);
}

.file-link {
  text-decoration: underline;
  cursor: pointer;
}

kbd {
  line-height: 1.5;
  font-family: ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: rgb(38, 40, 44);
  color: rgb(166, 167, 171);
  padding: 0.15rem 0.3rem;
  border-radius: 0.25rem;
  border-width: 0.0625rem 0.0625rem 0.1875rem;
  border-style: solid;
  border-color: rgb(54, 57, 64);
  border-image: initial;
}
`,x=()=>b(`div`,{class:`backdrop`,part:`backdrop`},b(`div`,{class:`window`,part:`window`},b(`pre`,{class:`message`,part:`message`},b(`span`,{class:`plugin`,part:`plugin`}),b(`span`,{class:`message-body`,part:`message-body`})),b(`pre`,{class:`file`,part:`file`}),b(`pre`,{class:`frame`,part:`frame`}),b(`pre`,{class:`stack`,part:`stack`}),b(`div`,{class:`tip`,part:`tip`},`Click outside, press `,b(`kbd`,{},`Esc`),` key, or fix the code to dismiss.`,b(`br`),`You can also disable this overlay by setting `,b(`code`,{part:`config-option-name`},`server.hmr.overlay`),` to `,b(`code`,{part:`config-option-value`},`false`),` in `,b(`code`,{part:`config-file-name`},se),`.`)),b(`style`,{nonce:y},le)),S=/(?:file:\/\/)?(?:[a-zA-Z]:\\|\/).*?:\d+:\d+/g,C=/^(?:>?\s*\d+\s+\|.*|\s+\|\s*\^.*)\r?\n/gm,{HTMLElement:w=class{}}=globalThis,T=class extends w{constructor(e,t=!0){super(),this.root=this.attachShadow({mode:`open`}),this.root.appendChild(x()),C.lastIndex=0;let n=e.frame&&C.test(e.frame),r=n?e.message.replace(C,``):e.message;e.plugin&&this.text(`.plugin`,`[plugin:${e.plugin}] `),this.text(`.message-body`,r.trim());let[i]=(e.loc?.file||e.id||`unknown file`).split(`?`);e.loc?this.text(`.file`,`${i}:${e.loc.line}:${e.loc.column}`,t):e.id&&this.text(`.file`,i),n&&this.text(`.frame`,e.frame.trim()),this.text(`.stack`,e.stack,t),this.root.querySelector(`.window`).addEventListener(`click`,e=>{e.stopPropagation()}),this.addEventListener(`click`,()=>{this.close()}),this.closeOnEsc=e=>{(e.key===`Escape`||e.code===`Escape`)&&this.close()},document.addEventListener(`keydown`,this.closeOnEsc)}text(e,t,n=!1){let r=this.root.querySelector(e);if(!n)r.textContent=t;else{let e=0,n;for(S.lastIndex=0;n=S.exec(t);){let{0:i,index:a}=n,o=t.slice(e,a);r.appendChild(document.createTextNode(o));let s=document.createElement(`a`);s.textContent=i,s.className=`file-link`,s.onclick=()=>{fetch(new URL(`${ce}__open-in-editor?file=${encodeURIComponent(i)}`,import.meta.url))},r.appendChild(s),e+=o.length+i.length}e<t.length&&r.appendChild(document.createTextNode(t.slice(e)))}}close(){this.parentNode?.removeChild(this),document.removeEventListener(`keydown`,this.closeOnEsc)}},E=`vite-error-overlay`,{customElements:D}=globalThis;D&&!D.get(`vite-error-overlay`)&&D.define(E,T),console.debug(`[vite] connecting...`);var O=new URL(import.meta.url),k=__SERVER_HOST__,A=__HMR_PROTOCOL__||(O.protocol===`https:`?`wss`:`ws`),j=__HMR_PORT__,M=`${__HMR_HOSTNAME__||O.hostname}:${j||O.port}${__HMR_BASE__}`,N=__HMR_DIRECT_TARGET__,P=__BASE__||`/`,F=__HMR_TIMEOUT__,I=__WS_TOKEN__,L=__BUNDLED_DEV__,R=__SERVER_FORWARD_CONSOLE__,z=m((()=>{let e=g({createConnection:()=>new WebSocket(`${A}://${M}?token=${I}`,`vite-hmr`),pingInterval:F});return{async connect(t){try{await e.connect(t)}catch(n){if(!j){e=g({createConnection:()=>new WebSocket(`${A}://${N}?token=${I}`,`vite-hmr`),pingInterval:F});try{await e.connect(t),console.info(`[vite] Direct websocket connection fallback. Check out https://vite.dev/config/server-options.html#server-hmr to remove the previous connection error.`)}catch(e){if(e instanceof Error&&e.message.includes(`WebSocket closed without opened.`)){let e=new URL(import.meta.url),t=e.host+e.pathname.replace(/@vite\/client$/,``);console.error(`[vite] failed to connect to websocket.
your current setup:
  (browser) ${t} <--[HTTP]--> ${k} (server)\n  (browser) ${M} <--[WebSocket (failing)]--> ${N} (server)\nCheck out your Vite / network configuration and https://vite.dev/config/server-options.html#server-hmr .`)}}return}throw console.error(`[vite] failed to connect to websocket (${n}). `),n}},async disconnect(){await e.disconnect()},send(t){e.send(t)}}})()),B=!1;typeof window<`u`&&window.addEventListener?.(`beforeunload`,()=>{B=!0});function V(e){let t=new URL(e,`http://vite.dev`);return t.searchParams.delete(`direct`),t.pathname+t.search}var H=!0,U=new WeakSet,W=(e=>{let t;return()=>{t&&=(clearTimeout(t),null),t=setTimeout(()=>{location.reload()},e)}})(20),G=new ee({error:e=>console.error(`[vite]`,e),debug:(...e)=>console.debug(`[vite]`,...e)},z,L?async function({url:e,acceptedPath:t,isWithinCircularImport:n}){let r=a(()=>import(P+e).then(()=>globalThis.__rolldown_runtime__.loadExports(t)),[]);return n&&r.catch(()=>{console.info(`[hmr] ${t} failed to apply HMR as it's within a circular import. Reloading page to reset the execution order. To debug and break the circular import, you can run \`vite --debug hmr\` to log the circular dependency path if a file change triggered it.`),W()}),await r}:async function({acceptedPath:e,timestamp:t,explicitImportRequired:n,isWithinCircularImport:r}){let[i,o]=e.split(`?`),s=a(()=>import(P+i.slice(1)+`?${n?`import&`:``}t=${t}${o?`&${o}`:``}`),[]);return r&&s.catch(()=>{console.info(`[hmr] ${e} failed to apply HMR as it's within a circular import. Reloading page to reset the execution order. To debug and break the circular import, you can run \`vite --debug hmr\` to log the circular dependency path if a file change triggered it.`),W()}),await s});z.connect(ie(ue)),_(z,R);async function ue(e){switch(e.type){case`connected`:console.debug(`[vite] connected.`);break;case`update`:if(await G.notifyListeners(`vite:beforeUpdate`,e),q)if(H&&fe()){location.reload();return}else K&&J(),H=!1;await Promise.all(e.updates.map(async e=>{if(e.type===`js-update`)return G.queueUpdate(e);let{path:t,timestamp:n}=e,r=V(t),i=Array.from(document.querySelectorAll(`link`)).find(e=>!U.has(e)&&V(e.href).includes(r));if(!i)return;let a=`${P}${r.slice(1)}${r.includes(`?`)?`&`:`?`}t=${n}`;return new Promise(e=>{let t=i.cloneNode();t.href=new URL(a,i.href).href;let n=()=>{i.remove(),console.debug(`[vite] css hot updated: ${r}`),e()};t.addEventListener(`load`,n),t.addEventListener(`error`,n),U.add(i),i.after(t)})})),await G.notifyListeners(`vite:afterUpdate`,e);break;case`custom`:if(await G.notifyListeners(e.event,e.data),e.event===`vite:ws:disconnect`&&q&&!B){console.log(`[vite] server connection lost. Polling for restart...`);let t=e.data.webSocket,n=new URL(t.url);n.search=``,await pe(n.href),location.reload()}break;case`full-reload`:if(await G.notifyListeners(`vite:beforeFullReload`,e),q)if(e.path&&e.path.endsWith(`.html`)){let t=decodeURI(location.pathname),n=P+e.path.slice(1);(t===n||e.path===`/index.html`||t.endsWith(`/`)&&t+`index.html`===n)&&W();return}else W();break;case`prune`:await G.notifyListeners(`vite:beforePrune`,e),await G.prunePaths(e.paths);break;case`error`:if(await G.notifyListeners(`vite:error`,e),q){let t=e.err;K?de(t):console.error(`[vite] Internal Server Error\n${t.message}\n${t.stack}`)}break;case`ping`:break;default:return e}}var K=__HMR_ENABLE_OVERLAY__,q=`document`in globalThis;function de(e){J();let{customElements:t}=globalThis;if(t){let n=t.get(E);document.body.appendChild(new n(e))}}function J(){document.querySelectorAll(E).forEach(e=>e.close())}function fe(){return document.querySelectorAll(E).length}function pe(e){if(typeof SharedWorker>`u`){let t={currentState:document.visibilityState,listeners:new Set};return document.addEventListener(`visibilitychange`,()=>{t.currentState=document.visibilityState;for(let e of t.listeners)e(t.currentState)}),Y(e,t)}let t=new Blob([`"use strict";`,`const waitForSuccessfulPingInternal = ${Y.toString()};`,`const fn = ${me.toString()};`,`fn(${JSON.stringify(e)})`],{type:`application/javascript`}),n=URL.createObjectURL(t),r=new SharedWorker(n);return new Promise((e,t)=>{let n=()=>{r.port.postMessage({visibility:document.visibilityState})};document.addEventListener(`visibilitychange`,n),r.port.addEventListener(`message`,i=>{document.removeEventListener(`visibilitychange`,n),r.port.close();let a=i.data;if(a.type===`error`){t(a.error);return}e()}),n(),r.port.start()})}function me(e){self.addEventListener(`connect`,t=>{let n=t.ports[0];if(!e){n.postMessage({type:`error`,error:Error(`socketUrl not found`)});return}let r={currentState:`visible`,listeners:new Set};n.addEventListener(`message`,e=>{let{visibility:t}=e.data;r.currentState=t,console.debug(`[vite] new window visibility`,t);for(let e of r.listeners)e(t)}),n.start(),console.debug(`[vite] connected from window`),Y(e,r).then(()=>{console.debug(`[vite] ping successful`);try{n.postMessage({type:`success`})}catch(e){n.postMessage({type:`error`,error:e})}},e=>{console.debug(`[vite] error happened`,e);try{n.postMessage({type:`error`,error:e})}catch(e){n.postMessage({type:`error`,error:e})}})})}async function Y(e,t,n=1e3){function r(e){return new Promise(t=>setTimeout(t,e))}async function i(){try{let t=new WebSocket(e,`vite-ping`);return new Promise(e=>{function n(){e(!0),i()}function r(){e(!1),i()}function i(){t.removeEventListener(`open`,n),t.removeEventListener(`error`,r),t.close()}t.addEventListener(`open`,n),t.addEventListener(`error`,r)})}catch{return!1}}function a(e){return new Promise(t=>{let n=r=>{r===`visible`&&(t(),e.listeners.delete(n))};e.listeners.add(n)})}if(!await i())for(await r(n);;)if(t.currentState===`visible`){if(await i())break;await r(n)}else await a(t)}var X=new Map,Z=new Map;`document`in globalThis&&(document.querySelectorAll(`style[data-vite-dev-id]`).forEach(e=>{X.set(e.getAttribute(`data-vite-dev-id`),e)}),document.querySelectorAll(`link[rel="stylesheet"][data-vite-dev-id]`).forEach(e=>{Z.set(e.getAttribute(`data-vite-dev-id`),e)}));var Q;function he(e,t){if(Z.has(e))return;let n=X.get(e);n?n.textContent=t:(n=document.createElement(`style`),n.setAttribute(`type`,`text/css`),n.setAttribute(`data-vite-dev-id`,e),n.textContent=t,y&&n.setAttribute(`nonce`,y),Q?Q.insertAdjacentElement(`afterend`,n):(document.head.appendChild(n),setTimeout(()=>{Q=void 0},0)),Q=n),X.set(e,n)}function ge(e){Z.has(e)&&(document.querySelectorAll(`link[rel="stylesheet"][data-vite-dev-id="${CSS.escape(e)}"]`).forEach(e=>e.remove()),Z.delete(e));let t=X.get(e);t&&(document.head.removeChild(t),X.delete(e))}function _e(e){return new f(G,e)}if(L&&typeof DevRuntime<`u`){var $;class e extends DevRuntime{createModuleHotContext(e){let t=_e(e);return t._internal={updateStyle:he,removeStyle:ge},t}applyUpdates(e){}}let t=s();z.send({type:`custom`,event:`vite:module-loaded`,data:{modules:[],clientId:t}}),($=globalThis).__rolldown_runtime__??($.__rolldown_runtime__=new e({send(e){switch(e.type){case`hmr:module-registered`:z.send({type:`custom`,event:`vite:module-loaded`,data:{modules:e.modules.slice(),clientId:t}});break;default:throw Error(`Unknown message type: ${JSON.stringify(e)}`)}}},t))}