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
        let materials_btn = document.querySelectorAll('.container>a[title]');
        if (materials_btn.length === 0) return false;

        let materials = [];

        materials_btn.forEach((material, idx) => {
            let name_prefix = 'Материалы курса';
            if (materials_btn.length > 1) name_prefix += ` [${idx + 1}]`;

            let material_item = {
                index: index + idx,
                name_prefix,
                name_concat: ' - ',
                lesson_name: Utils.fileNameNormalize(course_name),
                storage_name: Utils.UrlParse(material.href).file.name,
                url: material.href,
                ext: Utils.UrlParse(material.href).file.ext,
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

            materials.push(material_item);
        });

        return materials;
    }
}
