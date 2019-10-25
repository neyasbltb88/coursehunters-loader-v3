import Vue from 'vue';
import Vuex from 'vuex';
import Utils from './scripts/utils';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        course_name: '',
        course_display_name: '',
        lesson_items: [],

        // Общий флаг, показывающий, идет ли сейчас процесс загрузки
        loading: false
    },

    // commit
    mutations: {
        setCourseName(state, name) {
            state.course_name = name;
        },
        setCourseDisplayName(state, display_name) {
            state.course_display_name = display_name;
        },
        masterLoading(state, loading) {
            state.loading = loading;
        },
        masterCheck(state, check) {
            state.lesson_items.forEach(item =>
                !item.is_loaded && !item.is_loading ? (item.is_checked = check) : null
            );
        },
        addItem(state, item) {
            // Добавить новый айтем урока
            state.lesson_items.push(item);

            // Запросить размер файла урока
            requestAnimationFrame(() => this.dispatch('requestItemTotal', item));
        },
        updateItem(state, item) {
            state.lesson_items[item.index] = item;
        },
        // При обновлении количества скаченных байт,
        // автоматом вычисляется процент от размера файла
        setLoaded(state, { index, loaded }) {
            let lesson = state.lesson_items[index];
            if (loaded <= lesson.total) {
                lesson.loaded = loaded;
                lesson.percent = +Utils.Percent(loaded, lesson.total, 0);
            }
        },
        setIsChecked(state, { index, is_checked }) {
            state.lesson_items[index].is_checked = is_checked;
        },
        setIsLoading(state, { index, is_loading }) {
            state.lesson_items[index].is_loading = is_loading;
        },
        setContent(state, { index, content }) {
            state.lesson_items[index].content = content;

            let content_length = Utils.StrBytes(content);
            state.lesson_items[index].total = content_length;
            state.lesson_items[index].loaded = content_length;
            state.lesson_items[index].percent = 100;
        }
    },

    // dispatch
    actions: {
        // Метод запроса размера файла урока
        async requestItemTotal(store, item) {
            // Если у айтема еще неизвестен размер и есть url
            if (!item.total && item.url) {
                let response = await window.Loader.request(item.url, { method: 'HEAD' });

                item.total = response.total;
                item.mime = response.target.getResponseHeader('Content-Type');

                this.commit('updateItem', item);
            }
        },
        getItem(store, index) {
            return store.state.lesson_items[index];
        }
    },
    getters: {
        cnt(state) {
            return state.lesson_items.length;
        },
        getCourseDisplayName(state) {
            return state.course_display_name;
        },
        getItems(state) {
            return state.lesson_items;
        },
        justLoadedCnt(state) {
            return state.lesson_items.reduce((cnt, item) => (item.is_loaded && !item.was_loaded ? cnt + 1 : cnt), 0);
        },
        notLoadedCnt(state) {
            return state.lesson_items.reduce((cnt, item) => (!item.is_loaded ? cnt + 1 : cnt), 0);
        },
        notWasLoadedCheckedCnt(state) {
            return state.lesson_items.reduce((cnt, item) => (!item.was_loaded && item.is_checked ? cnt + 1 : cnt), 0);
        },
        allChecked(state) {
            return state.lesson_items.every(item => item.is_checked);
        },
        isLoading(state) {
            return state.loading;
        },
        totalCheckedNotWasLoaded(state) {
            return state.lesson_items.reduce(
                (total, item) => (item.is_checked && !item.was_loaded ? total + item.total : total),
                0
            );
        },
        totalNotWasLoaded(state) {
            return state.lesson_items.reduce(
                (loaded, item) => (item.is_checked && !item.was_loaded ? loaded + item.loaded : loaded),
                0
            );
        }
    }
});
