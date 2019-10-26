import Vue from 'vue';
import App from './components/App.vue';
import store from './store';
// import './style.sass';
import './style.css';

import Utils from '../utils';
window.Utils = Utils;

import Loader from '../loader';
window.Loader = new Loader();

import Downloader from 'downloadjs';
window.Downloader = Downloader;

import SStorage from '../sstorage';
window.SStorage = SStorage;

Vue.config.productionTip = false;

window.CoursehuntersLoaderInit = false;

window.runCoursehuntersLoader = function() {
    if (window.CoursehuntersLoaderInit) return;

    clearTimeout(CoursehuntersLoaderInitTimeout);
    window.CoursehuntersLoaderInit = true;
    // Создание блока, в который будет монтироваться vue
    let app_container = document.createElement('div');
    app_container.id = 'app';

    // Вставить блок в нужное место страницы
    let video_block = document.querySelector('.main-content .standard .container');
    if (video_block) {
        video_block.after(app_container);
    } else {
        let standard = document.createElement('div');
        standard.className = 'standard';

        standard.appendChild(app_container);
        document.body.appendChild(standard);
    }

    window.vm = new Vue({
        store,
        render: h => h(App)
    }).$mount('#app');
};

document.addEventListener('DOMContentLoaded', runCoursehuntersLoader);
window.addEventListener('load', runCoursehuntersLoader);

let CoursehuntersLoaderInitTimeout = setTimeout(runCoursehuntersLoader, 5000);
