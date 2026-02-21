import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
} from 'lucide-react';
import { useEffect } from 'react';

// ToolBar component for TipTap
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30 rounded-t-xl">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded-lg hover:bg-muted transition-colors ${
          editor.isActive('bold') ? 'bg-muted text-foreground' : 'text-muted-foreground'
        }`}
        title="Bold"
        type="button"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded-lg hover:bg-muted transition-colors ${
          editor.isActive('italic') ? 'bg-muted text-foreground' : 'text-muted-foreground'
        }`}
        title="Italic"
        type="button"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-2 rounded-lg hover:bg-muted transition-colors ${
          editor.isActive('strike') ? 'bg-muted text-foreground' : 'text-muted-foreground'
        }`}
        title="Strikethrough"
        type="button"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded-lg hover:bg-muted transition-colors ${
          editor.isActive('heading', { level: 1 }) ? 'bg-muted text-foreground' : 'text-muted-foreground'
        }`}
        title="Heading 1"
        type="button"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded-lg hover:bg-muted transition-colors ${
          editor.isActive('heading', { level: 2 }) ? 'bg-muted text-foreground' : 'text-muted-foreground'
        }`}
        title="Heading 2"
        type="button"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded-lg hover:bg-muted transition-colors ${
          editor.isActive('heading', { level: 3 }) ? 'bg-muted text-foreground' : 'text-muted-foreground'
        }`}
        title="Heading 3"
        type="button"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-lg hover:bg-muted transition-colors ${
          editor.isActive('bulletList') ? 'bg-muted text-foreground' : 'text-muted-foreground'
        }`}
        title="Bullet List"
        type="button"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-lg hover:bg-muted transition-colors ${
          editor.isActive('orderedList') ? 'bg-muted text-foreground' : 'text-muted-foreground'
        }`}
        title="Numbered List"
        type="button"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-lg hover:bg-muted transition-colors ${
          editor.isActive('blockquote') ? 'bg-muted text-foreground' : 'text-muted-foreground'
        }`}
        title="Quote"
        type="button"
      >
        <Quote className="w-4 h-4" />
      </button>

      <div className="flex-1" />

      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground disabled:opacity-50"
        title="Undo"
        type="button"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground disabled:opacity-50"
        title="Redo"
        type="button"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

export function TipTapEditor({
  content,
  onChange,
  editable = true,
}: {
  content: string;
  onChange?: (html: string) => void;
  editable?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing your document here...',
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    // Prose styling will be applied by Tailwind parent container
    editorProps: {
      attributes: {
        class: 'prose prose-sm md:prose-base max-w-none focus:outline-none min-h-[500px]',
      },
    },
  });

  // Sync external content changes into editor if needed
  useEffect(() => {
    if (editor && content !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className={`relative flex flex-col bg-white text-slate-900 border ${editable ? 'border-border' : 'border-transparent'} rounded-xl shadow-sm overflow-hidden min-h-[500px]`}>
      {editable && <MenuBar editor={editor} />}
      <div className={`flex-1 p-8 ${editable ? 'overflow-auto max-h-[70vh]' : ''}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
