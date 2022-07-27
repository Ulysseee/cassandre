import AppEvents from './components/containers/AppEvents';
import { createApp } from '@studiometa/js-toolkit';
import Cursor from './components/Cursor';
import Ui from './pages/Ui';
import ScribbleLink from './components/ScribbleLink';

class App extends AppEvents {
    static config = {
        name: 'App',
        components: {
            Cursor,
            Ui,
            ScribbleLink,
        },
        refs: [...AppEvents.config.refs],
    };
}

export default createApp(App, document.body);
