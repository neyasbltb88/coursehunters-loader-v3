import Download from 'downloadjs';
import Utils from '../utils';
import Collectors from './collectors';
import TaskLauncher from './task-launcher';
import buildCourseInfoMd from './buildCourseInfoMd';

export default class LessonsCollector {
    constructor() {
        this.createBtnTask = {
            name: 'createBtnTask',
            condition: () => {
                let lessonsToggle = document.querySelector('.course-page-poster');
                return lessonsToggle !== null;
            },
            callback: () => {
                this.createBtn();
                this.createBtnLoader();
                this.createBtnCourseInfo();
            }
        };
        this.taskLauncher = new TaskLauncher([this.createBtnTask]);

        this.json = {
            url: window.location.href,
            course_name: '',
            course_display_name: '',
            lesson_items: []
        };

        this.btn = null;
        this.btnLoader = null;
        this.btnCourseInfo = null;

        this.init();
    }

    get cnt() {
        return this.json.lesson_items.length;
    }

    get getCourseDisplayName() {
        return this.json.course_display_name;
    }

    createBtn() {
        if (this.btn) return;

        this.btn = document.createElement('button');
        this.btn.id = 'lessons-collector';
        this.btn.className = 'btn book-wrap-btn mt-20';
        this.btn.textContent = 'Скачать json с уроками';
        this.btn.addEventListener('click', this.collectLessons);

        let container = document.querySelector('.course-page-poster');
        container.appendChild(this.btn);
    }

    createBtnLoader() {
        if (this.btnLoader) return;

        this.btnLoader = document.createElement('a');
        this.btnLoader.id = 'lessons-loader';
        this.btnLoader.className = 'btn book-wrap-btn mt-20';
        this.btnLoader.textContent = 'Перейти на страницу скачивания';
        this.btnLoader.href = 'https://neyasbltb88.github.io/coursehunters-loader-v3/';
        this.btnLoader.target = '_blank';

        this.btn.after(this.btnLoader);
    }

    createBtnCourseInfo() {
        if (this.btnCourseInfo) return;

        this.btnCourseInfo = document.createElement('button');
        this.btnCourseInfo.id = 'btn-course-info';
        this.btnCourseInfo.className = 'btn book-wrap-btn mt-20';
        this.btnCourseInfo.textContent = 'Скачать информацию о курсе';
        this.btnCourseInfo.addEventListener('click', this.collectCourseInfo);

        this.btnLoader.after(this.btnCourseInfo);
    }

    // === Сбор данных ===
    async collectLessonItems() {
        let courseId = window.course_id;
        let lessons_items = await Collectors.collectLessonsData(courseId);

        if (lessons_items) {
            lessons_items.forEach(item => this.addItem(item));
        }
    }

    async collectMaterials() {
        try {
            let materials_item = await Collectors.collectMaterials(this.cnt, this.getCourseDisplayName);
            if (materials_item.length > 0) {
                materials_item.forEach(material => this.addItem(material));
            }
        } catch (err) {}
    }

    addItem(item) {
        this.json.lesson_items.push(item);
    }

    setCourseName(course_name) {
        this.json.course_name = course_name;
    }

    setCourseDisplayName(display_name) {
        this.json.course_display_name = display_name;
    }

    collectLessons = async () => {
        this.json = {
            url: window.location.href,
            course_name: '',
            course_display_name: '',
            lesson_items: []
        };

        let course_name = Utils.UrlParse(document.location.href);
        course_name = course_name.path.pop();
        this.setCourseName(course_name);

        let course_display_name = document.querySelector('h1.raw-title').textContent;
        this.setCourseDisplayName(course_display_name);

        // Собрать айтемы списка уроков
        await this.collectLessonItems();
        // Собрать айтем материалов курса
        await this.collectMaterials();

        Download(
            JSON.stringify(this.json, ' ', 4),
            `${Utils.fileNameNormalize(course_display_name)}.json`,
            'application/json'
        );

        this.createBtnLoader();
    };

    async collectCourseInfo() {
        const courseInfo = await Collectors.collectCourseInfo();
        const courseInfoMd = buildCourseInfoMd(courseInfo);
        const courseDisplayName = document.querySelector('h1.raw-title').textContent;
        console.log(courseInfoMd);

        Download(courseInfoMd, `${Utils.fileNameNormalize(courseDisplayName)}.md`, 'text/markdown');
    }

    init() {
        this.taskLauncher.run('createBtnTask');
    }

    destroy() {
        if (this.btn) {
            this.btn.remove();
            this.btn = null;
        }

        if (this.btnLoader) {
            this.btnLoader.remove();
            this.btnLoader = null;
        }

        if (this.btnCourseInfo) {
            this.btnCourseInfo.remove();
            this.btnCourseInfo = null;
        }
    }
}
