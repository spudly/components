import React, {
  useRef,
  ReactElement,
  useEffect,
  MutableRefObject,
  RefObject,
  forwardRef,
  useImperativeHandle,
  Ref,
} from 'react';
import {
  useAnimatedDiff,
  RenderApi,
  getPosition,
} from '@spudly/use-animated-diff';
import * as monaco from 'monaco-editor';
import {diffChars} from 'diff';

type Props = JSX.IntrinsicElements['div'] & {
  initialValue: string;
  patches: Array<string>;
  onChange?: (value: string) => void;
  render: (container: ReactElement, api: RenderApi) => ReactElement;
  options: monaco.editor.IEditorConstructionOptions;
};

const useScrollMonacoEditorToLine = (
  editorRef: RefObject<monaco.editor.IStandaloneCodeEditor>,
  line: number,
) => {
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    editor.revealLineInCenter(line);
  }, [editorRef, line]);
};

const useSetMonacoEditorValue = (
  editorRef: RefObject<monaco.editor.IStandaloneCodeEditor>,
  value: string,
) => {
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    const model = editor.getModel();
    if (!model) {
      throw new Error('No model!?');
    }
    let charIndex = 0;
    diffChars(model.getValue(), value).forEach(change => {
      const endIndex = charIndex + change.value.length;
      if (!change.added && !change.removed) {
        charIndex = endIndex;
        return;
      }
      const startValue = model.getValue();
      const [startLine, startColumn] = getPosition(startValue, charIndex);
      if (change.added) {
        editor.executeEdits('animated-monaco', [
          {
            text: change.value,
            range: new monaco.Range(
              startLine,
              startColumn,
              startLine,
              startColumn,
            ),
            forceMoveMarkers: true,
          },
        ]);
        charIndex = endIndex;
        return;
      }
      const [endLine, endColumn] = getPosition(startValue, endIndex);
      editor.executeEdits('animated-monaco', [
        {
          text: '',
          range: new monaco.Range(startLine, startColumn, endLine, endColumn),
          forceMoveMarkers: true,
        },
      ]);
    });
  }, [editorRef, value]);
};

const useSetMonacoEditorScrollPosition = (
  editorRef: RefObject<monaco.editor.IStandaloneCodeEditor>,
  value: string,
  selectionStart: number,
  selectionEnd: number,
) => {
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    const [startLine, startColumn] = getPosition(value, selectionStart);
    const [endLine, endColumn] = getPosition(value, selectionEnd);
    const selection = new monaco.Selection(
      startLine,
      startColumn,
      endLine,
      endColumn,
    );
    editor.setSelection(selection);
  }, [editorRef, value, selectionStart, selectionEnd]);
};

const useCreateMonacoEditor = (
  options: monaco.editor.IEditorConstructionOptions,
): [
  RefObject<HTMLDivElement>,
  RefObject<monaco.editor.IStandaloneCodeEditor>,
] => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef: MutableRefObject<monaco.editor.IStandaloneCodeEditor> = useRef<
    monaco.editor.IStandaloneCodeEditor
  >(null) as any;
  useEffect(() => {
    editorRef.current = monaco.editor.create(containerRef.current!, options);
    return () => {
      const editor = editorRef.current!;
      if (editor) {
        editor.dispose();
        const model = editor.getModel();
        if (model) {
          model.dispose();
        }
      }
    };
  }, [editorRef, options]);
  return [containerRef, editorRef];
};

const useFocusMonacoEditor = (
  editorRef: RefObject<monaco.editor.IStandaloneCodeEditor>,
  value: string,
  selectionStart: number,
  selectionEnd: number,
) => {
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, [editorRef, value, selectionStart, selectionEnd]);
};

const AnimatedDiffMonaco = forwardRef(
  (
    {initialValue, patches, onChange, render, options, ...props}: Props,
    ref: Ref<RenderApi>,
  ) => {
    const [containerRef, editorRef] = useCreateMonacoEditor(options);
    const api = useAnimatedDiff(initialValue, patches);
    useImperativeHandle<RenderApi, RenderApi>(ref, () => api, [api]);
    const [line] = getPosition(api.value, api.selectionEnd);
    useSetMonacoEditorValue(editorRef, api.value);
    useFocusMonacoEditor(
      editorRef,
      api.value,
      api.selectionStart,
      api.selectionEnd,
    );
    useScrollMonacoEditorToLine(editorRef, line);
    useSetMonacoEditorScrollPosition(
      editorRef,
      api.value,
      api.selectionStart,
      api.selectionEnd,
    );

    return render(<div ref={containerRef} {...props} />, api);
  },
);

export * from '@spudly/use-animated-diff';
export default AnimatedDiffMonaco;
