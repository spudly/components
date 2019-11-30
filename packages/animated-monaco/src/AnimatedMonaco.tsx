import React, {
  useRef,
  ReactElement,
  useEffect,
  Ref,
  RefObject,
  forwardRef,
  useImperativeHandle,
  MutableRefObject,
  useState,
} from 'react';
import {
  useAnimatedDiff,
  RenderApi,
  getPosition,
  getIndex,
} from '@spudly/use-animated-diff';
import * as monaco from 'monaco-editor';
import {diffChars} from 'diff';

type Props = JSX.IntrinsicElements['div'] & {
  initialValue: string;
  patches: Array<string>;
  onChange?: (value: string) => void;
  render: (container: ReactElement, api: RenderApi) => ReactElement;
  options: monaco.editor.IEditorConstructionOptions;
  onDurationChange?: () => void;
  onEnded?: () => void;
  onPause?: () => void;
  onPlay?: () => void;
  onTimeUpdate?: () => void;
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
  ignoreChangeEventRef: MutableRefObject<boolean>,
  value: string,
) => {
  useEffect(() => {
    ignoreChangeEventRef.current = true;
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
    ignoreChangeEventRef.current = false;
  }, [editorRef, ignoreChangeEventRef, value]);
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
  unstableOptions: monaco.editor.IEditorConstructionOptions,
): [
  RefObject<HTMLDivElement>,
  RefObject<monaco.editor.IStandaloneCodeEditor>,
] => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef: MutableRefObject<monaco.editor.IStandaloneCodeEditor> = useRef<
    monaco.editor.IStandaloneCodeEditor
  >(null) as any;
  const [options] = useState(unstableOptions);

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

const useOnChange = (
  editorRef: RefObject<monaco.editor.IStandaloneCodeEditor>,
  ignoreChangeEventRef: MutableRefObject<boolean>,
  onChange: (value: string) => void,
) => {
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    const subscription = editor.onDidChangeModelContent(e => {
      if (!ignoreChangeEventRef.current) {
        onChange(editor.getValue());
      }
    });
    return () => subscription.dispose();
  });
};

const AnimatedMonaco = forwardRef(
  (
    {
      initialValue,
      patches,
      onChange,
      render,
      options,
      onDurationChange,
      onEnded,
      onPause,
      onPlay,
      onTimeUpdate,
      ...props
    }: Props,
    ref: Ref<RenderApi>,
  ) => {
    const [containerRef, editorRef] = useCreateMonacoEditor(options);
    const ignoreChangeEventRef = useRef(false);
    const api = useAnimatedDiff(initialValue, patches, {
      onDurationChange,
      onEnded,
      onPause,
      onPlay,
      onTimeUpdate,
    });
    useOnChange(editorRef, ignoreChangeEventRef, () => {
      // GOTCHA: callback gets called before selection is updated. To workaround this, we
      // defer to the next tick using setTimeout(fn, 0)
      setTimeout(() => {
        try {
          const val = editorRef.current!.getValue();
          const selection = editorRef.current!.getSelection()!;
          const selectionStart = getIndex(
            val,
            selection.startLineNumber,
            selection.startColumn,
          );
          const selectionEnd = getIndex(
            val,
            selection?.endLineNumber,
            selection.endColumn,
          );
          api.onChange(val, selectionStart, selectionEnd);
        } catch (error) {
          debugger;
        }
      }, 0);
    });
    useImperativeHandle<RenderApi, RenderApi>(ref, () => api, [api]);
    const [line] = getPosition(api.value, api.selectionEnd);
    useSetMonacoEditorValue(editorRef, ignoreChangeEventRef, api.value);
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

AnimatedMonaco.displayName = 'AnimatedMonaco';

export * from '@spudly/use-animated-diff';
export default AnimatedMonaco;
