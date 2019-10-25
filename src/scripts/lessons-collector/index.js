import LessonsCollector from './LessonsCollector';

window.lessonsCollector = new LessonsCollector();

if (module.hot) {
    module.hot.accept();

    module.hot.dispose(() => {
        window.lessonsCollector.destroy();
    });
}
