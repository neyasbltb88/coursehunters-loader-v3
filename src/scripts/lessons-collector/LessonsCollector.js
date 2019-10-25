import Download from '../download';
import Utils from '../utils';

export default class LessonsCollector {
    constructor() {
        this.btn = null;
        this.lessonsListEl = null;

        this.init();
    }

    createBtn() {
        this.btn = document.createElement('button');
        this.btn.className = 'btn mt-20 ml-20';
        this.btn.textContent = 'Скачать json с уроками';
        this.btn.addEventListener('click', this.collectLessons);

        let lessonsToggleBtn = document.querySelector('#lessons-toggle');
        lessonsToggleBtn.after(this.btn);
    }

    collectMaterials(course_name) {
        let materials_btn = document.querySelector('[title="Download course materials"]');
        let materialsItem = {
            [materials_btn.href]: `Материалы курса - ${course_name}.${Utils.UrlParse(materials_btn.href).file.ext}`
        };

        return materialsItem;
    }

    collectLessons = () => {
        let author = document.querySelector('.hero-source').textContent;
        let course_display_name = document.querySelector('h1.hero-title').textContent;
        let course_name = Utils.UrlParse(document.location.href).path.pop();

        let result = {
            author,
            course_display_name,
            course_name,
            lessons: []
        };

        let lessonsEl = this.lessonsListEl.querySelectorAll('.lessons-item');
        lessonsEl.forEach(lesson => {
            let url = lesson.querySelector('[itemprop="url"]').getAttribute('href');

            let name = '';
            name += lesson.querySelector('.lessons-title').textContent;
            name += ' ';
            name += lesson.querySelector('.lessons-name').textContent;
            name += '.';
            name += Utils.UrlParse(url).file.ext;

            result.lessons.push({ [url]: Utils.fileNameNormalize(name) });
        });

        result.lessons.push(this.collectMaterials(Utils.fileNameNormalize(course_name)));

        console.log(result);
        Download(JSON.stringify(result, ' ', 4), `${Utils.fileNameNormalize(course_name)}.json`, 'application/json');
    };

    init() {
        this.lessonsListEl = document.querySelector('#lessons-list');
        this.createBtn();
    }

    destroy() {
        this.btn.remove();
    }
}
