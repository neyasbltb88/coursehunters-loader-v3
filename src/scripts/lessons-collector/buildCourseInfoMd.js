/**
 * @description Собирает текст в формате markdown из объекта информации о курсе.
 * @param {object} courseInfo Объект информации о курсе.
 * @param {string} courseInfo.url Ссылка на страницу курса.
 * @param {string} courseInfo.name Человекопонятное название курса.
 * @param {string} courseInfo.posterUrl Ссылка на картинку-постер курса.
 * @param {{title: string, value: string}[]} courseInfo.infoItems массив элементов информации о курсе.
 * @param {string} courseInfo.description Текст описания курса.
 * @returns {string}
 */
const buildCourseInfoMd = courseInfo => {
    const { url, name, posterUrl, infoItems, description } = courseInfo;

    const infoItemsSection = infoItems.map(item => `- ${item.title.toUpperCase()} **${item.value}**`).join('\n');

    return /* md */ `# [[курс] ${name}](${url})

![](${posterUrl})

${infoItemsSection}

---
${description}
`;
};

export default buildCourseInfoMd;
