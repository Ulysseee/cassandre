import Page from '../containers/Page';
import HorizontalTextImage from '../components/HorizontalTextImage';
import Slider from '../components/Slider';
import NextProject from '../components/NextProject';
import Divider from '../components/Divider';

export default class Project extends Page {
    static config = {
        ...Page.config,
        name: 'Project',
        refs: [...Page.config.refs, 'divider'],
        components: {
            Divider,
            Slider,
            HorizontalTextImage,
            NextProject,
        },
    }
}
