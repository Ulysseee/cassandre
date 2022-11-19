import Page from '../containers/Page';
import ContactMe from '../components/ContactMe';
import Title from '../components/Title';
import SVGReveal from '../components/SVGReveal';

export default class About extends Page {
    static config = {
        ...Page.config,
        name: 'About',
        refs: [...Page.config.refs],
        components: {
            Title,
            SVGReveal,
            ContactMe,
        },
    };

    title = null;
    scribble = null;

    mounted () {
        [this.title] = this.$children.Title;
        [this.scribble] = this.$children.SVGReveal;
        this.title.onAnimateInStart = this.onTitleAnimateInStart.bind(this);
        this.title.onAnimateInComplete = this.onTitleAnimateInComplete.bind(this);
    }

    onTitleAnimateInStart () {
        const lastTitleWord = this.title.splitText.words[this.title.splitText.words.length - 1];
        const lastTitleWordRect = lastTitleWord.getBoundingClientRect();
        const scribbleRect = this.scribble.$el.getBoundingClientRect();

        this.scribble.$el.style.top = `${ lastTitleWordRect.bottom - scribbleRect.height / 2 - 10 }px`;
        this.scribble.$el.style.left = `${ lastTitleWordRect.left - 20}px`;
    }

    onTitleAnimateInComplete () {
        this.scribble.drawStrokes({
            ease: 'cubit.out',
            delay: 0,
        });
    }
}
