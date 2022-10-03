import AppEvents from '../containers/AppEvents';
import Hammer from 'hammerjs';
import gsap from 'gsap';
import { clamp, damp } from '@studiometa/js-toolkit/utils';

export default class Slider extends AppEvents {

    static config = {
        ...AppEvents.config,
        name: 'Slider',
        refs: [...AppEvents.config.refs, 'wrapper', 'slides[]', 'images[]'],
        options: {
            infinite: {
                type: Boolean,
                default: false,
            },
            centered: {
                type: Boolean,
                default: true,
            },
            speed: {
                type: Number,
                default: 0.1,
            },
            lerp: {
                type: Number,
                default: 0.08,
            },
            scaleOnPress: {
                type: Number,
                default: 0.97,
            },
        },
    };

    hammerManager = null;

    state = {
        isEnabled: true,
        isPressed: false,
        forward: null,
        baseTranslateX: null,
        targetTranslateX: 0,
        currentTranslateX: 0,
        minTranslateX: null,
        maxTranslateX: null,
    };

    mounted () {
        super.mounted();

        this.setHammerManager();
        this.init();

        this.raq = requestAnimationFrame(this.update.bind(this));
    }

    destroyed() {
        this.hammerManager.destroy();
        cancelAnimationFrame(this.raq);
    }

    handleResize () {
        this.state = {
            isEnabled: true,
            isPressed: false,
            forward: null,
            baseTranslateX: null,
            targetTranslateX: 0,
            currentTranslateX: 0,
            minTranslateX: null,
            maxTranslateX: null,
        };
        this.setHammerManager();
        this.calculateBounds();
    }

    setHammerManager () {
        this.hammerManager = new Hammer.Manager(this.$el, {
            recognizers: [
                [Hammer.Pan, { event: 'pan', direction: Hammer.DIRECTION_HORIZONTAL }],
                [Hammer.Press, { event: 'press', time: 0 }],
            ],
        });
    }

    init () {
        this.calculateBounds();
        if (!this.state.isEnabled) return;
        if (this.$options.infinite) this.cloneSlides();
        this.addEvents();
    }

    cloneSlides () {
        const slides = this.$refs.wrapper.childNodes;
        slides.forEach(slide => this.$refs.wrapper.appendChild(slide.cloneNode(true)));
        this.$update();
    }

    calculateBounds () {
        const containerBox = this.$el.getBoundingClientRect();
        const wrapperBox = this.$refs.wrapper.getBoundingClientRect();

        const lengthOverflowX = containerBox.right - wrapperBox.right;

        if (lengthOverflowX >= 0) {
            this.state.isEnabled = false;
            this.setDisableStyle();
            return;
        }

        this.state.minTranslateX = lengthOverflowX;
        if (this.$options.infinite) {
            this.state.minTranslateX -= wrapperBox.width;
            this.state.baseTranslateX = -wrapperBox.width;
        }
        this.state.maxTranslateX = 0;

        if (this.$options.centered) {
            this.state.currentTranslateX = this.state.minTranslateX / 2;
            this.state.targetTranslateX = this.state.minTranslateX / 2;
        }
    }

    addEvents () {
        this.hammerManager.on('pan', this.onPanStart.bind(this));
        this.hammerManager.on('panend', this.onPanEnd.bind(this));
        this.hammerManager.on('press', this.onPressDown.bind(this));
        this.hammerManager.on('pressup', this.onPressUp.bind(this));
    }

    onPanStart (e) {
        const { deltaX, direction } = e;
        this.state.forward = direction === 2;
        this.state.targetTranslateX += deltaX * this.$options.speed;
    }

    onPanEnd () {
        this.onPressUp();
    }

    onPressDown () {
        this.state.isPressed = true;
        gsap.killTweensOf([this.$refs.slides, this.$refs.images]);
        gsap.to(this.$refs.slides, {
            scale: this.$options.scaleOnPress,
            duration: 0.7,
            ease: 'power4.out',
        });
        gsap.to(this.$refs.images, {
            scale: 1.1,
            duration: 1,
            ease: 'power4.out',
        });
    }

    onPressUp () {
        this.state.isPressed = false;
        gsap.killTweensOf([this.$refs.slides, this.$refs.images]);
        gsap.to(this.$refs.slides, {
            scale: 1,
            duration: 0.5,
            ease: 'power4.out',
        });
        gsap.to(this.$refs.images, {
            scale: 1,
            duration: 0.5,
            ease: 'power4.out',
        });
    }

    update () {
        if (this.$options.infinite && this.state.forward && this.state.currentTranslateX <= this.state.baseTranslateX) {
            this.state.targetTranslateX = this.state.maxTranslateX + this.state.targetTranslateX - this.state.currentTranslateX;
            this.state.currentTranslateX = this.state.maxTranslateX;
        } else if (this.$options.infinite && !this.state.forward && this.state.targetTranslateX >= this.state.maxTranslateX) {
            this.state.targetTranslateX = this.state.baseTranslateX + this.state.targetTranslateX - this.state.currentTranslateX;
            this.state.currentTranslateX = this.state.baseTranslateX + this.state.currentTranslateX;
        } else {
            this.state.targetTranslateX = clamp(this.state.targetTranslateX, this.state.minTranslateX, this.state.maxTranslateX);
            this.state.currentTranslateX = damp(this.state.targetTranslateX, this.state.currentTranslateX, this.$options.lerp, 0.01);
        }

        gsap.set(this.$refs.wrapper, { x: this.state.currentTranslateX });

        requestAnimationFrame(this.update.bind(this));
    }

    setDisableStyle () {
        this.$refs.wrapper.style.width = '100%';
        this.$refs.wrapper.style.justifyContent = 'center';
        this.$refs.wrapper.style.cursor = 'default';
    }
}
