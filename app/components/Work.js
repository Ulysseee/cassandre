import {
    getInstanceFromElement,
    withIntersectionObserver,
    withResponsiveOptions,
    withScrolledInView,
} from '@studiometa/js-toolkit';
import AppEvents from '../containers/AppEvents';
import SVGReveal from './SVGReveal';
import { addClass, transform } from '@studiometa/js-toolkit/utils';
import Paragraph from './Paragraph';
import Title from './Title';
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';
import { ANIMATIONS } from '../constants/animations';

export default class Work extends withResponsiveOptions(withScrolledInView(withIntersectionObserver(AppEvents, {
    ...ANIMATIONS.intersectionObserver,
}), {
    rootMargin: '100%',
})) {
    static config = {
        ...AppEvents.config,
        name: 'Work',
        refs: [...AppEvents.config.refs, 'cover', 'text', 'index'],
        options: {
            rotate: {
                type: Number,
                default: 5,
            },
            translateY: {
                type: Number,
                default: -250,
                responsive: true,
            },
        },
        components: {
            Title,
            Paragraph,
            SVGReveal,
        },
    };

    titleTitleComponent = null;
    isVisible = false;
    scrollProgressY = 0;
    textEase = CustomEase.create('custom', 'M0,0 C0,0.134 -0.018,0.502 0.28,0.502 0.392,0.502 0.358,0.502 0.498,0.502 0.626,0.502 0.574,0.502 0.688,0.502 0.994,0.502 0.83,1 1,1');

    mounted () {
        super.mounted();
        this.titleTitleComponent = this.$children.Title[0];
        this.indexParagraphComponent = getInstanceFromElement(this.$refs.index, Paragraph);
        this.titleTitleComponent.onAnimateInComplete = this.indexParagraphComponent.animateIn;
        const lastWordFirstLine = this.titleTitleComponent.splitText.words.map(word => ({
            dist: word.getBoundingClientRect().top,
            el: word,
        })).reduce((a, b) => a.dist < b.dist ? a : b).el;
        const wordTitleRight = lastWordFirstLine.getBoundingClientRect().right
        const indexLeft = this.indexParagraphComponent.$el.getBoundingClientRect().left
        gsap.set(this.indexParagraphComponent.$el, {
            x: wordTitleRight - indexLeft + 16,
        })
    }

    intersected ([{ isIntersecting }]) {
        if (isIntersecting && !this.isVisible) {
            this.isVisible = true;
            addClass(this.$el, 'is-visible');
            for (const SVGReveal of this.$children.SVGReveal) {
                SVGReveal.drawStrokes();
            }
        }
    }

    scrolledInView ({ progress }) {
        this.scrollProgressY = progress.y;
    }

    ticked () {
        const coverRotate = (this.scrollProgressY - 0.5) * this.$options.rotate;
        const textTranslateY = (this.scrollProgressY - 0.5) * this.$options.translateY;

        return () => {
            transform(this.$refs.cover, { rotate: coverRotate });
            gsap.set(this.$refs.text, {
                translateY: textTranslateY,
                ease: this.textEase,
            })
        };
    }
}
