import { Renderer } from '@unseenco/taxi';
import { createLenis } from '../constants/lenis';
import { getInstanceFromElement } from '@studiometa/js-toolkit';
import Navigation from '../components/Navigation';

export default class DefaultRenderer extends Renderer {

    initialLoad () {
        this.wrapper.style.transform = 'translate3d(0, 101vh, 0)';
        createLenis();
    }

    onEnter () {

    }

    onEnterCompleted () {
        this.wrapper.style.transform = '';
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
