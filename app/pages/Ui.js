import Page from '../containers/Page';

export default class Ui extends Page {
    static config = {
        ...Page.config,
        name: 'Ui',
        refs: [...Page.config.refs],
    };

};
