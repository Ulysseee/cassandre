import { Base, withFreezedOptions, withScrolledInView } from '@studiometa/js-toolkit';

export default class Parallax extends withFreezedOptions(withScrolledInView(Base, {
    rootMargin: '100%',
})) {

    static config = {
        name: 'Parallax',
        options: {
            percent: {
                type: Number,
                default: 10,
            },
            reverse: {
                type: Boolean,
                default: false,
            },
        },
        refs: ['image'],
    };

    mounted() {
        this.$refs.image.style.willChange = 'transform';
        this.$options.reverse ? this.$refs.image.style.top = '0' : this.$refs.image.style.bottom = '0';
        this.$refs.image.style.height = `${100 + this.$options.percent}%`;
    }

    scrolledInView({ dampedProgress }) {
        const y = dampedProgress.y * this.$options.percent * (this.$options.reverse ? -1 : 1);
        this.$refs.image.style.transform = `translateY(${y}%)`;
    }
}
