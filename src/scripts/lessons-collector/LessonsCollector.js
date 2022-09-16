import Download from 'downloadjs';
import Utils from '../utils';
import Collectors from './collectors';
import TaskLauncher from './task-launcher';
import buildCourseInfoMd from './buildCourseInfoMd';

const UIStyleContent = /* css */ `
.lessons-collector-ui {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 15px;
}
.lessons-collector-btn {
    max-width: 300px;
    margin-top: 15px;
    margin-right: 15px;
}

@media only screen and (max-width : 860px) {
    .lessons-collector-ui {
        flex-direction: column;
    }
    .lessons-collector-btn {
        max-width: none;
        margin-right: 0;
    }
}
`;

export default class LessonsCollector {
    constructor() {
        this.createBtnTask = {
            name: 'createBtnTask',
            condition: () => {
                let el = document.querySelector('.course-page-poster');
                return el !== null;
            },
            callback: () => {
                this.createUI();
            }
        };
        this.taskLauncher = new TaskLauncher([this.createBtnTask]);

        this.json = {
            url: window.location.href,
            course_name: '',
            course_display_name: '',
            lesson_items: []
        };

        this.UI = null;

        this.init();
    }

    get cnt() {
        return this.json.lesson_items.length;
    }

    get getCourseDisplayName() {
        return this.json.course_display_name;
    }

    createUI() {
        const infoItemsBlock = document.querySelector('.book-wrap .book-wrap-info');
        if (this.UI || !infoItemsBlock) return;

        const UI = document.createElement('div');
        UI.className = 'lessons-collector-ui';
        const UIStyle = document.createElement('style');
        UIStyle.textContent = UIStyleContent;

        const btn = this.createBtn();
        const btnLoader = this.createBtnLoader();
        const btnCourseInfo = this.createBtnCourseInfo();

        UI.append(UIStyle, btn, btnLoader, btnCourseInfo);

        infoItemsBlock.after(UI);

        this.UI = UI;
    }

    createBtn() {
        const btn = document.createElement('button');
        btn.id = 'lessons-collector';
        btn.className = 'btn book-wrap-btn lessons-collector-btn';
        btn.textContent = 'Скачать json с уроками';
        btn.addEventListener('click', this.collectLessons);

        return btn;
    }

    createBtnLoader() {
        const btnLoader = document.createElement('a');
        btnLoader.id = 'lessons-loader';
        btnLoader.className = 'btn book-wrap-btn lessons-collector-btn';
        btnLoader.textContent = 'Перейти на страницу скачивания';
        btnLoader.href = 'https://neyasbltb88.github.io/coursehunters-loader-v3/';
        btnLoader.target = '_blank';

        return btnLoader;
    }

    createBtnCourseInfo() {
        const btnCourseInfo = document.createElement('button');
        btnCourseInfo.id = 'btn-course-info';
        btnCourseInfo.className = 'btn book-wrap-btn lessons-collector-btn';
        btnCourseInfo.textContent = 'Скачать информацию о курсе';
        btnCourseInfo.addEventListener('click', this.collectCourseInfo);

        return btnCourseInfo;
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
        if (this.UI) {
            this.UI.remove();
            this.UI = null;
        }
    }
}
