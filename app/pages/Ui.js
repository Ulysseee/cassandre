import Page from '../containers/Page';
import WorkCard from '../components/WorkCard';

export default class Ui extends Page {
    static config = {
        ...Page.config,
        name: 'Ui',
        components: {
            WorkCard,
        },
        refs: [...Page.config.refs],
    };

};
