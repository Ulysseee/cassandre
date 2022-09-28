import Page from '../containers/Page';
import WorkCard from '../components/WorkCard';
import Footer from '../components/Footer';
import Paragraph from '../components/Paragraph';
import Title from '../components/Title';

export default class Projects extends Page {
    static config = {
        ...Page.config,
        name: 'Projects',
        refs: [...Page.config.refs],
        components: {
            Title,
            Paragraph,
            WorkCard,
            Footer,
        },
    }

    mounted () {
        super.mounted();
        for (const Title of this.$children.Title) {
            Title.animateIn();
        }
        for (const Paragraph of this.$children.Paragraph) {
            Paragraph.animateIn();
        }
    }

}
