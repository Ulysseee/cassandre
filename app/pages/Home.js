import Page from '../containers/Page';
import Work from '../components/Work';

export default class Projects extends Page {
    static config = {
        ...Page.config,
        name: 'Home',
        refs: [...Page.config.refs],
        components: {
            Work,
        },
    };
}
