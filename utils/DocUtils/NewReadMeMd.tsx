import React, { useState, useEffect, useRef } from "react";
import {
  Download,
  Copy,
  FileText,
  GitBranch,
  Users,
  Database,
  PieChart,
  RefreshCw,
  Code2,
  Type,
  Instagram as Diagram,
  X,
  Save,
  Eye,
  ScreenShare,
  Inbox,
  LucideListCollapse,
} from "lucide-react";
import mermaid from "mermaid";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const defaultContent = `<h1>Welcome to the Unified Editor</h1>
<p>This editor supports both <strong>HTML text</strong> and <strong>mermaid diagrams</strong> in the same document.</p>

\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
\`\`\`

<p>You can write regular HTML content and embed mermaid diagrams using code blocks with the <code>mermaid</code> language identifier.</p>

<ul>
  <li>Switch to <strong>Text mode</strong> to add HTML content</li>
  <li>Switch to <strong>Diagram mode</strong> to add mermaid diagrams</li>
  <li>Everything appears in one unified document</li>
</ul>`;

const templates = [
  {
    name: "Flowchart",
    icon: GitBranch,
    code: `\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
\`\`\``,
  },
  {
    name: "Sequence",
    icon: Users,
    code: `\`\`\`mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
\`\`\``,
  },
  {
    name: "Class Diagram",
    icon: Database,
    code: `\`\`\`mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
\`\`\``,
  },
  {
    name: "Pie Chart",
    icon: PieChart,
    code: `\`\`\`mermaid
pie title Pet Distribution
    "Dogs" : 386
    "Cats" : 85
    "Birds" : 15
    "Fish" : 14
\`\`\``,
  },
];

const textTemplates = [
  {
    name: "Heading",
    code: "\n<h2>New Section</h2>\n<p>Add your content here...</p>\n",
  },
  {
    name: "List",
    code: "\n<ul>\n  <li>First item</li>\n  <li>Second item</li>\n  <li>Third item</li>\n</ul>\n",
  },
  {
    name: "Quote",
    code: "\n<blockquote>\n  <p>This is an important quote or note.</p>\n</blockquote>\n",
  },
  {
    name: "Code Block",
    code: '\n<pre><code>// Your code here\nfunction example() {\n  return "Hello World";\n}</code></pre>\n',
  },
];

function MarMaidEditor({ open, setOpen }: any) {
  // action btns
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [mode, setMode] = useState<"diagram" | "text">("text");
  const [content, setContent] = useState(defaultContent);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      themeVariables: {
        primaryColor: "#3B82F6",
        primaryTextColor: "#1F2937",
        primaryBorderColor: "#E5E7EB",
        lineColor: "#6B7280",
        secondaryColor: "#F3F4F6",
        tertiaryColor: "#FBBF24",
      },
    });
  }, []);

  useEffect(() => {
    const renderContent = async () => {
      if (!previewRef.current || !content.trim()) return;

      setIsLoading(true);
      setError(null);

      try {
        // Parse content to find mermaid blocks
        const mermaidRegex = /```mermaid\n([\s\S]*?)\n```/g;
        let processedContent = content;
        const mermaidBlocks: { id: string; code: string }[] = [];
        let match;
        let blockIndex = 0;

        // Extract mermaid blocks and replace with placeholders
        while ((match = mermaidRegex.exec(content)) !== null) {
          const blockId = `mermaid-block-${blockIndex}`;
          mermaidBlocks.push({ id: blockId, code: match[1] });
          processedContent = processedContent.replace(
            match[0],
            `<div id="${blockId}" class="mermaid-placeholder"></div>`
          );
          blockIndex++;
        }

        // Set the HTML content
        previewRef.current.innerHTML = processedContent;

        // Render each mermaid diagram
        for (const block of mermaidBlocks) {
          const element = previewRef.current.querySelector(`#${block.id}`);
          if (element) {
            try {
              const { svg } = await mermaid.render(
                `${block.id}-svg`,
                block.code
              );
              element.innerHTML = svg;
              element.className = "mermaid-diagram my-6 flex justify-center";
            } catch (err) {
              element.innerHTML = `<div class="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
                <p class="text-red-700 text-sm">Error rendering diagram: ${
                  err instanceof Error ? err.message : "Invalid syntax"
                }</p>
              </div>`;
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Rendering error");
        previewRef.current.innerHTML = "";
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(renderContent, 300);
    return () => clearTimeout(timeoutId);
  }, [content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleExport = () => {
    const htmlBlob = new Blob([content], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(htmlBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "document.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const insertTemplate = (templateCode: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent =
      content.substring(0, start) + templateCode + content.substring(end);

    setContent(newContent);

    // Set cursor position after inserted content
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + templateCode.length,
        start + templateCode.length
      );
    }, 0);
  };

  const insertTextTemplate = (templateCode: string) => {
    insertTemplate(templateCode);
  };
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = () => {
    if (!dialogRef.current) return;

    if (!document.fullscreenElement) {
      dialogRef.current?.requestFullscreen();
      // document.fullscreenElement();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <>
      {open && <div className="fixed inset-0  z-50 bg-black/50"></div>}

      <dialog
        open={open}
        className={`z-100  flex-col absolute ${
          open === true
            ? "animate-in fade-in-0 zoom-out-95"
            : "animate-out fade-out-0 zoom-in-95"
        } flex items-center justify-center m-auto   w-[60vw] rounded-xl  px-6  shadow-lg duration-200 top-5 bottom-5 max-h-[80vh] overflow-y-scroll hide-scrollbar py-4`}
      >
        <div
          ref={dialogRef}
          id="x-dialog-box"
          className="w-full flex justify-end mb-4"
        >
          <X onClick={() => setOpen(false)} />
        </div>
        <div className="max-w-[95vw] w-full h-[85vh] p-0">
          <div className="h-full flex flex-col">
            {" "}
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Pro Editor
                  </h1>
                </div>

                {/* Mode Switcher */}
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setMode("text")}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                      mode === "text"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <Type className="w-4 h-4" />
                    <span className="text-sm font-medium">Text</span>
                  </button>
                  <button
                    onClick={() => setMode("diagram")}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                      mode === "diagram"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <Diagram className="w-4 h-4" />
                    <span className="text-sm font-medium">Diagram</span>
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Save className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {isCopied ? "Saved!" : "Save"}
                    </span>
                  </button>
                  {/* <button
                    // onClick={handleCopy}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">{"Preview"}</span>
                  </button> */}
                  {/* <button
                    onClick={() => handleFullscreen()}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <ScreenShare className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {isFullScreen ? "Exit Screen" : "Full Screnn"}
                    </span>
                  </button> */}

                  {/* <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Export HTML</span>
                </button> */}
                </div>
              </div>
            </header>
            {/* Templates Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
              <div className="flex items-center space-x-2 overflow-x-auto">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap mr-4">
                  {mode === "diagram"
                    ? "Diagram Templates:"
                    : "Text Templates:"}
                </span>
                {mode === "diagram"
                  ? templates.map((template) => {
                      const IconComponent = template.icon;
                      return (
                        <button
                          key={template.name}
                          onClick={() => insertTemplate(template.code)}
                          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 whitespace-nowrap"
                        >
                          <IconComponent className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {template.name}
                          </span>
                        </button>
                      );
                    })
                  : textTemplates.map((template) => (
                      <button
                        key={template.name}
                        onClick={() => insertTextTemplate(template.code)}
                        className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 whitespace-nowrap"
                      >
                        <span className="text-sm font-medium">
                          {template.name}
                        </span>
                      </button>
                    ))}
              </div>
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row">
              {/* Editor Panel */}
              <div className="flex-1 flex flex-col border-r border-gray-200 ">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      <LucideListCollapse /> Pro Editor
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {mode === "diagram" ? "Adding Diagrams" : "Adding Text"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {content.split("\n").length} lines • {content.length}{" "}
                    characters
                  </div>
                </div>

                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-full p-4 font-mono text-sm text-gray-800 bg-white border-0 resize-none focus:outline-none focus:ring-0"
                    placeholder={
                      mode === "diagram"
                        ? "Write HTML text and add mermaid diagrams using ```mermaid code blocks..."
                        : "Write HTML text and add mermaid diagrams using ```mermaid code blocks..."
                    }
                    style={{ minHeight: "400px" }}
                  />
                </div>
              </div>

              {/* Preview Panel */}
              <div className="flex-1 flex flex-col bg-gray-50 ">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-100 ">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Live Preview
                    </span>
                  </div>
                  {isLoading && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="text-xs">Rendering...</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-auto">
                  {error ? (
                    <div className="p-6">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">
                              !
                            </span>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-red-800 mb-1">
                              Rendering Error
                            </h3>
                            <p className="text-sm text-red-700">{error}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-lg">
                      <div
                        ref={previewRef}
                        className="prose prose-sm max-w-none  p-6 "
                        // style={{ minHeight: "400px" }}
                        style={{
                          maxHeight: "500px",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 px-6 py-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <span>Unified HTML + Mermaid Editor</span>
                  <span>•</span>
                  <span>Real-time rendering</span>
                  <span>•</span>
                  <span
                    className={`font-medium ${
                      mode === "diagram" ? "text-blue-600" : "text-green-600"
                    }`}
                  >
                    {mode === "diagram" ? "Diagram Mode" : "Text Mode"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>Use</span>
                  <code className="px-2 py-1 bg-gray-100 rounded text-xs">
                    ```mermaid
                  </code>
                  <span>for diagrams</span>
                </div>
              </div>
            </footer>
          </div>
          {/* </DialogContent>
    </Dialog> */}
        </div>
      </dialog>
    </>
  );
}

export default MarMaidEditor;
