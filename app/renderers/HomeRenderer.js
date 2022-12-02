import { Renderer } from '@unseenco/taxi';
import { createLenis } from '../constants/lenis';

export default class HomeRenderer extends Renderer {

    initialLoad () {
        createLenis();
    }

    onEnter () {
        this.wrapper.style.transform = '';
    }

    onEnterCompleted () {

    }

    onLeave () {

    }

    onLeaveCompleted () {
        this.wrapper.style.transform = 'translate3d(0, 101vh, 0)';
        window.lenis.scrollTo(0, {
            immediate: true,
        });
    }
}
