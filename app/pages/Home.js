import Page from '../containers/Page';

export default class Projects extends Page {
    static config = {
        ...Page.config,
        name: 'Home',
        refs: [...Page.config.refs],
    }
}