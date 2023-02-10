<template>
  <q-page>
    <q-card class="q-ma-sm">
      <q-card-section>
        <q-toggle
          v-model="markdown"
          label="Does the output would be a Markdown?"
        ></q-toggle>
        <q-toggle v-model="hideMode" label="Hide Mode Switch"></q-toggle>
      </q-card-section>
    </q-card>
    <q-card class="q-ma-sm">
      <q-card-section>
        <span class="text-h6 text-center">Tui Editor (Input)</span>
      </q-card-section>
      <tui-editor
        v-model="text"
        v-model:editor-type="mode"
        :markdown="markdown"
        :hide-mode-switch="hideMode"
      >
        <tui-editor-child></tui-editor-child>
      </tui-editor>
    </q-card>
    <div class="row q-ma-sm">
      <div class="col q-pr-xs">
        <q-card class="full-height">
          <q-card-section>
            <span class="text-h6 text-center"> Tui Editor Viewer </span>
          </q-card-section>
          <q-card-section v-if="text">
            <tui-viewer :content="text"></tui-viewer>
          </q-card-section>
          <template v-else>
            <q-banner class="bg-warning text-dark">nothing to show</q-banner>
          </template>
        </q-card>
      </div>
      <div class="col q-pl-xs">
        <q-card class="full-height">
          <q-card-section>
            <span class="text-h6 text-center">
              <template v-if="markdown || mode === 'markdown'">
                QMarkdown App Extension (Output)
              </template>
              <template v-else>Vue Html Directive (Output)</template>
            </span>
          </q-card-section>
          <q-card-section v-if="text">
            <template v-if="markdown || mode === 'markdown'">
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
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { EditorType } from '@toast-ui/editor';
import TuiEditor from 'src/components/TuiEditor';
import TuiViewer from 'src/components/TuiViewer';
import TuiEditorChild from 'src/components/TuiEditorChild';
import { ref } from 'vue';

const text = ref('');
const markdown = ref(false);
const hideMode = ref(false);
const mode = ref<EditorType>('markdown');
</script>
