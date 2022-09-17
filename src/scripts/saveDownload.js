const createAnchor = (url, fileName) => {
    let anchor = document.createElement('a');
    anchor.href = url;
    anchor.setAttribute('download', fileName);
    anchor.className = 'download-js';
    anchor.innerHTML = 'downloading...';
    anchor.style.display = 'none';
    anchor.addEventListener('click', (e) => e.stopPropagation(), { once: true });

    return anchor;
};

/**
 * @description Запускает сохранение файла в папку загрузок по умолчанию.
 * @param {string|Blob} url Ссылка на файл или Blob файла.
 * Если будет передана ссылка на файл с другого домена, то вместо скачивания произойдет переход на этот адрес.
 * Если по ссылке будет ошибка, то так же произойдет переход на этот адрес с ошибкой.
 * @param {string} [fileName] Имя сохраняемого файла вместе с расширением.
 * Если по ссылке беком явно отдается файл на загрузку, и в заголовке Content-Disposition заполнено filename,
 * то этот аргумент с именем будет проигнорирован.
 * @returns {true}
 */
const saveDownload = (url, fileName) => {
    let isBlob = false;
    if (url instanceof Blob) {
        isBlob = true;
        url = URL.createObjectURL(url);
    }

    let anchor = createAnchor(url, fileName);
    document.body.appendChild(anchor);

    setTimeout(() => {
        anchor.click();
        document.body.removeChild(anchor);
        if (isBlob) URL.revokeObjectURL(url);
    }, 66);

    return true;
};

export default saveDownload;
export { saveDownload, createAnchor };
