import dom from './dom';
import clientConfig from '@/client.config';
import ClientController from '../ClientController';
import Log from '../services/log';
import throttle from '../services/throttle';
import Btn from './Btn';

import './index.sass';

export default class Template {
    constructor(id) {
        this.log = new Log();
        this.target = null;
        this.id = id.startsWith('#') ? id.slice(1) : id;
        this.publicPath = `${clientConfig.https ? 'https' : 'http'}://${clientConfig.host}:${clientConfig.port}/`;

        this.clientController = new ClientController(this.publicPath);
        this.moveHandler = throttle(this.moveHandler, 5);

        let position = this.getPosition();
        let dragTimeout = clientConfig.dragTimeout !== undefined ? clientConfig.dragTimeout : 150;
        let colors = {
            ready: '#C3CFE0',
            init: '#85D035',
            await: '#FFC000',
            warning: '#FD971F',
            error: '#F92672',
            ...clientConfig.colors
        };

        // Состояние
        this.state = {
            connectStatus: 'ready',
            wasInit: false,
            wasConnected: false,
            isConnected: false,
            dragMode: false,
            position,
            offset: {
                x: 0,
                y: 0
            },
            notLoaded: new Set(),
            dragTimeout
        };

        // Событие успешной подгрузки ресурса с локального сервера
        this.clientController.on('loaded', url => {
            this.log('default', '*ScriptsAutoload* Загружен на страницу:', url);
            let { notLoaded } = this.state;
            notLoaded.delete(url);
            this.setState({ notLoaded });
        });

        // Событие соединения сокета с локальным сервером
        this.clientController.on('open', () => {
            this.log('success', '*ScriptsAutoload* Подключен к серверу:', this.publicPath);
        });

        // Событие изменения файла проекта(происходит во время перекомпиляции модуля)
        this.clientController.on('invalid', () => {
            if (clientConfig.displayAwait) this.setState({ connectStatus: 'await' });
        });

        // Событие завершения компиляции, так же вызывается после события 'open'
        this.clientController.on('ok', () => {
            this.setState({
                connectStatus: 'init',
                wasInit: true,
                wasConnected: true,
                isConnected: true
            });
        });

        // Событие начала подгрузки ресурсов с локального сервера
        this.clientController.on('await', () => {
            let newState = { connectStatus: 'await' };

            if (!this.state.wasInit) newState.connectStatus = 'ready';

            this.setState(newState);
        });

        // Событие ошибки загрузки ресурса с локального сервера
        this.clientController.on('warning', e => {
            this.log('warning', '*ScriptsAutoload* Ошибка загрузки ресурса:', e);
            let { notLoaded } = this.state;
            notLoaded.add(e);
            this.setState({ notLoaded });
        });

        // Событие отключения сокета от локального сервера
        this.clientController.on('close', () => {
            this.log('error', '*ScriptsAutoload* Закрыто соединение с сервером:', this.publicPath);
            let newState = {
                isConnected: false,
                connectStatus: 'error'
            };

            if (!this.state.wasInit) newState.connectStatus = 'ready';

            this.setState(newState);
        });

        // Объект, описывающий вид/поведение для определенных состояний
        this.status = {
            ready: {
                handler: () => {
                    this.setState({ connectStatus: 'await', wasInit: true });
                    // Если было инициализировано соединение с сокетом, значит можно его запускать
                    if (this.state.wasConnected) {
                        this.clientController.start();
                        // Если не было инициализировано, значит не получен основной скрипт с локального сервера и надо повторить попытку
                    } else {
                        this.tryConnect();
                    }
                },
                color: colors.ready,
                title: `Подключиться к серверу ${this.publicPath}`
            },
            init: {
                handler: () => {
                    this.setState({ connectStatus: 'ready' });
                    this.clientController.stop();
                },
                color: colors.init,
                title: `Отключиться от сервера ${this.publicPath}`
            },
            await: {
                handler: () => {},
                color: colors.await,
                title: 'Ожидание ресурса'
            },
            error: {
                handler: () => {
                    this.setState({ connectStatus: 'await', wasInit: true });
                    // Если было инициализировано соединение с сокетом, значит можно его запускать
                    if (this.state.wasConnected) {
                        this.clientController.start();
                        // Если не было инициализировано, значит не получен основной скрипт с локального сервера и надо повторить попытку
                    } else {
                        this.tryConnect();
                    }
                },
                color: colors.error,
                title: 'Отключен от сервера ' + this.publicPath
            }
        };
    }

    // Метод, дающий команду контроллеру на получение рабочих скриптов с локального сервера
    tryConnect() {
        this.clientController.getResources();
    }

    setState(newState = {}) {
        let oldState = { ...this.state };
        this.state = {
            ...oldState,
            ...newState
        };

        this.mount();
    }

    // Получает сохраненную позицию кнопки
    getPosition() {
        let position = { x: 0, y: 0 };

        try {
            let restore = window.localStorage.getItem('livereloadHMR');
            position = JSON.parse(restore).position;
        } catch (err) {}

        return position;
    }

    // Сохраняет позицию кнопки
    setPosition(position) {
        window.localStorage.setItem('livereloadHMR', JSON.stringify({ position }));
    }

    // Обработчик перемещения кнопки
    moveHandler = ({ clientX, clientY }) => {
        let { offset, size } = this.state;
        // Чтобы кнопка не выходила за верхний и левый края экрана
        let x = clientX - offset.x >= 0 ? clientX - offset.x : 0;
        let y = clientY - offset.y >= 0 ? clientY - offset.y : 0;

        // Чтобы кнопка не выходила за нижний и правый края экрана
        x = x + size.x <= window.innerWidth ? x : window.innerWidth - size.x;
        y = y + size.y <= window.innerHeight ? y : window.innerHeight - size.y;

        this.setState({
            position: { x, y }
        });
    };

    // Обработчик переключения режима перемещения кнопки
    dragHandler = ({ offsetX, offsetY, currentTarget }) => {
        // Размеры кнопки нужны для расчетов ограничения вытаскивания кнопки за экран
        let style = getComputedStyle(currentTarget);
        let size = {
            x: parseInt(style.width),
            y: parseInt(style.height)
        };
        // Положение мышки внутри кнопки на момент клика
        let offset = {
            x: offsetX,
            y: offsetY
        };

        // Если мышка зажата так долго, чтобы выполнился этот таймаут, кнопка переходит в режим перемещения за мышкой
        let timeout = setTimeout(() => {
            this.setState({
                dragMode: true,
                offset,
                size
            });
            document.addEventListener('mousemove', this.moveHandler);
        }, this.state.dragTimeout);

        // Когда кнопка мышки отжимается, сбрасываем таймаут, чтобы сработал простой клик,
        // отменяем режим перемещения и фиксируем координаты кнопки
        document.addEventListener(
            'mouseup',
            () => {
                requestAnimationFrame(() => {
                    clearTimeout(timeout);
                    this.setState({ dragMode: false });
                    document.removeEventListener('mousemove', this.moveHandler);
                    this.setPosition(this.state.position);
                });
            },
            { once: true }
        );
    };

    mount(target = this.target) {
        this.target = target;
        let template = target.querySelector('#' + this.id);
        if (template) {
            template.replaceWith(this.render());
        } else {
            target.appendChild(this.render());
        }
    }

    render() {
        let { connectStatus, notLoaded, position, dragMode } = this.state;
        let { handler, color, title } = this.status[connectStatus];

        // Если есть ошибки загрузки ресурсов
        if (notLoaded.size > 0) {
            let notLoadedList = '';
            notLoaded.forEach(err => (notLoadedList += '\n' + err));
            title = `Ошибка загрузки: ${notLoadedList}`;
            color = colors.warning;
        }

        let style = `--x: ${position.x}px; --y: ${position.y}px;`;

        if (dragMode) {
            handler = () => {};
        }

        return (
            <div id={this.id} onmousedown={this.dragHandler} style={style}>
                <Btn title={title} color={color} onclick={handler} dragMode={dragMode} />
            </div>
        );
    }
}
