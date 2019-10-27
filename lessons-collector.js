!function(t){var e={};function n(s){if(e[s])return e[s].exports;var r=e[s]={i:s,l:!1,exports:{}};return t[s].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=e,n.d=function(t,e,s){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(s,r,function(e){return t[e]}.bind(null,r));return s},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="https://localhost:3002/",n(n.s=25)}({0:function(t,e,n){"use strict";n.d(e,"a",(function(){return s}));class s{static fileNameNormalize(t){let e=t.trim().split(""),n={"\\":"_","/":"_",":":"-","*":"_","?":"7",'"':"'","<":"{",">":"}","|":" l "};return(e=e.map(t=>n[t]||t)).join("")}static fileNameExt(t){let e=t.match(/.*(\.\w*)/i);return e&&e[1]}static blob2base64(t){return new Promise(e=>{let n=new FileReader;n.onload=t=>e(t.target.result),n.readAsDataURL(t)})}static StrBytes(t){var e,n,s,r=0,a=t.length;for(s=0;s<a;s++)(e=t.charCodeAt(s))>=55296&&e<57344&&e<56320&&s+1<a&&(n=t.charCodeAt(s+1))>=56320&&n<57344?(r+=4,s++):r+=e<128?1:e<2048?2:3;return r}static Percent(t,e,n=2){if(0===e)return(0).toFixed(n);return(100*t/e).toFixed(n)}static FileSize(t=0,e=!1){if(t=+t,isNaN(t))return!1;let n=0,s=["Б","КБ","МБ","ГБ","ТБ"];function r(t){return t>1024&&n<4?(n++,r(t/1024)):t}return e?{size:r(t),level:n,unit:s[n]}:`${r(t).toFixed(1)} ${s[n]}`}static UrlParse(t){var e={},n=t.match(/(http\:\/\/|https\:\/\/|ftp\:\/\/|file\:\/\/\/)(.*?\/)(.*\/)*(.*)(\/.*\.(.*))*/i);if(e.schema=n[1],e.host=n[2],n[3]&&(e.path=n[3].split("/"),e.path=e.path.filter((function(t){return t.length>0}))),n[4]){var s=n[4].split(".");if(s.length>1){var r=s.pop(),a=s.join(".");e.file={fileName:a+"."+r,name:a,ext:r}}else e.path.push(n[4])}return e}static TimeNormalizer(t=0,e=!1,n=!1){if("number"!=typeof t||t<0)return!1;let s=[],r=t/1e3,a={day:"д",hour:"ч",min:"мин",sec:"с",msec:"мс"},i=60,o=3600,l=86400,c=!1;function u(t,e){e<=0&&!c||(c=!0,s.push({unit:a[t],value:e}))}let h=Math.floor(r/l);u("day",h),r-=h*l;let d=Math.floor(r/o);u("hour",d),r-=d*o,u("min",Math.floor(r/i));let f=Math.floor(r%60);(!e&&!c||f>0)&&(c=!0,u("sec",f));let m=Math.round(1e3*(r%60-f));return!e&&c||(c=!0,u("msec",m)),n?s:s.reduce((t,e,n)=>t+`${n>0?" ":""}${e.value}${e.unit}`,"")}}},25:function(t,e,n){"use strict";n.r(e);var s=n(4),r=n.n(s),a=n(0);class i{static async collectLessonsData(){let t=document.querySelector("#lessons-list").querySelectorAll(".lessons-item"),e=[];return t.forEach((t,n)=>{let s={index:n,name_prefix:a.a.fileNameNormalize(t.querySelector('[itemprop="name"]').textContent),name_concat:" ",lesson_name:a.a.fileNameNormalize(t.querySelector(".lessons-name").textContent),storage_name:n,url:t.querySelector('[itemprop="url"]').href,ext:a.a.UrlParse(t.querySelector('[itemprop="url"]').href).file.ext,content:null,mime:null,total:0,loaded:0,percent:0,is_checked:!0,is_loading:!1,is_loaded:!1,was_loaded:!1};e.push(s)}),e}static async collectMaterials(t,e){let n=document.querySelectorAll(".container>a[title]");if(0===n.length)return!1;let s=[];return n.forEach((r,i)=>{let o="Материалы курса";n.length>1&&(o+=` [${i+1}]`);let l={index:t+i,name_prefix:o,name_concat:" - ",lesson_name:a.a.fileNameNormalize(e),storage_name:a.a.UrlParse(r.href).file.name,url:r.href,ext:a.a.UrlParse(r.href).file.ext,content:null,mime:null,total:0,loaded:0,percent:0,is_checked:!0,is_loading:!1,is_loaded:!1,was_loaded:!1};s.push(l)}),s}}function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}class l{constructor(t=[]){o(this,"running",!1),o(this,"rafId",0),o(this,"tasks",[]),o(this,"add",t=>{let e=[],n=!1;return t instanceof Array?(n=[],e=t):t instanceof Object&&e.push(t),e.forEach(t=>{if(!t.condition||"function"!=typeof t.condition)return void console.warn("Launcher: не передано условие",t);if(!t.callback||"function"!=typeof t.callback)return void console.warn("Launcher: не передан коллбек",t);t.attempts=t.attempts||1/0,t.tryNum=0,t.run=t.run||!1,t.complete=null,this.tasks.push(t);let e=this.tasks.length-1;n instanceof Array?n.push(e):n=e}),this._launch(),n}),o(this,"hasActive",()=>this.tasks.some(t=>t.run)),o(this,"_launch",t=>{(this.rafId===t||!this.running&&this.hasActive())&&(this.running=!0,this.tasks.forEach((t,e)=>{t.run&&(t.condition.call(this)?(console.log(`Выполнен таск ${t.name} за ${t.tryNum} попыток`),this.stop(e),t.complete=!0,t.callback.call(this,"function"==typeof t.arg?t.arg.call(this,e):t.arg)):t.condition.call(this)||(t.tryNum++,t.tryNum>=t.attempts&&(this.stop(e),t.complete=!1)))}),this.hasActive()?this.rafId=requestAnimationFrame(()=>this._launch(this.rafId)):this.stop())}),o(this,"_runTask",(t,e)=>{let n=this.findIndex(t);return!1!==n&&(!(!e&&this.tasks[n].run)&&(this.tasks[n].run=!0,this.tasks[n].complete=null,e&&(this.tasks[n].arg=e),n))}),o(this,"run",(...t)=>{let e;return 0===t.length?(e=[],this.tasks.forEach((t,n)=>{this._runTask(n),e.push(n)})):1===t.length?e=this._runTask(t[0]):2===t.length&&(e=this._runTask(t[0],t[1])),this._launch(),e}),o(this,"stop",t=>{let e;if(void 0!==t){let n=this._stopTask(t);if(!1===n)return!1;e=n}else e=[],this.tasks.forEach((t,n)=>{this._stopTask(n),e.push(n)}),this.running=!1,cancelAnimationFrame(this.rafId),this.rafId=0;return e}),o(this,"remove",t=>{let e;if(void 0!==t){let n=this._removeTask(t);if(!1===n)return!1;e=n}else e=[],this.tasks.forEach((t,n)=>{e.push(n)}),this.tasks=[];return e}),this.add(t)}findIndex(t){let e;if("number"==typeof t&&this.tasks[t])e=t;else{if("string"!=typeof t)return!1;this.tasks.forEach((n,s)=>{n.name===t&&(e=s)}),e=void 0!==e&&e}return e}getTask(t){let e=this.findIndex(t);return!1!==e&&this.tasks[e]}_stopTask(t){let e=this.findIndex(t);return!1!==e&&(!!this.tasks[e].run&&(this.tasks[e].run=!1,this.tasks[e].tryNum=0,this.tasks[e].complete=!1,e))}_removeTask(t){let e=this.findIndex(t);return!1!==e&&(this.tasks.splice(e,1),e)}}window.lessonsCollector=new class{constructor(){var t,e,n;n=async()=>{this.json={url:window.location.href,course_name:"",course_display_name:"",lesson_items:[]};let t=a.a.UrlParse(document.location.href);t=t.path.pop(),this.setCourseName(t);let e=document.querySelector("h1.hero-title").textContent;this.setCourseDisplayName(e),await this.collectLessonItems(),await this.collectMaterials(),r()(JSON.stringify(this.json," ",4),`${a.a.fileNameNormalize(e)}.json`,"application/json"),this.createBtnLoader()},(e="collectLessons")in(t=this)?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,this.createBtnTask={name:"createBtnTask",condition:()=>{return null!==document.querySelector("#lessons-toggle")},callback:()=>{this.createBtn()}},this.taskLauncher=new l([this.createBtnTask]),this.json={url:window.location.href,course_name:"",course_display_name:"",lesson_items:[]},this.btn=null,this.btnLoader=null,this.init()}get cnt(){return this.json.lesson_items.length}get getCourseDisplayName(){return this.json.course_display_name}createBtn(){if(this.btn)return;this.btn=document.createElement("button"),this.btn.id="lessons-collector",this.btn.className="btn mt-20 ml-20",this.btn.textContent="Скачать json с уроками",this.btn.addEventListener("click",this.collectLessons),document.querySelector("#lessons-toggle").after(this.btn)}createBtnLoader(){this.btnLoader||(this.btnLoader=document.createElement("a"),this.btnLoader.id="lessons-loader",this.btnLoader.className="btn mt-20 ml-20",this.btnLoader.textContent="Перейти на страницу скачивания",this.btnLoader.href="https://neyasbltb88.github.io/coursehunters-loader-v3/",this.btnLoader.target="_blank",this.btn.after(this.btnLoader))}async collectLessonItems(){let t=await i.collectLessonsData();t&&t.forEach(t=>this.addItem(t))}async collectMaterials(){try{let t=await i.collectMaterials(this.cnt,this.getCourseDisplayName);t.length>0&&t.forEach(t=>this.addItem(t))}catch(t){}}addItem(t){this.json.lesson_items.push(t)}setCourseName(t){this.json.course_name=t}setCourseDisplayName(t){this.json.course_display_name=t}init(){this.taskLauncher.run("createBtnTask")}destroy(){this.btn&&(this.btn.remove(),this.btn=null),this.btnLoader&&(this.btnLoader.remove(),this.btnLoader=null)}}},4:function(t,e,n){var s,r,a;r=[],void 0===(a="function"==typeof(s=function(){return function t(e,n,s){var r,a,i=window,o="application/octet-stream",l=s||o,c=e,u=!n&&!s&&c,h=document.createElement("a"),d=function(t){return String(t)},f=i.Blob||i.MozBlob||i.WebKitBlob||d,m=n||"download";if(f=f.call?f.bind(i):Blob,"true"===String(this)&&(l=(c=[c,l])[0],c=c[1]),u&&u.length<2048&&(m=u.split("/").pop().split("?")[0],h.href=u,-1!==h.href.indexOf(u))){var p=new XMLHttpRequest;return p.open("GET",u,!0),p.responseType="blob",p.onload=function(e){t(e.target.response,m,o)},setTimeout((function(){p.send()}),0),p}if(/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(c)){if(!(c.length>2096103.424&&f!==d))return navigator.msSaveBlob?navigator.msSaveBlob(v(c),m):_(c);l=(c=v(c)).type||o}else if(/([\x80-\xff])/.test(c)){for(var b=0,y=new Uint8Array(c.length),g=y.length;b<g;++b)y[b]=c.charCodeAt(b);c=new f([y],{type:l})}function v(t){for(var e=t.split(/[:;,]/),n=e[1],s=("base64"==e[2]?atob:decodeURIComponent)(e.pop()),r=s.length,a=0,i=new Uint8Array(r);a<r;++a)i[a]=s.charCodeAt(a);return new f([i],{type:n})}function _(t,e){if("download"in h)return h.href=t,h.setAttribute("download",m),h.className="download-js-link",h.innerHTML="downloading...",h.style.display="none",document.body.appendChild(h),setTimeout((function(){h.click(),document.body.removeChild(h),!0===e&&setTimeout((function(){i.URL.revokeObjectURL(h.href)}),250)}),66),!0;if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent))return/^data:/.test(t)&&(t="data:"+t.replace(/^data:([\w\/\-\+]+)/,o)),window.open(t)||confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")&&(location.href=t),!0;var n=document.createElement("iframe");document.body.appendChild(n),!e&&/^data:/.test(t)&&(t="data:"+t.replace(/^data:([\w\/\-\+]+)/,o)),n.src=t,setTimeout((function(){document.body.removeChild(n)}),333)}if(r=c instanceof f?c:new f([c],{type:l}),navigator.msSaveBlob)return navigator.msSaveBlob(r,m);if(i.URL)_(i.URL.createObjectURL(r),!0);else{if("string"==typeof r||r.constructor===d)try{return _("data:"+l+";base64,"+i.btoa(r))}catch(t){return _("data:"+l+","+encodeURIComponent(r))}(a=new FileReader).onload=function(t){_(this.result)},a.readAsDataURL(r)}return!0}})?s.apply(e,r):s)||(t.exports=a)}});