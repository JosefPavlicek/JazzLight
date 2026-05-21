"use client";

import { useEffect, useRef, useState } from "react";

type WysiwygEditorProps = {
  initialHtml: string;
  onChange: (html: string) => void;
};

export function WysiwygEditor({ initialHtml, onChange }: WysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (editorRef.current && !ready) {
      editorRef.current.innerHTML = initialHtml || "";
      setReady(true);
    }
  }, [initialHtml, ready]);

  function exec(command: string, value?: string) {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML || "");
  }

  function handleInput() {
    onChange(editorRef.current?.innerHTML || "");
  }

  return (
    <div className="wysiwyg">
      <div className="wysiwyg-toolbar">
        <button type="button" onClick={() => exec("bold")}>B</button>
        <button type="button" onClick={() => exec("italic")}><em>I</em></button>
        <button type="button" onClick={() => exec("underline")}><u>U</u></button>
        <button type="button" onClick={() => exec("formatBlock", "h2")}>Nadpis</button>
        <button type="button" onClick={() => exec("formatBlock", "p")}>Odstavec</button>
        <button type="button" onClick={() => exec("insertUnorderedList")}>Seznam</button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("URL odkazu:");
            if (url) exec("createLink", url);
          }}
        >
          Odkaz
        </button>
        <button type="button" onClick={() => exec("removeFormat")}>Vyčistit</button>
      </div>

      <div
        ref={editorRef}
        className="wysiwyg-area"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
      />
    </div>
  );
}
