export default class Loader {
    constructor() {
        this.xhr = {};
        this.xhr_counter = 0;
    }

    request(url, { method = 'GET', responseType } = {}, progressCallback = () => {}) {
        let xhr_index = this.xhr_counter++;
        this.xhr[xhr_index] = new XMLHttpRequest();
        if (responseType) this.xhr[xhr_index].responseType = responseType;

        this.xhr[xhr_index].addEventListener('progress', e => {
            if (typeof progressCallback === 'function') progressCallback(e);
        });

        return new Promise((resolve, reject) => {
            this.xhr[xhr_index].addEventListener('load', e => {
                delete this.xhr[xhr_index];
                resolve(e);
            });
            this.xhr[xhr_index].addEventListener('abort', e => {
                delete this.xhr[xhr_index];
                reject(e);
            });
            this.xhr[xhr_index].addEventListener('error', e => {
                delete this.xhr[xhr_index];
                reject(e);
            });
            this.xhr[xhr_index].addEventListener('timeout', e => {
                delete this.xhr[xhr_index];
                reject(e);
            });

            this.xhr[xhr_index].open(method, url, true);
            this.xhr[xhr_index].send();
        });
    }

    abort() {
        for (let _xhr in this.xhr) {
            this.xhr[_xhr].abort();
            delete this.xhr[_xhr];
        }

        return true;
    }
}