import { Base } from '@studiometa/js-toolkit';
import SVG from '../utils/Svg';
import { easeOutQuad, map, tween } from '@studiometa/js-toolkit/utils';

export default class ScribbleLink extends Base {

    shapes;
    tweenIn;
    tweenOut;

    static config = {
        name: 'ScribbleLink',
        refs: ['scribble'],
    };

    mounted () {
        this.shapes = SVG.getShapes(this.$refs.scribble);
        SVG.setInitialAttributesShapes(this.shapes);
        this.setupTweens();
    }

    onMouseenter () {
        this.tweenOut.finish();
        if (this.tweenIn.progress() === 1) this.tweenIn.progress(0);
        this.tweenIn.play();
    }

    onMouseleave () {
        this.tweenIn.finish();
        if (this.tweenOut.progress() === 1) this.tweenOut.progress(0);
        this.tweenOut.play();
    }

    setupTweens () {
        this.tweenIn = tween(
            (progress) => {
                const reverseProgress = map(progress, 0, 1, 1, 0);
                this.setStrokeDashOffsetShapes(reverseProgress);
            },
            {
                duration: 0.7,
                easing: easeOutQuad,
            },
        );
        this.tweenOut = tween(
            (progress) => this.setStrokeDashOffsetShapes(-progress),
            {
                duration: 0.3,
                easing: easeOutQuad,
                onFinish: () => this.setStrokeDashOffsetShapes(1),
            },
        );
        this.tweenIn.pause();
        this.tweenOut.pause();
    }

    setStrokeDashOffsetShapes (offset) {
        for (const shape of this.shapes) {
            shape.el.setAttribute('stroke-dashoffset', `${ shape.length * offset }`);
        }
    }
}
