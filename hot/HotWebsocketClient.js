const BaseClient = require('./BaseClient');

module.exports = class WebsocketClient extends BaseClient {
    constructor(url) {
        super();

        this.client = new WebSocket(url.replace(/^http/, 'ws'));
        this.isOpen = false;
        this.isStop = false;

        this.client.onopen = e => this._openHandler(e);
        this.client.onclose = e => this._closeHandler(e);
        this.client.onmessage = e => this._messageHandler(e);
        this.client.onerror = e => this._errorHandler(e);

        this.events = window.hotClient ? window.hotClient.events : {};

        this._nativeOnOpen = null;
        this._nativeOnClose = null;
        this._nativeOnMessage = null;

        window.hotClient = this;
    }

    static getClientPath(options) {
        return require.resolve('./HotWebsocketClient');
    }

    stop() {
        this.isStop = true;
        this.client.close();
    }

    start() {
        this.isStop = false;
        this._nativeOnClose && this._nativeOnClose();
    }

    _openHandler(e) {
        this.isOpen = true;
        this.emit('open', e);
        this._nativeOnOpen(e);
    }

    _closeHandler(e) {
        this.isOpen = false;
        if (!this.isStop) {
            this.emit('close', e);
            this._nativeOnClose(e);
        }
    }

    _messageHandler({ data }) {
        this.emit('message', data);
        this._nativeOnMessage(data);
    }

    _errorHandler(e) {
        this.isOpen = false;
        this.emit('error', e);
    }

    onOpen(f) {
        this._nativeOnOpen = f;
    }

    onClose(f) {
        this._nativeOnClose = f;
    }

    onMessage(f) {
        this._nativeOnMessage = f;
    }
};
