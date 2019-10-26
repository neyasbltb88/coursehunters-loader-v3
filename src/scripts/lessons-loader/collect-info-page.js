// import InfoPageCollector from './info-page-collector';

export default function collectInfoPage(index, course_name, url) {
    // let infoPageCollector = new InfoPageCollector();
    // let restore_info_page_item = storage.get('info');

    let info_page_item = {
        index,
        name_prefix: 'Инфо о курсе',
        name_concat: ' - ',
        lesson_name: Utils.fileNameNormalize(course_name),
        storage_name: 'info',
        url: null,
        ext: 'html',
        content: null,
        collect_url: url,
        // collect_method: infoPageCollector.build.bind(infoPageCollector),
        mime: 'text/html',
        total: 0,
        loaded: 0,
        percent: 0,
        is_checked: true,
        is_loading: false,
        is_loaded: false,
        was_loaded: false
    };

    return info_page_item;
}
