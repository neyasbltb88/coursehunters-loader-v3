export default class Log {
    constructor() {
        this.type = {
            success: ['color: #272822;', 'background-color: #A6E22E;', 'padding: 2px 10px;', 'width: 100%'].join(' '),
            info: ['color: #272822;', 'background-color: #66D9EF;', 'padding: 2px 10px;'].join(' '),
            warning: ['color: #272822;', 'background-color: #FD971F;', 'padding: 2px 10px;'].join(' '),
            error: ['color: #272822;', 'background-color: #F92672;', 'padding: 2px 10px;'].join(' '),
            default: ['color: #272822;', 'background-color: #E6DB74;', 'padding: 2px 10px;'].join(' ')
        };

        return this.message.bind(this);
    }

    _msgTemplate(style, msg) {
        console.log('%c%s', style, msg);
    }

    message(...content) {
        let style = this.type.default;
        if (content.length > 1) {
            let type = content.shift();
            style = this.type[type] ? this.type[type] : this.type.default;
        }

        let msg = content.join(' ');

        this._msgTemplate(style, msg);
    }
}
