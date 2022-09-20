import AppEvents from './containers/AppEvents';
import { getInstanceFromElement } from '@studiometa/js-toolkit';
import Cursor from './components/Cursor';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Ui from './pages/Ui';
import ScribbleLink from './components/ScribbleLink';
import { getInternalLinks, preloadImages } from './utils/dom';
import Preloader from './components/Preloader';

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

    currentPageInstance = null;
    DOMParser = new DOMParser();
    internalLinks = [];

    mounted () {
        super.mounted();

        this.updateCurrentPageInstance();

        this.setupListeners();
        this.setupInternalLinks();

        this.$on('preloader-end', this.handleLoaderEnd);
    }

    showCurrentPage() {
        this.currentPageInstance.animateIn();
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

        this.updateCurrentPageInstance();

        if (this.currentPageInstance) {
            await Promise.allSettled([
                this.currentPageInstance.animateOut(),
                ...preloadedImages,
            ]);
            this.currentPageInstance.$destroy();
        }

        this.replacePage(pageDocument);
        this.$update();

        this.updateCurrentPageInstance();
        this.currentPageInstance.animateIn();
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

    updateCurrentPageInstance () {
        const pageElement = document.getElementById('page');
        const pageClass = pageElement.getAttribute('data-component');
        this.currentPageInstance = getInstanceFromElement(pageElement, App.config.components[pageClass]);
    }
}

const [preloader] = Preloader.$factory('Preloader');
const [app] = App.$factory('App');

const bootApp = async () => {
    await preloader.animateOut();
    app.showCurrentPage();
};

const appLoaded = new Promise((resolve) => {
    window.addEventListener('load', resolve);
});

Promise.all([appLoaded, preloader.animateIn()]).then(bootApp);
