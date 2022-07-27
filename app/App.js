import AppEvents from './containers/AppEvents';
import { createApp, getInstanceFromElement } from '@studiometa/js-toolkit';
import Cursor from './components/Cursor';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Ui from './pages/Ui';
import ScribbleLink from './components/ScribbleLink';
import { getInternalLinks, preloadImages } from './utils/dom';
import { addClass } from '@studiometa/js-toolkit/utils';

class App extends AppEvents {
    static config = {
        name: 'App',
        components: {
            Cursor,
            ScribbleLink,
            Home,
            About,
            Projects,
            Ui,
        },
        refs: [...AppEvents.config.refs, 'pageContainer'],
    };

    DOMParser = new DOMParser();
    internalLinks = [];

    mounted () {
        super.mounted();
        this.setupListeners();
        this.setupInternalLinks();
    }

    updated () {
        this.setupInternalLinks();
    }

    setupListeners () {
        window.addEventListener('popstate', () => this.onUrlChange({
            url: window.location.pathname,
            push: false,
        }));
    }

    setupInternalLinks() {
        this.internalLinks = getInternalLinks();
        this.addInternalLinkListeners();
    }

    async onUrlChange({ url, push = true }) {
        const request = await window.fetch(url);

        if (request.status !== 200) {
            console.error('Handle request error.')
            return;
        }

        if (push) window.history.pushState({}, '', url);

        this.cursor.disable();

        let pageDocument = await request.text();
        pageDocument = this.DOMParser.parseFromString(pageDocument, 'text/html');

        const preloadedImages = preloadImages(pageDocument);

        const pageElement = document.getElementById('page');
        const pageClass = pageElement.getAttribute('data-component');
        const pageComponent = getInstanceFromElement(pageElement, App.config.components[pageClass]);

        if (pageComponent) {
            await Promise.allSettled([
                pageComponent.animateOut(),
                ...preloadedImages,
            ]);
            pageComponent.$destroy();
        }
        this.replacePage(pageDocument);
        this.$update();
    }

    replacePage(pageDocument) {
        const pageElement = pageDocument.getElementById('page');
        this.$refs.pageContainer.replaceChildren(pageElement);
    }

    addInternalLinkListeners () {
        for (const internalLink of this.internalLinks) {
            internalLink.onclick = e => {
                e.preventDefault();
                this.onUrlChange({
                    url: internalLink.href,
                });
            }
        }
    }
}

export default createApp(App, document.body);
