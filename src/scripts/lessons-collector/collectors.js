import Utils from '../utils';

const listSelector = '#lessons-list';
const lessonItemSelector = '.lessons-item';
const lessonItemPrefixSelector = '.lessons-title';
const lessonItemNameSelector = '.lessons-name';
const lessonItemDurationSelector = '.lessons-duration';

const buildLessonsUrl = courseId => `/api/v1/course/${courseId}/lessons`;

export default class Collectors {
    static async collectCourseInfo() {
        const url = location.href.replace(location.search, '');
        const name = document.querySelector('h1.raw-title').textContent;
        const posterUrl = document.querySelector('.book-wrap-img').src;
        const infoItemsElems = document.querySelectorAll('.book-wrap-info .course-box-item');
        const infoItems = [...infoItemsElems].map(el => {
            const title = el.querySelector('.course-box-title').textContent.trim();
            const value = el.querySelector('.course-box-value').textContent.trim();

            return { title, value };
        });

        const descriptionEl = document.querySelector('.book-wrap-content .book-wrap-description').cloneNode(true);
        const descriptionMore = descriptionEl.querySelector('.book-wrap-more');
        if (descriptionMore) descriptionMore.remove();
        const description = descriptionEl.textContent.trim();

        return { url, name, posterUrl, infoItems, description };
    }

    static async collectLessonsData(courseId) {
        let res = await axios.get(buildLessonsUrl(courseId));
        let lesson_items = res.data;

        let lessons_list = document.querySelector(listSelector);
        let lesson_elems = lessons_list.querySelectorAll(lessonItemSelector);
        let result_items = [];

        lesson_elems.forEach((elem, index) => {
            let lessonItem = lesson_items[index];

            let item = {
                index: index,
                name_prefix: Utils.fileNameNormalize(elem.querySelector(lessonItemPrefixSelector).textContent),
                name_concat: ' ',
                lesson_name: Utils.fileNameNormalize(elem.querySelector(lessonItemNameSelector).textContent),
                duration: elem.querySelector(lessonItemDurationSelector).textContent,
                storage_name: index,
                url: lessonItem.file,
                ext: Utils.UrlParse(lessonItem.file).file.ext,
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
