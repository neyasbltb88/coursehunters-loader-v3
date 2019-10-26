import Vue from 'vue';
import Vuex from 'vuex';
import Utils from '^/utils';
import InfoPageCollector from './info-page-collector';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        course_name: '',
        course_display_name: '',
        lesson_items: [],

        // Объект хранилища, работающий с localStorage
        storage: null,

        // Общий флаг, показывающий, идет ли сейчас процесс загрузки
        loading: false
    },

    // commit
    mutations: {
        clearState(state) {
            state.course_name = '';
            state.course_display_name = '';
            state.lesson_items = [];
            state.loading = false;
        },
        setStorage(state, storage) {
            state.storage = storage;
        },
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
        removeItem(state, index) {
            state.lesson_items.splice(index, 1);
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
            } else if (item.storage_name === 'info' && item.collect_url) {
                try {
                    let collector = new InfoPageCollector(item.collect_url, store.getters.getCourseName);

                    if (!item.is_loaded || !item.was_loaded) {
                        let content = await collector.build();

                        this.commit('setContent', { index: item.index, content });
                    } else {
                        item.collect_method = collector.build.bind(collector);

                        this.commit('updateItem', item);
                    }
                } catch (err) {
                    console.log(err);

                    this.commit('removeItem', item.index);
                }
            }
        },
        getItem(store, index) {
            return store.state.lesson_items[index];
        }
    },
    getters: {
        storage(state) {
            return state.storage;
        },
        cnt(state) {
            return state.lesson_items.length;
        },
        getCourseName(state) {
            return state.course_name;
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
