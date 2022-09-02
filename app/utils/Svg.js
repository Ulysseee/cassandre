import { easeOutQuad, map, tween } from '@studiometa/js-toolkit/utils';

export default class SVG {
    static getShapes(svg) {
        const shapes = [];
        const trackShapes = element => {
            if (element.children.length > 0) [...element.children].forEach(subChildElement => trackShapes(subChildElement));
            if (!element.hasAttribute('stroke') || element.hasAttribute('data-static-stroke')) return;
            const shapeLength = SVG.getShapeLength(element);
            if (shapeLength) {
                shapes.push({
                    el: element,
                    length: shapeLength,
                });
            }
        };
        trackShapes(svg);
        return shapes;
    }

    static getShapeLength(shape) {
        if (!(shape instanceof SVGGeometryElement)) return null;
        if (shape instanceof SVGPolygonElement) return shape.getTotalLength();
        if (shape instanceof SVGPolylineElement) return shape.getTotalLength();
        if (shape instanceof SVGCircleElement) return Math.round(2 * Math.PI * parseInt(shape.getAttribute('r'), 10));
        if (shape instanceof SVGRectElement) return Math.round(2 * parseInt(shape.getAttribute('width')) + 2 * parseInt(shape.getAttribute('height')));
        if (shape instanceof SVGEllipseElement) {
            const rx = parseInt(shape.getAttribute('rx'));
            const ry = parseInt(shape.getAttribute('ry'));
            const h = (rx - ry) ** 2 / (rx + ry) ** 2;
            return (Math.PI * (rx + ry)) * (1 + ((3 * h) / (10 + Math.sqrt(4 - (3 * h)))));
        }
        if (shape instanceof SVGLineElement) {
            const x1 = parseInt(shape.getAttribute('x1'));
            const x2 = parseInt(shape.getAttribute('x2'));
            const y1 = parseInt(shape.getAttribute('y1'));
            const y2 = parseInt(shape.getAttribute('y2'));
            return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        }
        if (shape instanceof SVGPathElement) return shape.getTotalLength();
    }

    static setInitialAttributesShapes(shapes, reverse = false) {
        shapes.forEach(shape => {
            shape.el.setAttribute('stroke-dasharray', `${shape.length} ${shape.length}`);
            shape.el.setAttribute('stroke-dashoffset', `${(reverse ? -1 : 1) * shape.length}`);
        });
        return shapes;
    }

    static drawShapes(shapes, {
        reverse = false, duration = 1, easing = easeOutQuad, onFinish = () => {}, fromFullDrawn = false,
    }) {
        tween(
            progress => {
                if (reverse) progress = map(progress, 0, 1, 1, 0);
                SVG.setStrokeDashOffsetShapes(shapes, progress, fromFullDrawn);
            },
            {
                duration,
                easing,
                onFinish,
            },
        ).start();
    }

    static setStrokeDashOffsetShapes(shapes, factor, fromFullDrawn = false) {
        let offset = 0;
        for (const shape of shapes) {
            if (fromFullDrawn) offset = shape.length;
            shape.el.setAttribute('stroke-dashoffset', `${shape.length * factor + offset}`);
        }
    }
}
