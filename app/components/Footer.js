import AppEvents from '../containers/AppEvents';
import { withScrolledInView } from '@studiometa/js-toolkit';
import SVGReveal from './SVGReveal';
import SplitType from 'split-type';
import gsap from 'gsap';
import { easeInExpo } from '@studiometa/js-toolkit/utils';

export default class Footer extends withScrolledInView(AppEvents, {
    rootMargin: '100%',
}) {
    static config = {
        ...AppEvents.config,
        name: 'Footer',
        refs: [...AppEvents.config.refs, 'mask', 'wrapper', 'title'],
        components: {
            SVGReveal,
        },
    };

    titleReveal = false;
    wordsPerLine = null;
    width = window.innerWidth;
    height = window.innerHeight;

    mounted () {
        super.mounted();

        this.width = this.$refs.wrapper.offsetWidth;
        this.height = this.$refs.wrapper.offsetHeight;

        this.$refs.mask.style.clipPath = `polygon(${ this.getPolygonPath(0) })`;

        this.wordsPerLine = new SplitType(this.$refs.title, {
            type: 'lines',
        }).lines.map(line => [line.querySelectorAll('.word')]);
    }

    scrolledInView ({ current, start }) {
        const max = start.y + this.height;
        const progress = (current.y - start.y) / (max - start.y);

        this.$refs.mask.style.clipPath = `polygon(${ this.getPolygonPath(progress) })`;

        const translateY = - (1 - progress) * this.height;
        this.$refs.wrapper.style.transform = `translate3d(0, ${ translateY }px, 0)`;

        for (const SVGReveal of this.$children.SVGReveal) {
            SVGReveal.progressDraw(1 - easeInExpo(progress));
        }

        if (!this.titleReveal && progress > 0.5) {
            this.titleReveal = true;
            this.wordsPerLine.forEach((wordsLine, index) => {
                gsap.from(wordsLine, {
                    yPercent: 100,
                    duration: 1,
                    ease: 'quint.out',
                    delay: 0.2 + index * 0.07,
                });
            });
        }
    }

    getPolygonPath (progress) {
        let clipPath = '100% 100%, 0% 100%, ';

        const widthSegments = Math.ceil(this.width / 80);
        const baseY = (1 - progress) * 100;
        const amplitude = (0.02 * this.width) * Math.sin(progress * Math.PI);

        clipPath += `0% ${ baseY }%, `;

        for (let index = 0; index <= widthSegments; index++) {
            const x = ((80 * index) / this.width) * 100;
            const y = baseY - Math.sin(((80 * index) / this.width) * Math.PI) * amplitude;

            clipPath += `${ x }% ${ y }%, `;
        }

        return clipPath.slice(0, -2);
    }
}
