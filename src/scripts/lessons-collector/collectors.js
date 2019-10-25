import Utils from '../utils';
import InfoPageCollector from './info-page-collector';

export default class Collectors {
    static async collectLessonsData(storage) {
        let lesson_elems = document.querySelectorAll('.lessons-item');
        let result_items = [];

        lesson_elems.forEach((elem, index) => {
            let restore_item_loaded = storage.get(index);

            let item = {
                index: index,
                name_prefix: Utils.fileNameNormalize(elem.querySelector('[itemprop="name"]').textContent),
                name_concat: ' ',
                lesson_name: Utils.fileNameNormalize(elem.querySelector('.lessons-name').textContent),
                storage_name: index,
                url: elem.querySelector('[itemprop="url"]').href,
                ext: Utils.UrlParse(elem.querySelector('[itemprop="url"]').href).file.ext,
                content: null,
                mime: null,
                total: restore_item_loaded ? +restore_item_loaded : 0,
                loaded: restore_item_loaded ? +restore_item_loaded : 0,
                percent: restore_item_loaded ? 100 : 0,
                is_checked: true,
                is_loading: false,
                is_loaded: restore_item_loaded ? true : false,
                was_loaded: restore_item_loaded ? true : false
            };

            result_items.push(item);
        });

        return result_items;
    }

    static async collectMaterials(storage, index, course_name) {
        let materials_btn = document.querySelector('[title="Download course materials"]');
        if (!materials_btn) return false;

        let restore_material_item = storage.get('code');

        let material_item = {
            index,
            name_prefix: 'Материалы курса',
            name_concat: ' - ',
            lesson_name: Utils.fileNameNormalize(course_name),
            storage_name: 'code',
            url: materials_btn.href,
            ext: Utils.UrlParse(materials_btn.href).file.ext,
            content: null,
            mime: null,
            total: restore_material_item ? +restore_material_item : 0,
            loaded: restore_material_item ? +restore_material_item : 0,
            percent: restore_material_item ? 100 : 0,
            is_checked: true,
            is_loading: false,
            is_loaded: restore_material_item ? true : false,
            was_loaded: restore_material_item ? true : false
        };

        return material_item;
    }

    static async collectInfoPage(storage, index, course_name) {
        let infoPageCollector = new InfoPageCollector();
        let restore_info_page_item = storage.get('info');

        let info_page_item = {
            index,
            name_prefix: 'Инфо о курсе',
            name_concat: ' - ',
            lesson_name: Utils.fileNameNormalize(course_name),
            storage_name: 'info',
            url: null,
            ext: 'html',
            content: null,
            collect_method: infoPageCollector.build.bind(infoPageCollector),
            mime: 'text/html',
            total: restore_info_page_item ? +restore_info_page_item : 0,
            loaded: restore_info_page_item ? +restore_info_page_item : 0,
            percent: restore_info_page_item ? 100 : 0,
            is_checked: true,
            is_loading: false,
            is_loaded: restore_info_page_item ? true : false,
            was_loaded: restore_info_page_item ? true : false
        };

        return info_page_item;
    }
}
