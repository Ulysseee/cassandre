import AppEvents from './AppEvents';
import { timeline } from 'motion';

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
        return timeline([
        ]).finished;
    }

    animateOut() {
        return timeline([
            [this.$el, { pointerEvents: 'none' }, { duration: 0 }],
            [this.$el, { opacity: 0 }, { duration: 0.5, easing: 'ease-out' }],
            [this.$el, { pointerEvents: 'auto' }, { duration: 0 }],
        ]).finished;
    }

}
