import fonts from './fonts';
import infoPageStyle from './info-page-style';

export default class InfoPageCollector {
    constructor(url, course_name) {
        this.url = url;
        this.course_name = course_name;
        this.doc = null;
        this.owner = null;
        this.course_cover = null;
        this.course_display_name = null;
    }

    async init() {
        let res = await fetch(this.url);
        let page = await res.text();
        let parser = new DOMParser();
        this.doc = parser.parseFromString(page, 'text/html');

        let owner_link = this.doc.querySelector('a.course-box-value');
        this.owner = {
            name: owner_link.textContent,
            url: owner_link.href
        };

        this.course_cover = `https://coursehunter.net/uploads/course_posters_/${this.course_name}.jpg`;
        this.course_display_name = this.doc.querySelector('h1.raw-title').textContent;
    }

    async resourceUrl2base64(url) {
        let res = await window.Loader.request(url, {
            responseType: 'blob'
        });
        let b64 = await window.Utils.blob2base64(res.target.response);

        return b64;
    }

    async fontsCollector(fonts) {
        let fonts_style = ``;

        let loadFont = async font_obj => {
            let font_name = font_obj.name;
            let font_weight = font_obj.weight;
            let font_style = font_obj.style;

            let font = await this.resourceUrl2base64(font_obj.url);

            return `
            @font-face {
                font-family: ${font_name};
                src: url("${font}");
                ${font_weight ? `font-weight: ${font_weight};` : ''}
                ${font_style ? `font-style: ${font_style};` : ''}
            }`;
        };

        let loopLoadFonts = async (index = 0) => {
            let font_obj = fonts[index];
            if (!font_obj) return fonts_style;

            fonts_style += await loadFont(font_obj);
            return await loopLoadFonts(++index);
        };

        await loopLoadFonts(0);

        return fonts_style;
    }

    async build() {
        await this.init();

        const allExternalStyles = this.doc.querySelectorAll('head link[type="text/css"]');
        const externalStyles = [...allExternalStyles].filter(el => el.href.includes('coursehunter'));

        const bodyClasses = this.doc.body.className;

        return /* html */ `
        <!DOCTYPE html>
        <html lang="ru">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>${this.doc.title}</title>

            <!-- Подключение внешних стилей -->
            ${externalStyles.map(el => el.outerHTML).join('\n')}

            <style>
                /* Родные стили страницы */
                ${this.doc.querySelector('head style').textContent}

                /* Инлайновые шрифты */
                ${await this.fontsCollector(fonts)}

                /* Статические стили */
                ${infoPageStyle}
            </style>
        </head>

        <body class="${bodyClasses}">

            <!-- Шапка. На градиенте хлебные крошки и заголовки -->
            ${await (async () => {
                let header = this.doc.querySelector('.gradient').cloneNode(true);

                // Сделать активным пункт в хлебных крошках, указывающий на эту страницу
                let breadcrumbs_active = header.querySelector('.breadcrumbs__a_active');
                breadcrumbs_active.innerHTML = /* html */ `
                    <a class="breadcrumbs__a" itemprop="item" href="${this.url}">
                        <span itemprop="name">${this.course_display_name}</span>
                    </a>`;

                return header.outerHTML;
            })()}

            <!-- Основной блок с информацией -->
            ${await (async () => {
                // Блок с описанием курса
                let course_main_info = this.doc.querySelector('.book-wrap').cloneNode(true);

                return course_main_info.outerHTML;
            })()}

            <!-- Главный блок страницы с плеером -->
            ${await (async () => {
                const mainContent = this.doc.querySelector('.main-content').cloneNode(true);

                // Удаление блока самого плеера, чтобы остался только список уроков
                mainContent.querySelector('.player-left').remove();

                return mainContent.outerHTML;
            })()}

        </body>
`;
    }
}
