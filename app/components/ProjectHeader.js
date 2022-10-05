import { withScrolledInView } from '@studiometa/js-toolkit';
import AppEvents from '../containers/AppEvents';

export default class ProjectHeader extends AppEvents {
    static config = {
        ...AppEvents.config,
        name: 'ProjectHeader',
        refs: [...AppEvents.config.refs, 'year', 'title'],
        options: {
            parallaxAmount: {
                type: Number,
                default: 100,
            },
        }
    }

}
