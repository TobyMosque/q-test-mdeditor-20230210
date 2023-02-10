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
      default: 350,
    },
    editorType: {
      type: String as PropType<EditorType>,
      default: 'markdownx',
    },
    markdown: {
      type: Boolean,
      default: false,
    },
    previewStyle: {
      type: String as PropType<PreviewStyle>,
      default: 'vertical',
    },
    hideModeSwitch: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit, slots }) {
    const elem = ref<HTMLDivElement>();
    const editor = ref<Editor>();

    let _editorType = props.editorType || 'markdown';
    const options = computed(
      () =>
        ({
          height: `${props.height}px`,
          initialEditType: props.editorType,
          previewStyle: props.previewStyle,
          hideModeSwitch: props.hideModeSwitch,
        } as EditorOptions)
    );

    watch(
      () => options.value,
      (newValue, oldValue) => {
        const {
          height,
          previewStyle,
          initialEditType: editorMode,
          hideModeSwitch: hideMode,
        } = newValue;
        if (hideMode !== undefined && hideMode !== oldValue.hideModeSwitch) {
          initEditor();
          return;
        }
        if (!editor.value) {
          return;
        }

        if (height && height !== oldValue.height) {
          editor.value.setHeight(height);
        }
        if (previewStyle && previewStyle !== oldValue.previewStyle) {
          editor.value.changePreviewStyle(previewStyle);
        }
        if (editorMode && editorMode !== oldValue.initialEditType) {
          editor.value.changeMode(editorMode);
          _editorType = editorMode;
        }
      }
    );

    provide(editorKey, editor);

    function updateValue() {
      let modelValue = '';
      if (editor.value) {
        if (props.markdown) {
          modelValue = editor.value.getMarkdown();
        } else {
          switch (_editorType) {
            case 'markdown':
              modelValue = editor.value.getMarkdown();
              break;
            case 'wysiwyg':
              modelValue = editor.value.getHTML();
              break;
          }
        }
      }
      if (modelValue != props.modelValue) emit('update:modelValue', modelValue);
    }

    function initEditor() {
      if (!elem.value) {
        return;
      }
      if (editor.value) {
        editor.value.destroy();
      }
      editor.value = new Editor({
        ...options.value,
        el: elem.value,
        initialValue: props.modelValue,
        events: {
          change() {
            let height = 500;
            let previewStyle: PreviewStyle = 'vertical';
            let editorType: EditorType = 'markdown';
            if (editor.value) {
              const txtHeight = editor.value.getHeight().replace(/[^0-9]/g, '');
              if (txtHeight) height = parseInt(txtHeight);
              previewStyle = editor.value.getCurrentPreviewStyle();
              if (editor.value.isMarkdownMode()) editorType = 'markdown';
              else if (editor.value.isWysiwygMode()) editorType = 'wysiwyg';
            }

            if (height != props.height) emit('update:height', height);
            if (editorType != props.editorType) {
              emit('update:editorType', editorType);
              _editorType = editorType;
            }
            if (previewStyle != props.previewStyle) {
              emit('update:previewStyle', previewStyle);
            }
            updateValue();
          },
        },
      });
    }
    onMounted(() => initEditor());
    watch(
      () => props.markdown,
      () => updateValue()
    );
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
