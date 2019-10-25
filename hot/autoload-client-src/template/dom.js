export default function dom(tag, attrs = {}, ...children) {
    attrs = attrs === null ? {} : attrs;

    // fragments to append multiple children to the initial node
    const fragments = document.createDocumentFragment();
    children.forEach(child => {
        if (child instanceof HTMLElement) {
            fragments.appendChild(child);
        } else if (typeof child === 'string') {
            const textnode = document.createTextNode(child);
            fragments.appendChild(textnode);
        } else if (child instanceof DocumentFragment) {
            fragments.appendChild(child);
        } else {
            // later other things could not be HTMLElement not strings
            console.warn('not appendable', child);
        }
    });

    // Custom Components will be functions
    if (typeof tag === 'function') {
        attrs.children = fragments;
        let element = new tag(attrs);
        element = element.render ? element.render() : element;

        return element;
    }

    // regular html tags will be strings to create the elements
    if (typeof tag === 'string') {
        let element = document.createElement(tag);

        element.appendChild(fragments);
        // Merge element with attributes
        Object.assign(element, attrs);
        return element;
    }
}
