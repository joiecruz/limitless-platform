import React, { useRef, useImperativeHandle, forwardRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { toast } from "sonner";
// @ts-ignore
import mammoth from 'mammoth';

// Add a toolbar container id for Quill
const TOOLBAR_ID = "quill-toolbar-a4";

type DocumentEditorProps = {
  className?: string;
  onSave?: () => void;
};

const DocumentEditor = forwardRef<{ getContents: () => string; setContents: (value: string) => void }, DocumentEditorProps>(({ className = "", onSave }, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useImperativeHandle(ref, () => ({
    getContents: () => {
      if (quillRef.current) {
        return quillRef.current.root.innerHTML;
      }
      return '';
    },
    setContents: (value: string) => {
      if (quillRef.current) {
        quillRef.current.root.innerHTML = value || '';
      }
    }
  }));

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean']
          ],
          history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true
          }
        },
        placeholder: 'Start typing your document here...',
        formats: [
          'bold', 'italic', 'underline', 'strike',
          'list', 'bullet',
          'header',
          'color', 'background'
        ]
      });
      quillRef.current = quill;
      quill.setText('');
      const quillEditor = quill.root;
      quillEditor.style.fontFamily = 'Arial, sans-serif';
      quillEditor.style.fontSize = '12px';
      quillEditor.style.lineHeight = '1.5';
      quillEditor.style.color = '#000000';
      quillEditor.style.backgroundColor = '#ffffff';
      quillEditor.style.padding = '0';
      quillEditor.style.margin = '0';
      quillEditor.style.minHeight = '100%';
      quillEditor.style.height = '100%';
      quillEditor.style.boxSizing = 'border-box';
    }
    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  const handleRefresh = () => {
    if (quillRef.current) {
      quillRef.current.setText('');
    }
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.txt,.md,.html,.docx');
    input.click();
    input.onchange = () => {
      const file = input.files?.[0];
      if (file && quillRef.current) {
        if (file.name.endsWith('.docx')) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const result = await mammoth.convertToHtml({ arrayBuffer });
            quillRef.current?.root && (quillRef.current.root.innerHTML = result.value);
          };
          reader.readAsArrayBuffer(file);
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target?.result as string;
            quillRef.current?.setText(text);
          };
          reader.readAsText(file, 'utf-8');
        }
      }
    };
  };

  const handleSave = () => {
    if (quillRef.current) {
      const content = quillRef.current.getText();
      const htmlContent = quillRef.current.root.innerHTML;
      // console.log('DocumentEditor Save button - HTML content:', htmlContent);
      localStorage.setItem('documentContent', content);
      localStorage.setItem('documentHTML', htmlContent);
      toast('Document saved successfully!');
      if (onSave) onSave();
    }
  };

  const handleDownload = (format: 'txt' | 'html' | 'docx') => {
    if (!quillRef.current) return;
    if (format === 'docx') {
      handleDownloadDOCX();
      return;
    }
    let content = '';
    let filename = 'document';
    let mimeType = 'text/plain';
    switch (format) {
      case 'txt':
        content = quillRef.current.getText();
        filename += '.txt';
        break;
      case 'html':
        content = quillRef.current.root.innerHTML;
        filename += '.html';
        mimeType = 'text/html';
        break;
    }
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadDOCX = async () => {
    if (!quillRef.current) return;
    try {
      const htmlContent = quillRef.current.root.innerHTML;
      const paragraphs = convertHtmlToDocx(htmlContent);
      const doc = new Document({
        sections: [{
          properties: {
            page: {
              size: {
                width: 11906, height: 16838,
              },
              margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
            },
          },
          children: paragraphs,
        }],
      });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating DOCX:', error);
      alert('Error generating DOCX. Please try again.');
    }
  };

  const convertHtmlToDocx = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const paragraphs: Paragraph[] = [];
    Array.from(doc.body.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) {
          paragraphs.push(new Paragraph({ children: [new TextRun({ text, font: 'Arial' })] }));
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const classList = element.classList ? Array.from(element.classList) : [];
        // Handle Quill's header classes
        if (element.tagName.toLowerCase() === 'p') {
          if (classList.includes('ql-header-1')) {
            paragraphs.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: element.textContent || '', color: '000000', font: 'Arial' })] }));
            return;
          } else if (classList.includes('ql-header-2')) {
            paragraphs.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: element.textContent || '', color: '000000', font: 'Arial' })] }));
            return;
          } else if (classList.includes('ql-header-3')) {
            paragraphs.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: element.textContent || '', color: '000000', font: 'Arial' })] }));
            return;
          }
        }
        switch (element.tagName.toLowerCase()) {
          case 'h1':
            paragraphs.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: element.textContent || '', color: '000000', font: 'Arial' })] }));
            break;
          case 'h2':
            paragraphs.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: element.textContent || '', color: '000000', font: 'Arial' })] }));
            break;
          case 'h3':
            paragraphs.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: element.textContent || '', color: '000000', font: 'Arial' })] }));
            break;
          case 'p':
            const textRuns: TextRun[] = [];
            Array.from(element.childNodes).forEach((child) => {
              if (child.nodeType === Node.TEXT_NODE) {
                textRuns.push(new TextRun({ text: child.textContent || '', font: 'Arial' }));
              } else if (child.nodeType === Node.ELEMENT_NODE) {
                const childElement = child as HTMLElement;
                const textRun = new TextRun({
                  text: childElement.textContent || '',
                  bold: childElement.tagName === 'STRONG' || childElement.tagName === 'B',
                  italics: childElement.tagName === 'EM' || childElement.tagName === 'I',
                  underline: childElement.tagName === 'U' ? { type: 'single' } : undefined,
                  font: 'Arial',
                });
                textRuns.push(textRun);
              }
            });
            paragraphs.push(new Paragraph({ children: textRuns }));
            break;
          case 'ul':
            Array.from(element.children).forEach((li) => {
              paragraphs.push(new Paragraph({ text: li.textContent || '', bullet: { level: 0 } }));
            });
            break;
          case 'ol':
            Array.from(element.children).forEach((li) => {
              paragraphs.push(new Paragraph({ text: li.textContent || '', numbering: { reference: 'default-numbering', level: 0 } }));
            });
            break;
          case 'li':
            paragraphs.push(new Paragraph({ text: element.textContent || '', bullet: { level: 0 } }));
            break;
          default:
            const text = element.textContent?.trim();
            if (text) {
              paragraphs.push(new Paragraph({ children: [new TextRun({ text, font: 'Arial' })] }));
            }
        }
      }
    });
    return paragraphs;
  };

  const convertHtmlToMarkdown = (html: string): string => {
    let markdown = html
      .replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1\n\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/g, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/g, '*$1*')
      .replace(/<u[^>]*>(.*?)<\/u>/g, '__$1__')
      .replace(/<ul[^>]*>(.*?)<\/ul>/g, (match, content) => {
        return content.replace(/<li[^>]*>(.*?)<\/li>/g, '- $1\n') + '\n';
      })
      .replace(/<ol[^>]*>(.*?)<\/ol>/g, (match, content) => {
        let counter = 1;
        return content.replace(/<li[^>]*>(.*?)<\/li>/g, () => `${counter++}. $1\n`) + '\n';
      })
      .replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
    return markdown;
  };

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      {/* Custom toolbar */}
      <div className="flex gap-2 mb-2 items-center border-b pb-2">
        <button type="button" className="px-2 py-1 rounded border border-[#E5E7EB] bg-white hover:bg-[#F4F4F4] text-sm" title="Upload File" onClick={handleFileUpload}>
          <span role="img" aria-label="file">Upload File</span>
          </button>
        <button type="button" className="px-2 py-1 rounded border border-[#E5E7EB] bg-white hover:bg-[#F4F4F4] text-sm" title="Save Document" onClick={handleSave}>
          <span role="img" aria-label="save">💾</span>
        </button>
        <div className="relative group">
          <button type="button" className="px-2 py-1 rounded border border-[#E5E7EB] bg-white hover:bg-[#F4F4F4] text-sm" title="Download Document">
            <span role="img" aria-label="download">⬇️</span>
          </button>
          {/* Download dropdown */}
          <div className="absolute top-full left-0 mt-1 bg-white border border-[#E5E7EB] rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <button className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F4F4F4] border-b border-[#E5E7EB]" onClick={() => handleDownload('txt')}>Download as TXT</button>
            <button className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F4F4F4] border-b border-[#E5E7EB]" onClick={() => handleDownload('html')}>Download as HTML</button>
            <button className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F4F4F4]" onClick={() => handleDownload('docx')}>Download as DOCX</button>
          </div>
        </div>
        <button type="button" className="px-2 py-1 rounded bg-[#393CA0] text-white text-sm ml-2" title="Refresh" onClick={handleRefresh}>
          <span role="img" aria-label="refresh">&#x21bb;</span>
        </button>
      </div>
      {/* A4 Paper Background */}
      <div className="flex-1 flex justify-center items-start p-0 bg-gray-100" style={{ alignItems: 'flex-start' }}>
        {/* Horizontal Quill toolbar at the top of the A4 paper */}
        <div className="bg-white shadow-lg flex flex-col" style={{ width: '210mm', height: '297mm', padding: '10mm', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif', fontSize: '12px', lineHeight: '1', color: '#000000', overflow: 'auto' }}>
          {/* Quill editor as A4 paper */}
          <div ref={editorRef} style={{ flex: 1, width: '100%', height: '100%', fontFamily: 'Arial, sans-serif', fontSize: '12px', lineHeight: '1', color: '#000000', backgroundColor: '#fff', minHeight: 0, minWidth: 0, overflow: 'auto' }} />
        </div>
      </div>
    </div>
  );
});

export default DocumentEditor;
