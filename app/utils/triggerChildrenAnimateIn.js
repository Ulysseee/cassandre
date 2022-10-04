import { getDirectChildren } from '@studiometa/js-toolkit';

export const triggerChildrenAnimateIn = (parentInstance, parentName, childrenNames) => {
    const childrenInstances = [];
    for (const childName of childrenNames) {
        childrenInstances.push(...getDirectChildren(parentInstance, parentName, childName));
    }
    for (const childInstance of childrenInstances) {
        if (childInstance.animateIn && !childInstance.$options.auto) childInstance.animateIn();
    }
};
