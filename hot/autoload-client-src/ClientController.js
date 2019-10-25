import EventEmitter from './services/EventEmitter';

export default class ClientController extends EventEmitter {
    constructor(publicPath) {
        super();

        this.publicPath = publicPath;

        this.init();
    }

    stop() {
        if (window.hotClient.isOpen === true) {
            window.hotClient.stop();
        }
    }

    start() {
        if (window.hotClient.isOpen === false) {
            window.hotClient.start();
        }
    }

    getResources() {
        if (window.hotClient.isOpen) {
            this.emit('ok', window.hotClient);

            return false;
        }

        this.emit('await');
        this._fetchResourcesUrl()
            .then(urls => this._loadResources(urls))
            .catch(() => {});
    }

    _fetchResourcesUrl() {
        return fetch(this.publicPath + 'index.html')
            .then(res => res.text())
            .then(page => {
                let urls = [];
                let parser = new DOMParser();
                let doc = parser.parseFromString(page, 'text/html');
                let scripts = doc.querySelectorAll('script:not(.ignore)');
                scripts.forEach(script => {
                    let scriptResource = {
                        type: 'script',
                        url: this._normalizeSrc(script.getAttribute('src'))
                    };

                    urls.push(scriptResource);
                });

                let styles = doc.querySelectorAll('link[rel="stylesheet"]:not(.ignore)');
                styles.forEach(style => {
                    let styleResource = {
                        type: 'style',
                        url: this._normalizeSrc(style.getAttribute('href'))
                    };

                    urls.push(styleResource);
                });
                return urls;
            })
            .catch(() => this.emit('close'));
    }

    // Приводит src скриптов к абсолютному виду
    _normalizeSrc(scriptUrl) {
        // Если не передан src, или это не строка, то выходим
        if (!scriptUrl || typeof scriptUrl !== 'string') return false;
        let result = false;
        // https://regex101.com/r/kvqlZe/2/
        let regex = /^http|^\/\//im;

        // Если src абсолютный, оставляем его как есть
        if (scriptUrl.search(regex) !== -1) {
            result = scriptUrl;

            // Если src относительный, дописываем к нему адрес локального сервера
        } else {
            // https://regex101.com/r/kvqlZe/3
            let replaceRegex = /^\W+/im;
            result = this.publicPath + scriptUrl.replace(replaceRegex, '');
        }

        return result;
    }

    _loadResources(urls) {
        let { type, url } = urls.shift();
        return fetch(url)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error(`${url} status: ${res.status}`);
                }

                return res.text();
            })
            .then(content => this._appendResource(type, content))
            .then(() => this.emit('loaded', url))
            .catch(() => this.emit('warning', url))
            .finally(() => {
                if (urls.length > 0) {
                    return this._loadResources(urls);
                } else {
                    return true;
                }
            });
    }

    _appendResource(type, content) {
        let scriptEl = document.createElement(type);
        scriptEl.textContent = content;
        document.head.appendChild(scriptEl);

        return true;
    }

    _messageAnalyze(msg) {
        try {
            msg = JSON.parse(msg);

            if (msg.type) this.emit(msg.type, msg.data);
        } catch (err) {}
    }

    init() {
        if (!window.hotClient) {
            window.hotClient = new EventEmitter();
        }

        window.hotClient.one('open', () => {
            this.emit('open', window.hotClient);
            this.emit('ok', window.hotClient);
        });
        window.hotClient.one('close', () => this.emit('close', window.hotClient));
        window.hotClient.one('message', msg => this._messageAnalyze(msg));
        window.hotClient.one('error', e => this.emit('error', e));
    }
}
