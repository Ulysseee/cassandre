import AppEvents from '../containers/AppEvents';
import { withScrolledInView } from '@studiometa/js-toolkit';

export default class Footer extends withScrolledInView(AppEvents) {
    static config = {
        ...AppEvents.config,
        name: 'Component',
        refs: [...AppEvents.config.refs, 'overlay', 'wrapper'],
    };

    mounted() {
        super.mounted();
        this.overlay = {
            context: this.$refs.overlay.getContext('2d'),
            width: window.innerWidth * window.devicePixelRatio,
            height: window.innerHeight * window.devicePixelRatio,
        };
        this.$refs.overlay.width = this.overlay.width;
        this.$refs.overlay.height = this.overlay.height;
    }

    scrolledInView({ current, start }) {
        const max = start.y + this.$refs.overlay.offsetHeight;
        const progress = (current.y - start.y) / (max- start.y);
        this.animateOverlay(progress);
        const translateY = (1 - progress) * -this.$refs.wrapper.innerHeight + 100;
        this.$refs.wrapper.style.transform = `translate3d(0, ${translateY}px, 0)`;
    }

    animateOverlay (progress) {
        this.overlay.context.clearRect(0, 0, this.overlay.width, this.overlay.height);
        this.overlay.context.save();
        this.overlay.context.beginPath();

        this.overlay.context.moveTo(this.overlay.width, this.overlay.height);
        this.overlay.context.lineTo(0, this.overlay.height);

        const widthSegments = Math.ceil(this.overlay.width / 40);
        const t = (1 - progress) * this.overlay.height;
        const amplitude = (window.innerWidth / 4) * Math.sin(progress * Math.PI);

        this.overlay.context.lineTo(0, t);

        for (let index = 0; index <= widthSegments; index++) {
            const n = 40 * index;
            const r = t - Math.sin((n / this.overlay.width) * Math.PI) * amplitude;

            this.overlay.context.lineTo(n, r);
        }

        this.overlay.context.fillStyle = '#F5EDE2';
        this.overlay.context.fill();
        this.overlay.context.restore();
    }
}
