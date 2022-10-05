import AppEvents from '../containers/AppEvents';
import Matter from 'matter-js';
import { withFreezedOptions } from '@studiometa/js-toolkit';
import { COLORS } from '../constants/colors';
import { clamp, map } from '@studiometa/js-toolkit/utils';
import bubbleSprite01 from '../../assets/images/bubble-01.png';
import bubbleSprite02 from '../../assets/images/bubble-02.png';
import bubbleSprite03 from '../../assets/images/bubble-03.png';
import { isTouchDevice } from '../utils/detector';
import gsap from 'gsap';

const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events,
    Mouse = Matter.Mouse,
    Query = Matter.Query,
    Composite = Matter.Composite;

export default class HomeHeader extends withFreezedOptions(AppEvents) {
    static config = {
        ...AppEvents.config,
        name: 'HomeHeader',
        refs: [...AppEvents.config.refs, 'canvas', 'content'],
        options: {
            width: {
                type: Number,
                default: window.innerWidth,
            },
            height: {
                type: Number,
                default: window.innerHeight,
            },
            numberOfBubbles: {
                type: Number,
                default: 8,
            },
            colors: {
                type: Array,
                default: () => ([
                    COLORS.brownLight,
                    COLORS.brownLight,
                    COLORS.orange,
                    COLORS.orange,
                    COLORS.beige,
                    COLORS.brownLight,
                    COLORS.orange,
                    COLORS.brownLight,
                ]),
            },
            direction: {
                type: Array,
                default: () => (Array(8)),
            },
            positions: {
                type: Array,
                default: () => ([
                    HomeHeader.calculatePosition(127, 332, window.innerWidth, window.innerHeight),
                    HomeHeader.calculatePosition(262, 376, window.innerWidth, window.innerHeight),
                    HomeHeader.calculatePosition(511, 393, window.innerWidth, window.innerHeight),
                    HomeHeader.calculatePosition(587, 128, window.innerWidth, window.innerHeight),
                    HomeHeader.calculatePosition(595, 337, window.innerWidth, window.innerHeight),
                    HomeHeader.calculatePosition(920, 68, window.innerWidth, window.innerHeight),
                    HomeHeader.calculatePosition(1041, 133, window.innerWidth, window.innerHeight),
                    HomeHeader.calculatePosition(1122, 372, window.innerWidth, window.innerHeight),
                ]),
            }
        },
    };

    bubblesCreated = false;
    engine = null;
    render = null;
    bubbles = [];
    circleProperties = {
        density: 10,
        restitution: 1,
        speed: 0.6,
        friction: 0.5,
        frictionAir: 0.002,
        render: {
            fillStyle: COLORS.beige,
        },
    };
    sprites = [
        '',
        bubbleSprite01,
        '',
        bubbleSprite02,
        '',
        bubbleSprite03,
    ];
    maxTranslateX = 0;

    static calculatePosition(x, y, width, height) {
        return {
            x: map(x + 54, 0, 1440, 0, width),
            y: map(y + 54, 0, 735, 0, height),
        };
    }

    mounted() {
        this.maxTranslateX = this.$el.offsetWidth - this.$refs.content.getBoundingClientRect().right;
        if (!this.bubblesCreated) this.createWorldBubbles();
    }

    scrolled ({ y, progress, max }) {
        const progressOutOfView = clamp(y / window.innerHeight, 0, 1);
        const maxTranslateY = max.y - window.innerHeight - window.innerHeight / 10;
        const maxRotate = -8;

        gsap.set(this.$refs.content, {
            y: maxTranslateY * progress.y,
            x: this.maxTranslateX * progress.y,
            opacity: 1 - progressOutOfView + 0.1,
            rotate: `${ maxRotate * progress.y }deg`,
        });
    }

    createWorldBubbles () {
        this.bubblesCreated = true;
        this.engine = Engine.create({
            gravity: {
                x: 0,
                y: 0,
            },
        });

        this.render = Render.create({
            element: this.$refs.canvas,
            engine: this.engine,
            options: {
                width: this.$options.width,
                height: this.$options.height,
                element: this.$el,
                engine: this.engine,
                hasBounds: true,
                wireframes: false,
                background: '',
                wireframeBackground: '',
                showBounds: false,
            },
        });

        if (!isTouchDevice()) this.setupMouse();
        this.createWalls(this.$options.numberOfBubbles);
        this.createBubbles(this.$options.numberOfBubbles);
        this.applyRandomForces();

        Composite.add(this.engine.world, this.bubbles);
        Render.run(this.render);
        this.runner = Runner.create();
        Runner.run(this.runner, this.engine);
    }

    createWalls ({ wallThickness = 100 } = { wallThickness: 100 }) {
        const wallOptions = {
            isStatic: true,
            render: {
                fillStyle: 'transparent',
                strokeStyle: 'transparent',
                lineWidth: 0,
                frictionStatic: 0,
            },
        };
        Composite.add(this.engine.world, [
            Bodies.rectangle(this.$options.width / 2, 0 - wallThickness / 2, this.$options.width, wallThickness, wallOptions),
            Bodies.rectangle(this.$options.width + wallThickness / 2, this.$options.height / 2, wallThickness, this.$options.height, wallOptions),
            Bodies.rectangle(this.$options.width / 2, this.$options.height + wallThickness / 2, this.$options.width, wallThickness, wallOptions),
            Bodies.rectangle(0 - wallThickness / 2, this.$options.height / 2, wallThickness, this.$options.height, wallOptions),
        ]);
    }

    createBubbles (number) {
        const radius = window.innerWidth < 700 ? 36 : 54;
        const spriteScale = window.innerWidth < 700 ? 0.666 : 1;
        for (let i = 0; i < number; i++) {
            const customBubbleProperty = {
                ...this.circleProperties,
                render: {
                    sprite: {
                        texture: this.sprites[i],
                        xScale: spriteScale,
                        yScale: spriteScale,
                    },
                    fillStyle: this.$options.colors[i],
                },
            };
            this.bubbles.push(
                Bodies.circle(this.$options.positions[i].x, this.$options.positions[i].y, radius, customBubbleProperty),
            );
        }
    }

    applyRandomForces () {
        for (const bubble of this.bubbles) {
            Matter.Body.applyForce(bubble, {
                x: 0, y: 0,
            }, {
                x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10,
            });
        }
    }

    setupMouse () {
        const mouse = Mouse.create(document.body);
        const mouseConstraint = MouseConstraint.create(this.engine, {
            mouse: mouse,
            constraint: {
                render: {
                    visible: false,
                },
            },
        });
        World.add(this.engine.world, mouseConstraint);
        Events.on(mouseConstraint, 'mousemove', this.handleMouseMove.bind(this));
    }

    handleMouseMove (e) {
        const foundPhysics = Query.point(this.bubbles, e.mouse.position);
        const [hoveredBubble] = foundPhysics;
        if (hoveredBubble) {
            hoveredBubble.force.x = (Math.random() - 0.5) * 2;
            hoveredBubble.force.y = (Math.random() - 0.5) * 2;
        }
    }
}
