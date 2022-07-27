import Page from '../components/containers/Page';

export default class Projects extends Page {
    static config = {
        ...Page.config,
        name: 'Projects',
        refs: [...Page.config.refs],
    }

}
