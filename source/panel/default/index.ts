
import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { createApp, App, defineComponent, ref } from 'vue';
const panelDataMap = new WeakMap<any, App>();

module.exports = Editor.Panel.define({
    listeners: {
        show() {
            console.log('show');
        },
        hide() {
            console.log('hide');
        },
    },
    template: readFileSync(join(__dirname, '../../../static/panel.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../static/panel.css'), 'utf-8'),
    $: {
        app: '#app',
        text: '#text',
    },
    methods: {
        hello() {
            if (this.$.text) {
                this.$.text.innerHTML = 'hello';
                console.log('[cocos-panel-html.default]: hello');
            }
        },
    },
    ready() {
        if (this.$.text) {
            this.$.text.innerHTML = 'Hello Cocos.';
        }
        if (this.$.app) {
            const app = createApp({});
            app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('ui-');

            app.component(
                'MyCounter',
                defineComponent({
                    data() {
                        return {
                            counter: 0,
                        };
                    },
                    methods: {
                        addition() {
                            this.counter += 1;
                        },
                        subtraction() {
                            this.counter -= 1;
                        },
                        onConfirm(...args: any[]) {
                            console.log('onConfirm', ...args);
                        },
                        onCancel(...args: any[]) {
                            console.log('onCancel', ...args);
                        },
                        onChange(...args: any[]) {
                            console.log('onChange', ...args);
                        },
                    },
                    template: readFileSync(join(__dirname, '../../../static/vue.html'), 'utf-8'),
                }),
            );
            app.mount(this.$.app);
            panelDataMap.set(this, app);
        }
    },
    beforeClose() {},
    close() {
        const app = panelDataMap.get(this);
        if (app) {
            app.unmount();
        }
    },
});
