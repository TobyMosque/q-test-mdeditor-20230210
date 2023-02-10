import {
  defineComponent,
  onMounted,
  provide,
  ref,
  h,
  Ref,
  InjectionKey,
  computed,
  watch,
  PropType,
} from 'vue';
import Editor, {
  EditorOptions,
  PreviewStyle,
  EditorType,
} from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

export const editorKey: InjectionKey<Ref<Editor>> = Symbol('tui-editor-key');
export default defineComponent({
  emits: [
    'update:modelValue',
    'update:height',
    'update:editorType',
    'update:previewStyle',
  ],
  props: {
    modelValue: String,
    height: {
      type: Number,
      default: 500,
    },
    editorType: {
      type: String as PropType<EditorType>,
      default: 'markdownx',
    },
    previewStyle: {
      type: String as PropType<PreviewStyle>,
      default: 'vertical',
    },
  },
  setup(props, { emit, slots }) {
    const elem = ref<HTMLDivElement>();
    const editor = ref<Editor>();

    const options = computed(
      () =>
        ({
          height: `${props.height}px`,
          initialEditType: props.editorType,
          previewStyle: props.previewStyle,
        } as EditorOptions)
    );

    watch(
      () => options.value,
      () => {
        if (editor.value) {
          if (options.value.height) {
            editor.value.setHeight(options.value.height);
          }
          if (options.value.previewStyle) {
            editor.value.changePreviewStyle(options.value.previewStyle);
          }
          if (options.value.initialEditType) {
            editor.value.changeMode(options.value.initialEditType);
          }
        }
      }
    );

    provide(editorKey, editor);
    onMounted(() => {
      if (!elem.value) {
        return;
      }
      editor.value = new Editor({
        ...options.value,
        el: elem.value,
        events: {
          change() {
            let height = 500;
            let previewStyle: PreviewStyle = 'vertical';
            let editorType: EditorType = 'markdown';
            let modelValue = '';
            if (editor.value) {
              const txtHeight = editor.value.getHeight().replace(/[^0-9]/g, '');
              if (txtHeight) height = parseInt(txtHeight);
              previewStyle = editor.value.getCurrentPreviewStyle();
              if (editor.value.isMarkdownMode()) editorType = 'markdown';
              else if (editor.value.isWysiwygMode()) editorType = 'wysiwyg';
              switch (editorType) {
                case 'markdown':
                  modelValue = editor.value.getMarkdown();
                  break;
                case 'wysiwyg':
                  modelValue = editor.value.getHTML();
                  break;
              }
            }

            if (height != props.height) emit('update:height', height);
            if (editorType != props.editorType)
              emit('update:editorType', editorType);
            if (previewStyle != props.previewStyle)
              emit('update:previewStyle', previewStyle);
            if (modelValue != props.modelValue)
              emit('update:modelValue', modelValue);
          },
        },
      });
    });
    return () =>
      h(
        'div',
        { ref: elem },
        {
          default() {
            if (slots.default && editor.value) {
              return slots.default();
            }
          },
        }
      );
  },
});
