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

    mounted () {
        super.mounted();
        this.splitTitle = new SplitType(this.$refs.titleParts, {
            type: 'words',
        });
    }

    scrolledInView({ current, start, end }) {
        const maxY = end.y - this.$refs.container.offsetHeight;
        const startY = start.y + this.$refs.container.offsetHeight;
        const progressY = clamp((current.y - startY) / (maxY - startY), 0, 1);

        const progressCubicIn = easeInCubic(progressY);
        const progressExpoIn = easeInExpo(progressY);

        for (const SVGReveal of this.$children.SVGReveal) {
            SVGReveal.progressDraw(progressCubicIn);
        }
        gsap.set(this.splitTitle.words, {
            yPercent: i =>  (i % 2 === 0 ? -1 : 1) * 100 * (1 - progressExpoIn),
        });
        gsap.set(this.$refs.content, {
            clipPath: `inset(${ 35 - progressCubicIn * 35 }%)`,
        });

        if (!this.reachEnd && Math.round(progressCubicIn * 100) / 100 === 1) {
            this.reachEnd = true;
            this.$refs.content.click();
        }
    }
}
