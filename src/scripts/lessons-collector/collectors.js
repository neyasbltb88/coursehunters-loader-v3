import Utils from '../utils';

export default class Collectors {
    static async collectLessonsData() {
        let lessons_list = document.querySelector('#lessons-list');
        let lesson_elems = lessons_list.querySelectorAll('.lessons-item');
        let result_items = [];

        lesson_elems.forEach((elem, index) => {
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
                total: 0,
                loaded: 0,
                percent: 0,
                is_checked: true,
                is_loading: false,
                is_loaded: false,
                was_loaded: false
            };

            result_items.push(item);
        });

        return result_items;
    }

    static async collectMaterials(index, course_name) {
        let materials_btn = document.querySelector('[title="Download course materials"]');
        if (!materials_btn) return false;

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
            total: 0,
            loaded: 0,
            percent: 0,
            is_checked: true,
            is_loading: false,
            is_loaded: false,
            was_loaded: false
        };

        return material_item;
    }
}
