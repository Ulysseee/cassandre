import AppEvents from '../containers/AppEvents';
import { withScrolledInView } from '@studiometa/js-toolkit';
import SVGReveal from './SVGReveal';
import { easeInExpo, transform } from '@studiometa/js-toolkit/utils';

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

    wordsPerLine = null;
    width = window.innerWidth;
    height = window.innerHeight;
    scrollProgressY = 0;

    mounted () {
        super.mounted();

        this.width = this.$refs.wrapper.offsetWidth;
        this.height = this.$refs.wrapper.offsetHeight;
    }

    scrolledInView ({ current, start }) {
        const max = start.y + this.height;
        this.scrollProgressY = (current.y - start.y) / (max - start.y);
    }

    ticked () {
        const translateY = - (1 - this.scrollProgressY) * (this.height - 100);
        const polygonPath = this.getPolygonPath(this.scrollProgressY);

        return () => {
            transform(this.$refs.wrapper, { y: translateY });
            this.$refs.mask.style.clipPath = `polygon(${ polygonPath })`;
            for (const SVGReveal of this.$children.SVGReveal) {
                SVGReveal.progressDraw(1 - easeInExpo(this.scrollProgressY));
            }
        };
    }

    getPolygonPath (progress) {
        let clipPath = '100% 100%, 0% 100%, ';

        const widthSegments = Math.ceil(this.width / 80);
        const baseY = (1 - progress) * 100;
        const amplitude = (0.016 * this.width) * Math.sin(progress * Math.PI);

        clipPath += `0% ${ baseY }%, `;

        for (let index = 0; index <= widthSegments; index++) {
            const x = ((80 * index) / this.width) * 100;
            const y = baseY - Math.sin(((80 * index) / this.width) * Math.PI) * amplitude;

            clipPath += `${ x }% ${ y }%, `;
        }

        return clipPath.slice(0, -2);
    }
}
