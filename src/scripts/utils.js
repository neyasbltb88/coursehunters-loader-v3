export default class Utils {
    // Фильтрует строки на предмет недопустимых символов для использования в качестве имени файла
    static fileNameNormalize(value) {
        let new_value = value.trim().split('');
        let template = {
            '\\': '_',
            '/': '_',
            ':': '-',
            '*': '_',
            '?': '7',
            '"': "'",
            '<': '{',
            '>': '}',
            '|': ' l '
        };

        new_value = new_value.map(char => template[char] || char);

        return new_value.join('');
    }

    // Возвращает расширение файла из пути к нему (https://site.com/code.zip -> .zip)
    static fileNameExt(url) {
        // https://regex101.com/r/fIgKBo/1
        const regex = /.*(\.\w*)/i;
        let res = url.match(regex);

        return res && res[1];
    }

    // Конвертер(картинок) из blob в base64
    static blob2base64(blob) {
        return new Promise(resolve => {
            let reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.readAsDataURL(blob);
        });
    }

    // Возвращает реальный объем строки текста в байтах
    static StrBytes(str) {
        var bytes = 0,
            len = str.length,
            codePoint,
            next,
            i;

        for (i = 0; i < len; i++) {
            codePoint = str.charCodeAt(i);

            if (codePoint >= 0xd800 && codePoint < 0xe000) {
                if (codePoint < 0xdc00 && i + 1 < len) {
                    next = str.charCodeAt(i + 1);

                    if (next >= 0xdc00 && next < 0xe000) {
                        bytes += 4;
                        i++;
                        continue;
                    }
                }
            }

            bytes += codePoint < 0x80 ? 1 : codePoint < 0x800 ? 2 : 3;
        }

        return bytes;
    }

    // Возвращает процентное соотношение current от total
    static Percent(current, total, precision = 2) {
        if (total === 0) return (0).toFixed(precision);
        let percent = (current * 100) / total;
        return percent.toFixed(precision);
    }

    // Принимает число байт, возвращает объем в человекопонятном формате
    static FileSize(size = 0, extend = false) {
        size = +size;
        if (isNaN(size)) return false;
        let level_counter = 0;
        let levels = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];

        function check(size) {
            if (size > 1024 && level_counter < 4) {
                level_counter++;
                return check(size / 1024);
            } else {
                return size;
            }
        }

        if (extend) {
            return {
                size: check(size),
                level: level_counter,
                unit: levels[level_counter]
            };
        } else {
            return `${check(size).toFixed(1)} ${levels[level_counter]}`;
        }
    }

    // Разбирает url-адрес на все возможные составляющие
    static UrlParse(url) {
        // https://regex101.com/r/bcnNZG/3
        var regex = /(http\:\/\/|https\:\/\/|ftp\:\/\/|file\:\/\/\/)(.*?\/)(.*\/)*(.*)(\/.*\.(.*))*/i;
        var result_obj = {};

        var result = url.match(regex);

        result_obj.schema = result[1];
        result_obj.host = result[2];

        if (result[3]) {
            result_obj.path = result[3].split('/');
            result_obj.path = result_obj.path.filter(function(item) {
                return item.length > 0;
            });
        }

        if (result[4]) {
            var file_parts = result[4].split('.');

            if (file_parts.length > 1) {
                var ext = file_parts.pop();
                var name = file_parts.join('.');
                result_obj.file = {
                    fileName: name + '.' + ext,
                    name: name,
                    ext: ext
                };
            } else {
                result_obj.path.push(result[4]);
            }
        }

        return result_obj;
    }

    // Принимает количество секунд, возвращает в человекопонятном формате
    static TimeNormalizer(time = 0, ms = false, template = false) {
        if (typeof time !== 'number' || time < 0) return false;
        let result_arr = [];
        let duration = time / 1000;
        let date_obj = {};

        let units = {
            day: 'д',
            hour: 'ч',
            min: 'мин',
            sec: 'с',
            msec: 'мс'
        };

        let divide = {
            min: 60,
            hour: 60 * 60,
            day: 60 * 60 * 24
        };

        let begin = false;

        function filter(unit, val) {
            if (val <= 0 && !begin) return;
            begin = true;
            result_arr.push({
                unit: units[unit],
                value: val
            });
        }

        let day = Math.floor(duration / divide.day);
        filter('day', day);
        duration -= day * divide.day;

        let hour = Math.floor(duration / divide.hour);
        filter('hour', hour);
        duration -= hour * divide.hour;

        let min = Math.floor(duration / divide.min);
        filter('min', min);

        let sec = Math.floor(duration % 60);
        if ((!ms && !begin) || sec > 0) {
            begin = true;
            filter('sec', sec);
        }

        let msec = Math.round(((duration % 60) - sec) * 1000);
        date_obj.msec = msec;
        if (ms || !begin) {
            begin = true;
            filter('msec', msec);
        }

        if (template) {
            return result_arr;
        } else {
            return result_arr.reduce((sum, item, index) => {
                return sum + `${index > 0 ? ' ' : ''}${item.value}${item.unit}`;
            }, '');
        }
    }
}
