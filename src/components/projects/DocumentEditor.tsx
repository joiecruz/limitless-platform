import React, { useRef } from "react";
import BulletListIcon from '/projects-navbar-icons/bullet-list-svgrepo-com.svg';
import ListNumberedIcon from '/projects-navbar-icons/list-numbered-svgrepo-com.svg';

const toolbarButtons = [
  { label: 'Undo', cmd: 'undo', icon: <span>&#8630;</span> },
  { label: 'Redo', cmd: 'redo', icon: <span>&#8631;</span> },
  { label: 'Bold', cmd: 'bold', icon: <b>B</b> },
  { label: 'Italic', cmd: 'italic', icon: <i>I</i> },
  { label: 'Underline', cmd: 'underline', icon: <u>U</u> },
  { label: 'Insert Unordered List', cmd: 'insertUnorderedList', icon: <img src="/projects-navbar-icons/bullet-list-svgrepo-com.svg" width={18} height={18} alt="Bulleted List" style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, maxWidth: 18, maxHeight: 18 }} /> },
  { label: 'Insert Ordered List', cmd: 'insertOrderedList', icon: <img src="/projects-navbar-icons/list-numbered-svgrepo-com.svg" width={18} height={18} alt="Numbered List" style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, maxWidth: 18, maxHeight: 18 }} /> },
];

const headingOptions = [
  { label: 'Text', value: 'p' },
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
];

const insertHtmlAtCaret = (html: string) => {
  let sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel && sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();
      const el = document.createElement("div");
      el.innerHTML = html;
      const frag = document.createDocumentFragment();
      let node, lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }
};

type DocumentEditorProps = {
  className?: string;
};

export default function DocumentEditor({ className = "" }: DocumentEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCommand = (cmd: string, value?: string) => {
    editorRef.current?.focus();
    if (cmd === 'insertUnorderedList') {
      insertHtmlAtCaret('<ul><li>List item</li></ul>');
      return;
    }
    if (cmd === 'insertOrderedList') {
      insertHtmlAtCaret('<ol><li>List item</li></ol>');
      return;
    }
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  };

  const handleRefresh = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
      editorRef.current.focus();
    }
  };

  const handleFileButton = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editorRef.current) {
      const reader = new FileReader();
      reader.onload = (event) => {
        editorRef.current!.innerText = event.target?.result as string;
        editorRef.current!.focus();
      };
      reader.readAsText(file);
    }
    // Reset input so user can upload the same file again if needed
    e.target.value = '';
  };

  const handleHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    editorRef.current?.focus();
    if (value === 'p') {
      handleCommand('formatBlock', '<p>');
    } else {
      handleCommand('formatBlock', `<${value}>`);
    }
  };

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      <div className="flex gap-2 mb-2 items-center border-b pb-2">
        {toolbarButtons.map(btn => (
          <button
            key={btn.label}
            type="button"
            className="px-2 py-1 rounded border border-[#E5E7EB] bg-white hover:bg-[#F4F4F4] text-sm"
            title={btn.label}
            onClick={() => handleCommand(btn.cmd)}
          >
            {btn.icon}
          </button>
        ))}
        <select
          className="border border-[#E5E7EB] rounded px-2 py-1 text-sm mx-2"
          defaultValue="p"
          onChange={handleHeadingChange}
        >
          {headingOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          type="button"
          className="px-2 py-1 rounded border border-[#E5E7EB] bg-white hover:bg-[#F4F4F4] text-sm"
          title="Upload File"
          onClick={handleFileButton}
        >
          <span role="img" aria-label="file">📄</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.json,.csv,.html,.js,.ts,.tsx,.jsx,.css,.xml,.yml,.yaml,.log,.py,.java,.c,.cpp,.h,.cs,.go,.rb,.php,.sh,.bat,.ini,.conf,.rtf,.tex,.mdx,.svg,.json5,.toml,.env,.pl,.rs,.swift,.kt,.dart,.sql,.scss,.less,.sass,.vue,.jsx,.tsx,.jsx,.tsx,.jsx,.tsx"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="px-2 py-1 rounded bg-[#393CA0] text-white text-sm ml-2"
          title="Refresh"
          onClick={handleRefresh}
        >
          <span role="img" aria-label="refresh">&#x21bb;</span>
        </button>
      </div>
      <div
        ref={editorRef}
        className="flex-1 border border-[#E5E7EB] rounded bg-white p-4 outline-none min-h-[300px] max-h-[600px] overflow-auto"
        contentEditable
        suppressContentEditableWarning
        spellCheck={true}
        style={{ fontSize: 15 }}
      >
        {/* Start typing your document here... */}
      </div>
    </div>
  );
}
