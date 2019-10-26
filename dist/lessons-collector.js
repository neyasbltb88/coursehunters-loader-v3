!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="https://localhost:3002/",n(n.s=25)}({0:function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));class r{static fileNameNormalize(e){let t=e.trim().split(""),n={"\\":"_","/":"_",":":"-","*":"_","?":"7",'"':"'","<":"{",">":"}","|":" l "};return(t=t.map(e=>n[e]||e)).join("")}static fileNameExt(e){let t=e.match(/.*(\.\w*)/i);return t&&t[1]}static blob2base64(e){return new Promise(t=>{let n=new FileReader;n.onload=e=>t(e.target.result),n.readAsDataURL(e)})}static StrBytes(e){var t,n,r,o=0,a=e.length;for(r=0;r<a;r++)(t=e.charCodeAt(r))>=55296&&t<57344&&t<56320&&r+1<a&&(n=e.charCodeAt(r+1))>=56320&&n<57344?(o+=4,r++):o+=t<128?1:t<2048?2:3;return o}static Percent(e,t,n=2){if(0===t)return(0).toFixed(n);return(100*e/t).toFixed(n)}static FileSize(e=0,t=!1){if(e=+e,isNaN(e))return!1;let n=0,r=["Б","КБ","МБ","ГБ","ТБ"];function o(e){return e>1024&&n<4?(n++,o(e/1024)):e}return t?{size:o(e),level:n,unit:r[n]}:`${o(e).toFixed(1)} ${r[n]}`}static UrlParse(e){var t={},n=e.match(/(http\:\/\/|https\:\/\/|ftp\:\/\/)(.*?\..*?\/)(.*\/)*(.*)(\/.*\.(.*))*/i);if(t.schema=n[1],t.host=n[2],t.path=n[3].split("/"),t.path=t.path.filter((function(e){return e.length>0})),n[4]){var r=n[4].split(".");if(r.length>1){var o=r.pop(),a=r.join(".");t.file={fileName:a+"."+o,name:a,ext:o}}else t.path.push(n[4])}return t}static TimeNormalizer(e=0,t=!1,n=!1){if("number"!=typeof e||e<0)return!1;let r=[],o=e/1e3,a={day:"д",hour:"ч",min:"мин",sec:"с",msec:"мс"},s=60,i=3600,l=86400,c=!1;function u(e,t){t<=0&&!c||(c=!0,r.push({unit:a[e],value:t}))}let d=Math.floor(o/l);u("day",d),o-=d*l;let h=Math.floor(o/i);u("hour",h),o-=h*i,u("min",Math.floor(o/s));let m=Math.floor(o%60);(!t&&!c||m>0)&&(c=!0,u("sec",m));let f=Math.round(1e3*(o%60-m));return!t&&c||(c=!0,u("msec",f)),n?r:r.reduce((e,t,n)=>e+`${n>0?" ":""}${t.value}${t.unit}`,"")}}},25:function(e,t,n){"use strict";n.r(t);var r=n(4),o=n.n(r),a=n(0);class s{static async collectLessonsData(){let e=document.querySelector("#lessons-list").querySelectorAll(".lessons-item"),t=[];return e.forEach((e,n)=>{let r={index:n,name_prefix:a.a.fileNameNormalize(e.querySelector('[itemprop="name"]').textContent),name_concat:" ",lesson_name:a.a.fileNameNormalize(e.querySelector(".lessons-name").textContent),storage_name:n,url:e.querySelector('[itemprop="url"]').href,ext:a.a.UrlParse(e.querySelector('[itemprop="url"]').href).file.ext,content:null,mime:null,total:0,loaded:0,percent:0,is_checked:!0,is_loading:!1,is_loaded:!1,was_loaded:!1};t.push(r)}),t}static async collectMaterials(e,t){let n=document.querySelector('[title="Download course materials"]');return!!n&&{index:e,name_prefix:"Материалы курса",name_concat:" - ",lesson_name:a.a.fileNameNormalize(t),storage_name:"code",url:n.href,ext:a.a.UrlParse(n.href).file.ext,content:null,mime:null,total:0,loaded:0,percent:0,is_checked:!0,is_loading:!1,is_loaded:!1,was_loaded:!1}}}window.lessonsCollector=new class{constructor(){var e,t,n;n=async()=>{let e=a.a.UrlParse(document.location.href);e=e.path.pop(),this.setCourseName(e);let t=document.querySelector("h1.hero-title").textContent;this.setCourseDisplayName(t),await this.collectLessonItems(),await this.collectMaterials(),o()(JSON.stringify(this.json," ",4),`${a.a.fileNameNormalize(t)}.json`,"application/json"),this.createBtnLoader()},(t="collectLessons")in(e=this)?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,this.json={url:window.location.href,course_name:"",course_display_name:"",lesson_items:[]},this.btn=null,this.btnLoader=null,this.init()}get cnt(){return this.json.lesson_items.length}get getCourseDisplayName(){return this.json.course_display_name}createBtn(){if(this.btn)return;this.btn=document.createElement("button"),this.btn.id="lessons-collector",this.btn.className="btn mt-20 ml-20",this.btn.textContent="Скачать json с уроками",this.btn.addEventListener("click",this.collectLessons),document.querySelector("#lessons-toggle").after(this.btn)}createBtnLoader(){this.btnLoader||(this.btnLoader=document.createElement("a"),this.btnLoader.id="lessons-loader",this.btnLoader.className="btn mt-20 ml-20",this.btnLoader.textContent="Перейти на страницу скачивания",this.btnLoader.href="https://neyasbltb88.github.io/coursehunters-loader-v3/",this.btnLoader.target="_blank",this.btn.after(this.btnLoader))}async collectLessonItems(){let e=await s.collectLessonsData();e&&e.forEach(e=>this.addItem(e))}async collectMaterials(){try{let e=await s.collectMaterials(this.cnt,this.getCourseDisplayName);e&&this.addItem(e)}catch(e){}}addItem(e){this.json.lesson_items.push(e)}setCourseName(e){this.json.course_name=e}setCourseDisplayName(e){this.json.course_display_name=e}init(){this.createBtn()}destroy(){this.btn&&(this.btn.remove(),this.btn=null),this.btnLoader&&(this.btnLoader.remove(),this.btnLoader=null)}}},4:function(e,t,n){var r,o,a;o=[],void 0===(a="function"==typeof(r=function(){return function e(t,n,r){var o,a,s=window,i="application/octet-stream",l=r||i,c=t,u=!n&&!r&&c,d=document.createElement("a"),h=function(e){return String(e)},m=s.Blob||s.MozBlob||s.WebKitBlob||h,f=n||"download";if(m=m.call?m.bind(s):Blob,"true"===String(this)&&(l=(c=[c,l])[0],c=c[1]),u&&u.length<2048&&(f=u.split("/").pop().split("?")[0],d.href=u,-1!==d.href.indexOf(u))){var p=new XMLHttpRequest;return p.open("GET",u,!0),p.responseType="blob",p.onload=function(t){e(t.target.response,f,i)},setTimeout((function(){p.send()}),0),p}if(/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(c)){if(!(c.length>2096103.424&&m!==h))return navigator.msSaveBlob?navigator.msSaveBlob(v(c),f):w(c);l=(c=v(c)).type||i}else if(/([\x80-\xff])/.test(c)){for(var b=0,y=new Uint8Array(c.length),g=y.length;b<g;++b)y[b]=c.charCodeAt(b);c=new m([y],{type:l})}function v(e){for(var t=e.split(/[:;,]/),n=t[1],r=("base64"==t[2]?atob:decodeURIComponent)(t.pop()),o=r.length,a=0,s=new Uint8Array(o);a<o;++a)s[a]=r.charCodeAt(a);return new m([s],{type:n})}function w(e,t){if("download"in d)return d.href=e,d.setAttribute("download",f),d.className="download-js-link",d.innerHTML="downloading...",d.style.display="none",document.body.appendChild(d),setTimeout((function(){d.click(),document.body.removeChild(d),!0===t&&setTimeout((function(){s.URL.revokeObjectURL(d.href)}),250)}),66),!0;if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent))return/^data:/.test(e)&&(e="data:"+e.replace(/^data:([\w\/\-\+]+)/,i)),window.open(e)||confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")&&(location.href=e),!0;var n=document.createElement("iframe");document.body.appendChild(n),!t&&/^data:/.test(e)&&(e="data:"+e.replace(/^data:([\w\/\-\+]+)/,i)),n.src=e,setTimeout((function(){document.body.removeChild(n)}),333)}if(o=c instanceof m?c:new m([c],{type:l}),navigator.msSaveBlob)return navigator.msSaveBlob(o,f);if(s.URL)w(s.URL.createObjectURL(o),!0);else{if("string"==typeof o||o.constructor===h)try{return w("data:"+l+";base64,"+s.btoa(o))}catch(e){return w("data:"+l+","+encodeURIComponent(o))}(a=new FileReader).onload=function(e){w(this.result)},a.readAsDataURL(o)}return!0}})?r.apply(t,o):r)||(e.exports=a)}});