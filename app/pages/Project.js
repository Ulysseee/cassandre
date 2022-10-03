import Page from '../containers/Page';
import Slider from '../components/Slider';
import NextProject from '../components/NextProject';

export default class Project extends Page {
    static config = {
        ...Page.config,
        name: 'Project',
        refs: [...Page.config.refs],
        components: {
            Slider,
            NextProject,
        },
    }
}
