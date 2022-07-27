export const getInternalLinks = () => {
    const linkElements = document.querySelectorAll('a');

    return [...linkElements].filter(linkElement => {
        const isLocal = linkElement.href.indexOf(window.location.origin) > -1;
        const isNotEmail = linkElement.href.indexOf('mailto') === -1;
        const isNotPhone = linkElement.href.indexOf('tel') === -1;
        const hRef = linkElement.getAttribute('href');
        const isAnchor = hRef ? hRef.startsWith('#') : false;
        return (isLocal && isNotPhone && isNotEmail && !isAnchor);
    });
};
