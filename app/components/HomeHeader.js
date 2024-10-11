import AppEvents from "../containers/AppEvents";
import Matter from "matter-js";
import {
  withFreezedOptions,
  withIntersectionObserver,
} from "@studiometa/js-toolkit";
import { COLORS } from "../constants/colors";
import { clamp, map } from "@studiometa/js-toolkit/utils";
import gsap from "gsap";
import { ANIMATIONS } from "../constants/animations";
import CustomEase from "gsap/CustomEase";
import { triggerChildrenAnimateIn } from "../utils/triggerChildrenAnimateIn";
import Paragraph from "./Paragraph";

const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  World = Matter.World,
  MouseConstraint = Matter.MouseConstraint,
  Events = Matter.Events,
  Mouse = Matter.Mouse,
  Query = Matter.Query,
  Body = Matter.Body,
  Composite = Matter.Composite;

export default class HomeHeader extends withIntersectionObserver(
  withFreezedOptions(AppEvents),
  {
    ...ANIMATIONS.intersectionObserver,
  }
) {
  static config = {
    ...AppEvents.config,
    name: "HomeHeader",
    refs: [...AppEvents.config.refs, "canvas", "content", "titleChunks[]"],
    components: {
      Paragraph,
    },
    options: {
      width: {
        type: Number,
        default: window.innerWidth,
      },
      height: {
        type: Number,
        default: window.innerHeight,
      },
      bubbleImages: {
        type: Array,
      },
      numberOfBubbles: {
        type: Number,
        default: 8,
      },
      colors: {
        type: Array,
        default: () => [
          COLORS.brownLight,
          COLORS.beige,
          COLORS.orange,
          COLORS.brownLight,
          COLORS.beige,
          COLORS.brownLight,
          COLORS.orange,
          COLORS.brownLight,
        ],
      },
      positions: {
        type: Array,
        default: () => [
          HomeHeader.calculatePosition(
            127,
            332,
            window.innerWidth,
            window.innerHeight
          ),
          HomeHeader.calculatePosition(
            262,
            376,
            window.innerWidth,
            window.innerHeight
          ),
          HomeHeader.calculatePosition(
            511,
            393,
            window.innerWidth,
            window.innerHeight
          ),
          HomeHeader.calculatePosition(
            587,
            128,
            window.innerWidth,
            window.innerHeight
          ),
          HomeHeader.calculatePosition(
            595,
            337,
            window.innerWidth,
            window.innerHeight
          ),
          HomeHeader.calculatePosition(
            920,
            68,
            window.innerWidth,
            window.innerHeight
          ),
          HomeHeader.calculatePosition(
            1041,
            133,
            window.innerWidth,
            window.innerHeight
          ),
          HomeHeader.calculatePosition(
            1122,
            372,
            window.innerWidth,
            window.innerHeight
          ),
        ],
      },
    },
  };

  revealed = false;
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
  sprites = [];
  scrollProgressY = 0;
  maxTranslateX = 0;
  maxTranslateY = 0;
  maxRotate = -8;
  progressOutOfView = 0;

  static calculatePosition(x, y, width, height) {
    return {
      x: map(x + 54, 0, 1440, 0, width),
      y: map(y + 54, 0, 735, 0, height),
    };
  }

  mounted() {
    this.animateIn = this.animateIn.bind(this);
    this.maxTranslateX =
      this.$el.offsetWidth - this.$refs.content.getBoundingClientRect().right;
    this.sprites = this.$options.bubbleImages;
    for (let i = 0; i < this.$options.numberOfBubbles; i++) {
      if (!this.sprites[i]) {
        this.sprites[i] = "";
      }
    }
    this.sprites = this.sprites.sort(() => 0.5 - Math.random());

    if (!this.bubblesCreated) {
      this.createWorldBubbles();
      this.applyRandomForces(window.innerWidth < 700 ? 60 : 120);
      this.bubbles.forEach((bubble, index) => {
        Body.setPosition(bubble, {
          x: this.$options.positions[index].x,
          y: -(window.innerWidth < 700 ? 72 : 108),
        });
      });
    }
    this.titleTween = gsap.from(this.$refs.titleChunks, {
      yPercent: 100,
      duration: 1.4,
      stagger: 0.07,
      ease: CustomEase.create(
        "custom",
        "M0,0 C0.046,0.498 0.077,0.805 0.226,0.904 0.356,0.99 0.504,1 1,1 "
      ),
      paused: true,
    });
  }

  animateIn(reverseDirection = false, delay = 0.07) {
    this.bubbles.forEach((bubble, index) => {
      gsap.to(bubble, {
        duration: 1,
        ease:
          window.innerWidth > 700
            ? "elastic.out(1, 0.4)"
            : "elastic.out(1, 0.7)",
        onUpdate: function (positions) {
          const y = map(
            this.ratio,
            0,
            1,
            window.innerHeight * (reverseDirection ? -1 : 1),
            positions[index].y
          );
          Body.setPosition(bubble, { x: positions[index].x, y });
        },
        onUpdateParams: [this.$options.positions],
        delay: delay * index,
      });
    });
    this.titleTween.play(0);
    triggerChildrenAnimateIn(this, "HomeHeader", ["Paragraph"]);
  }

  scrolled({ y, progress, max }) {
    this.scrollProgressY = progress.y;
    // this.progressOutOfView = clamp(y / window.innerHeight, 0, 1);
    this.progressOutOfView = clamp(y / max.y, 0, 1);
    this.maxTranslateY = max.y - window.innerHeight + window.innerHeight / 10;
    this.minScale = 0.5;
  }

  ticked() {
    return () => {
      this.engine.gravity.y = this.progressOutOfView;
      gsap.set(this.$refs.content, {
        y: this.maxTranslateY * this.scrollProgressY,
        opacity: 1 - this.progressOutOfView + 0.1,
      });
    };
  }

  createWorldBubbles() {
    this.bubblesCreated = true;
    this.engine = Engine.create({
      gravity: {
        x: 0,
        y: 0.01,
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
        background: "",
        wireframeBackground: "",
        showBounds: false,
      },
    });

    this.setupEvents();
    this.createWalls(this.$options.numberOfBubbles);
    this.createBubbles(this.$options.numberOfBubbles);
    this.applyRandomForces();

    Composite.add(this.engine.world, this.bubbles);
    Render.run(this.render);
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);
  }

  createWalls({ wallThickness = 100 } = { wallThickness: 100 }) {
    const wallOptions = {
      isStatic: true,
      render: {
        fillStyle: "transparent",
        strokeStyle: "transparent",
        lineWidth: 0,
        frictionStatic: 0,
      },
    };
    Composite.add(this.engine.world, [
      Bodies.rectangle(
        this.$options.width / 2,
        0 - wallThickness / 2,
        this.$options.width,
        wallThickness,
        wallOptions
      ),
      Bodies.rectangle(
        this.$options.width + wallThickness / 2,
        this.$options.height / 2,
        wallThickness,
        this.$options.height,
        wallOptions
      ),
      Bodies.rectangle(
        this.$options.width / 2,
        this.$options.height + wallThickness / 2,
        this.$options.width,
        wallThickness,
        wallOptions
      ),
      Bodies.rectangle(
        0 - wallThickness / 2,
        this.$options.height / 2,
        wallThickness,
        this.$options.height,
        wallOptions
      ),
    ]);
  }

  createBubbles(number) {
    const radius = window.innerWidth < 700 ? 36 : 54;
    const spriteScale = window.innerWidth < 700 ? 0.666 : 1;
    for (let i = 0; i < number; i++) {
      console.log(this.$options.colors[i], COLORS);

      const customBubbleProperty = {
        ...this.circleProperties,
        render: {
          sprite: {
            texture: this.sprites[i],
            xScale: spriteScale,
            yScale: spriteScale,
          },
          fillStyle: this.$options.colors[i],
          //   fillStyle: this.$options.colors[i],
        },
      };
      this.bubbles.push(
        Bodies.circle(
          this.$options.positions[i].x,
          this.$options.positions[i].y,
          radius,
          customBubbleProperty
        )
      );
    }
  }

  applyRandomForces(force = 10) {
    for (const bubble of this.bubbles) {
      Matter.Body.applyForce(
        bubble,
        {
          x: 0,
          y: 0,
        },
        {
          x: (Math.random() - 0.5) * force,
          y: (Math.random() - 0.5) * force,
        }
      );
    }
  }

  setupEvents() {
    const mouse = Mouse.create(this.$refs.canvas);
    const mouseConstraint = MouseConstraint.create(this.engine, {
      mouse: mouse,
      constraint: {
        render: {
          visible: false,
        },
      },
    });
    mouseConstraint.mouse.element.removeEventListener(
      "touchstart",
      mouseConstraint.mouse.mousedown
    );
    mouseConstraint.mouse.element.removeEventListener(
      "touchmove",
      mouseConstraint.mouse.mousemove
    );
    mouseConstraint.mouse.element.removeEventListener(
      "touchend",
      mouseConstraint.mouse.mouseup
    );

    mouseConstraint.mouse.element.addEventListener(
      "touchstart",
      mouseConstraint.mouse.mousedown,
      { passive: true }
    );
    mouseConstraint.mouse.element.addEventListener("touchmove", (e) => {
      if (mouseConstraint.body) {
        mouseConstraint.mouse.mousemove(e);
      }
    });
    mouseConstraint.mouse.element.addEventListener("touchend", (e) => {
      if (mouseConstraint.body) {
        mouseConstraint.mouse.mouseup(e);
      }
    });
    World.add(this.engine.world, mouseConstraint);
  }

  handleMouseMove(e) {
    const foundPhysics = Query.point(this.bubbles, e.mouse.position);
    const [hoveredBubble] = foundPhysics;
    if (hoveredBubble) {
      hoveredBubble.force.x = (Math.random() - 0.5) * 2;
      hoveredBubble.force.y = (Math.random() - 0.5) * 2;
    }
  }
}
