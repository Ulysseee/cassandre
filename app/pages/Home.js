import Page from '../containers/Page';
import Work from '../components/Work';
import Footer from '../components/Footer';

export default class Home extends Page {
    static config = {
        ...Page.config,
        name: 'Home',
        refs: [...Page.config.refs],
        components: {
            Work,
            Footer,
        },
    };

    mounted () {
        super.mounted();
    }
}
