import { defineComponent, inject, h } from 'vue';
import { editorKey } from './TuiEditor';

export default defineComponent({
  setup() {
    const editor = inject(editorKey);
    console.log(editor?.value);
    return () => h('div');
  },
});
