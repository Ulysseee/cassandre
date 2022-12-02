import AppEvents from '../containers/AppEvents';
import SVGReveal from './SVGReveal';
import SplitType from 'split-type';
import gsap from 'gsap';
import { withScrolledInView } from '@studiometa/js-toolkit';
import { clamp, easeInCubic, easeInExpo } from '@studiometa/js-toolkit/utils';

export default class NextProject extends withScrolledInView(AppEvents, {
    rootMargin: '100%',
}) {
    static config = {
        ...AppEvents.config,
        name: 'NextProject',
        refs: [...AppEvents.config.refs, 'container', 'content', 'titleParts[]'],
        components: {
            SVGReveal,
        },
    };

    reachEnd = false;
    splitTitle = null;
    wordsDistance = 0;
    scrollProgressY = 0;

    mounted () {
        super.mounted();
        this.splitTitle = new SplitType(this.$refs.titleParts, {
            type: 'words',
        });
        this.wordsDistance = this.splitTitle.words[1].getBoundingClientRect().left - this.splitTitle.words[0].getBoundingClientRect().right;
    }

    scrolledInView({ current, start, end }) {
        const maxY = end.y - this.$refs.container.offsetHeight;
        const startY = start.y + this.$refs.container.offsetHeight;
        this.scrollProgressY = clamp((current.y - startY) / (maxY - startY), 0, 1);
        this.scrollProgressYEased = easeInCubic(this.scrollProgressY);

        if (!this.reachEnd && Math.round(this.scrollProgressYEased * 100) / 100 === 1) {
            this.reachEnd = true;
            this.$refs.content.click();
        }
    }

    ticked () {
        const progressExpoIn = easeInExpo(this.scrollProgressY);

        if (this.reachEnd) this.$services.disable('ticked');

        return () => {
            gsap.set(this.splitTitle.words, {
                translateX: i => (i % 2 === 0 ? 1 : -1) * (this.wordsDistance / 2 - 10) * (1 - progressExpoIn),
            });
            for (const SVGReveal of this.$children.SVGReveal) {
                SVGReveal.progressDraw(this.scrollProgressYEased);
            }
            gsap.set(this.$refs.content, {
                clipPath: `inset(0 ${ (1 - this.scrollProgressYEased) * 4.1 }% 0 ${ (1 - this.scrollProgressYEased) * 4.1 }%)`,
            });
        }
    }
}
