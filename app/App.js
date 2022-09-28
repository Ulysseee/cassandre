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
import Parallax from './components/Parallax';
import Lenis from '@studio-freight/lenis'
import Title from './components/Title';

class App extends AppEvents {
    static config = {
        name: 'App',
        components: {
            Cursor,
            ScribbleLink,
            Parallax,
            Home,
            About,
            Projects,
            Ui,
            Title,
        },
        refs: [...AppEvents.config.refs, 'pageContainer'],
    };

    currentPageInstance = null;
    DOMParser = new DOMParser();
    internalLinks = [];

    mounted () {
        super.mounted();

        const appOverlay = document.querySelector('.appOverlay');
        appOverlay.remove();

        this.updateCurrentPageInstance();

        this.setupListeners();
        this.setupInternalLinks();

        this.createLenis().stop();

        this.updateFrame();
    }

    updateFrame(time) {
        window.lenis.raf(time);
        requestAnimationFrame(this.updateFrame.bind(this));
    }

    showCurrentPage() {
        window.lenis.start();
        this.currentPageInstance.animateIn();
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
        const preloaderAnimateIn = preloader.animatePageTransitionIn().then(() => {
            window.lenis.destroy();
        });

        if (this.cursor) this.cursor.disable();

        const request = await window.fetch(url);

        if (request.status !== 200) {
            console.error('Handle request error.')
            return;
        }

        if (push) window.history.pushState({}, '', url);

        let pageDocument = await request.text();
        pageDocument = this.DOMParser.parseFromString(pageDocument, 'text/html');

        const preloadedImages = preloadImages(pageDocument);

        await Promise.all([
            new Promise(resolve => {
                setTimeout(resolve, 700);
            }),
            ...preloadedImages,
        ]);

        this.currentPageInstance.$destroy();

        window.scrollTo(0, 0);

        this.replacePage(pageDocument);
        this.$update();
        this.updateCurrentPageInstance();

        this.updateNavigationColor();
        this.setupInternalLinks();

        this.createLenis();

        this.showCurrentPage();
        preloader.animatePageTransitionOut();
    }

    replacePage(pageDocument) {
        const pageElement = pageDocument.getElementById('page');
        this.$refs.pageContainer.replaceChildren(pageElement);
    }

    addInternalLinkListeners () {
        for (const internalLink of this.internalLinks) {
            internalLink.onclick = e => {
                e.preventDefault();
                if (internalLink.href === window.location.href) return;
                this.onUrlChange({
                    url: internalLink.href,
                });
            }
        }
    }

    createLenis() {
        if (window.lenis) window.lenis.destroy();
        return window.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });
    }

    updateCurrentPageInstance () {
        const pageElement = document.getElementById('page');
        const pageClass = pageElement.getAttribute('data-component');
        this.currentPageInstance = getInstanceFromElement(pageElement, App.config.components[pageClass]);
    }

    updateNavigationColor () {
        const isDarkPage = this.currentPageInstance.$el.classList.contains('is-dark');
        const navigation = document.querySelector('.component-navigation');
        navigation.classList.toggle('of-dark-page', isDarkPage);
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
