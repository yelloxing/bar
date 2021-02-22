import Clunch from 'clunch';
import bar from '../index';
import image from './test.clunch';

window.clunch = new (Clunch.series('ui-bar', bar))({
    el: document.getElementById('root'),
    data: function () {
        return {
            type: "normal",
            data1: [123, 98, 10, -38, 1, 2, 3, 4, 45, 33, 22, 122]
        };
    },
    render: image
});
