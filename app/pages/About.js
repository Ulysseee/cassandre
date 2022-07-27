import Page from '../components/containers/Page';

export default class About extends Page {
    static config = {
        ...Page.config,
        name: 'About',
        refs: [...Page.config.refs],
    }
}
