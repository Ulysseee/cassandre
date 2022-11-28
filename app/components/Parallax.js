import { Base, withFreezedOptions, withScrolledInView } from '@studiometa/js-toolkit';
import { transform } from '@studiometa/js-toolkit/utils';

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

    scrollProgressY = 0;

    mounted () {
        this.$refs.image.style.willChange = 'transform';
        this.$options.reverse ? this.$refs.image.style.top = '0' : this.$refs.image.style.bottom = '0';
        this.$refs.image.style.height = `${ 100 + this.$options.percent }%`;
    }

    scrolledInView ({ progress }) {
        this.scrollProgressY = progress.y;
    }

    ticked () {
        const y = this.scrollProgressY * this.$options.percent * (this.$options.reverse ? -1 : 1);

        return () => {
            transform(this.$refs.image, { y });
        };
    }
}
