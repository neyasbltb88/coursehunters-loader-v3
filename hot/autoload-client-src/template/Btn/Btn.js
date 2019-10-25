import dom from '../dom';

export default class Btn {
    constructor(props = {}) {
        this.props = props;
    }

    render() {
        let { title, onclick, color, dragMode } = this.props;
        let style = `--color: ${color}; `;
        if (dragMode) {
            style += 'cursor: move; opacity: 0.5; background-color: rgba(0, 0, 0, .7)';
        }

        return (
            <button className="livereload-HMR-btn" title={title} onclick={onclick} style={style}>
                LiveReload
            </button>
        );
    }
}
