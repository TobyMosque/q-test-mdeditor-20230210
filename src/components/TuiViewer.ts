import {
  defineComponent,
  onMounted,
  provide,
  ref,
  h,
  Ref,
  InjectionKey,
  watch,
} from 'vue';
import Editor, { Viewer } from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

export const viewerKey: InjectionKey<Ref<Viewer>> = Symbol('tui-viewer-key');
export default defineComponent({
  emits: ['update:viewerType'],
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    const elem = ref<HTMLDivElement>();
    const viewer = ref<Viewer>();

    function initViewer() {
      if (!elem.value) {
        return;
      }
      if (viewer.value) {
        viewer.value.destroy();
      }
      viewer.value = Editor.factory({
        el: elem.value,
        viewer: true,
        initialValue: props.content,
      });
    }

    watch(
      () => props.content,
      () => initViewer()
    );

    provide(viewerKey, viewer);
    onMounted(() => initViewer());
    return () =>
      h(
        'div',
        { ref: elem },
        {
          default() {
            if (slots.default && viewer.value) {
              return slots.default();
            }
          },
        }
      );
  },
});
