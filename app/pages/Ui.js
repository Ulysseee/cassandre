import AppEvents from '../components/containers/AppEvents';

export default class Ui extends AppEvents {
    static config = {
        name: 'Ui',
        refs: [...AppEvents.config.refs],
    };

    mounted() {
        super.mounted();
    }
}
