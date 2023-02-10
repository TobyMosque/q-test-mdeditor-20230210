<template>
  <q-page>
    <q-card class="q-ma-sm">
      <q-card-section>
        <span class="text-h6 text-center">Tui Editor (Input)</span>
      </q-card-section>
      <tui-editor v-model="text" v-model:editor-type="mode">
        <tui-editor-child></tui-editor-child>
      </tui-editor>
    </q-card>
    <q-card class="q-ma-sm">
      <q-card-section>
        <span class="text-h6 text-center">
          <template v-if="mode === 'markdown'">
            QMarkdown App Extension (Output)
          </template>
          <template v-else>Vue Html Directive (Output)</template>
        </span>
      </q-card-section>
      <q-card-section v-if="text">
        <template v-if="mode === 'markdown'">
          <q-markdown :src="text"></q-markdown>
        </template>
        <template v-else>
          <div class="toastui-editor-contents" v-html="text"></div>
        </template>
      </q-card-section>
      <template v-else>
        <q-banner class="bg-warning text-dark">nothing to show</q-banner>
      </template>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { EditorType } from '@toast-ui/editor';
import TuiEditor from 'src/components/TuiEditor';
import TuiEditorChild from 'src/components/TuiEditorChild';
import { ref } from 'vue';

const text = ref('');
const mode = ref<EditorType>('markdown');
</script>
