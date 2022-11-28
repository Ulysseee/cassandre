import Page from '../containers/Page';
import Footer from '../components/Footer';
import Paragraph from '../components/Paragraph';
import Title from '../components/Title';

export default class Projects extends Page {
    static config = {
        ...Page.config,
        name: 'Projects',
        refs: [...Page.config.refs],
        components: {
            Footer,
        },
    };

}
