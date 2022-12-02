import AppEvents from './AppEvents';
import gsap from 'gsap';

export default class Page extends AppEvents {

    static config = {
        ...AppEvents.config,
        refs: [...AppEvents.config.refs],
    };

    async mounted() {
        super.mounted();
        if (this.cursor) this.cursor.enable();
    }

    destroyed() {
        super.destroyed();
        if (this.cursor) this.cursor.disable();
    }

    animateIn() {
        return new Promise(resolve => {
            gsap.timeline({
                // onStart: () => {
                //     gsap.set(this.$el, { clearProps: 'display' });
                // },
                onComplete: resolve,
            })
                // .to(this.$el, {
                //     autoAlpha: 1,
                //     duration: 0.01,
                // });
        });
    }

    animateOut() {
        return new Promise(resolve => {
            gsap.timeline({
                onComplete: resolve,
            })
                // .to(this.$el, {
                //     autoAlpha: 0,
                // });
        })
    }

}
