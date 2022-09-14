import { Base, withScrolledInView } from '@studiometa/js-toolkit';
import { map } from '@studiometa/js-toolkit/utils';

export default class Parallax extends withScrolledInView(Base) {

    static config = {
        name: 'Parallax',
        options: {
            speed: {
                type: Number,
                default: 1,
            },
            reverse: {
                type: Boolean,
                default: false,
            },
        },
        refs: ['image'],
    };


    scrolledInView({ dampedProgress }) {
        const y = map(dampedProgress.y, 0, 1, -100, 100) * this.$options.speed * (this.$options.reverse ? -1 : 1);
        // this.$refs.image.style.transform = `translateY(${y}px)`;
    }
}
