import fonts from "./fonts";

export default class InfoPageCollector {
    constructor() {
        let owner_link = document.querySelector("a.course-box-value");
        this.owner = {
            name: owner_link.textContent,
            url: owner_link.href
        };
        this.course_cover = document.querySelector(
            '.lessons-item [itemprop="thumbnail"]'
        ).href;
        this.course_name = document.querySelector("h1.hero-title").textContent;
        this.course_info_script = document.querySelector(
            '[type="application/ld+json"]'
        ).textContent;
        this.course_info_script ? JSON.parse(this.course_info_script) : null;
    }

    async resourceUrl2base64(url) {
        let res = await window.Loader.request(url, {
            responseType: "blob"
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
                ${font_weight ? `font-weight: ${font_weight};` : ""}
                ${font_style ? `font-style: ${font_style};` : ""}
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
        return /* html */ `
        <!DOCTYPE html>
        <html lang="ru">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>${document.title}</title>

            <style>
                /* Родные стили страницы */
                ${document.querySelector("head style").textContent}

                /* Инлайновые шрифты */
                ${await this.fontsCollector(fonts)}

                /* Правки стилей под сохраненную страницу */
                .hero-source .hero-source {
                    font-weight: 600;
                    opacity: .7;
                    text-decoration: none;
                }
                .hero-source .hero-source:hover {
                    opacity: 1;
                    text-decoration: underline;
                }

                    /* Формирование описания курса + обложка курса */
                .course-wrap {
                    justify-content: space-around;
                }
                .standard-title {
                    margin-top: 40px;
                    margin-bottom: 20px;
                }

                .course-wrap-side-left {
                    width: 100%;
                    flex: 100% 0 0;
                    order: 2;
                }
                .course-wrap-description {
                    max-width: none;
                    cursor: auto;
                }
                .course-wrap-side-right {
                    width: 50%;
                    flex: 50% 0 0;
                    order: 1;
                }
                .course-wrap-side-cover {
                    width: 360px;
                    max-width: 50%;
                    height: 220px;
                    order: 0;
                }
                .video_info {
                    order: 3;
                    width: 100%;
                }
                .video_info .lessons-item {
                    cursor: default;
                }
                .materials_info {
                    order: 4;
                    width: calc(100% + 60px);
                    margin: 40px -30px -30px -30px;
                }

                @media screen and (max-width: 767px) {
                    .course-wrap {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .course-wrap-side-right {
                        width: 100%;
                    }
                    .course-wrap-side-cover {
                        width: 60%;
                        height: auto;
                        margin-bottom: 20px;
                    }
                    .standard-title {
                        margin: 20px 0;
                    }
                }
                @media screen and (max-width: 414px) {
                    .course-wrap-side-left {
                        margin-bottom: 10px;
                    }
                    .course-wrap-side-cover {
                        width: 100%;
                    }
                    .course-box-item {
                        flex: 100% 0 0;
                        width: 100%;
                    }
                    .course-box-item:last-child {
                        margin-bottom: 0;
                    }
                    #lessons-list {
                        margin: 0 -30px;
                        width: calc(100% + 60px);
                    }
                }
            </style>
        </head>

        <body>
            
            <!-- Шапка. На градиенте хлебные крошки и заголовки -->
            ${await (async () => {
                let header = document
                    .querySelector(".hero.hero-gradient")
                    .cloneNode(true);

                // Сделать активным пункт в хлебных крошках, указывающий на эту страницу
                let breadcrumbs_active = header.querySelector(
                    ".breadcrumbs__a_active"
                );
                breadcrumbs_active.innerHTML = /* html */ `
                    <a class="breadcrumbs__a" itemprop="item" href="${
                        document.location.href
                    }">
                        <span itemprop="name">${this.course_name}</span>
                    </a>`;

                // Сделать активной ссылку на все курсы автора
                let hero_source = header.querySelector(".hero-source");
                hero_source.innerHTML = /* html */ `
                    <a class="hero-source breadcrumbs__a" href="${
                        this.owner.url
                    }">${this.owner.name}</a>`;

                return header.outerHTML;
            })()}

            <!-- Основной блок с информацией -->
            <div class="container">
                ${await (async () => {
                    // Блок с описанием курса
                    let course_main_info = document
                        .querySelector("div.course-wrap")
                        .cloneNode(true);
                    // Добавим в него обложку курса
                    let course_cover = document.createElement("img");
                    course_cover.className = "course-wrap-side-cover";
                    course_cover.src = await this.resourceUrl2base64(
                        this.course_cover
                    );
                    course_main_info.appendChild(course_cover);

                    // Заголовок описания курса
                    let course_description = course_main_info.querySelector(
                        ".course-wrap-description"
                    );
                    let course_description_header = document.createElement(
                        "h2"
                    );
                    course_description_header.className = "standard-title";
                    course_description_header.textContent = "Описание курса";
                    course_description.insertBefore(
                        course_description_header,
                        course_description.firstChild
                    );

                    // Клонируем список уроков
                    let lessons_list = document
                        .querySelector("#lessons-list")
                        .cloneNode(true);
                    let lessons = Array.from(
                        lessons_list.querySelectorAll(".lessons-item")
                    );
                    // Из уроков вырезаем прогресс-бары
                    lessons = lessons.map(lesson => {
                        lesson.querySelector("progress").remove();
                        return lesson;
                    });

                    // Блок со списком уроков
                    let video_info = document.createElement("div");
                    video_info.className = "video_info";
                    video_info.innerHTML = /* html */ ` <h2 class="standard-title" > Видео курса </h2>`;
                    video_info.appendChild(lessons_list);
                    course_main_info.appendChild(video_info);

                    // Материалы курса
                    let materials_info = document.createElement("div");
                    materials_info.className = "materials_info";
                    let materials = document.querySelector(
                        "section.section-block.mb-20"
                    );
                    if (materials) {
                        materials.classList.remove("mb-20");
                        materials_info.innerHTML = materials.outerHTML;
                        course_main_info.appendChild(materials_info);
                    }

                    return course_main_info.outerHTML;
                })()}  
            </div>

</body>
`;
    }
}