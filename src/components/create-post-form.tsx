import { useCallback, useRef, useState } from 'react';
import Text from '@tiptap/extension-text';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { useDebouncedCallback } from 'use-debounce';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import Image from '@tiptap/extension-image';
import { cx } from 'class-variance-authority';
import { ImagePlus, ListTodo, MapPinned } from 'lucide-react';

export default function CreatePostForm() {
    const [saveStatus, setSaveStatus] = useState("Unsaved");
    const [content, setContent] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedUpdates = useDebouncedCallback(async (editor) => {
        const json = editor.getJSON();
        // setContent(editor.getText({ blockSeparator: '\n' }));
        setSaveStatus("Saved");
    }, 500);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            // StarterKit,
            Document, Text, Paragraph, Image,
            TaskItem.configure({
                HTMLAttributes: {
                    class: cx("flex items-start mt-1 last:mb-1"),
                },
                nested: true,
            }),
            TaskList.configure({
                HTMLAttributes: {
                    class: cx("not-prose pl-2"),
                },
            }),
            Placeholder.configure({
                placeholder: 'Write something...'
            }),
        ],
        editorProps: {
            attributes: {
                class: 'mt-2 min-h-16 outline-none text-sm text-slate-900 font-normal',
            },
        },
        onUpdate: ({ editor }) => {
            debouncedUpdates(editor);
            setSaveStatus("Unsaved");
        }
        // initialContent,
    });

    if (!editor) {
        return null;
    }

    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files) return;

        const file = files[0];

        // use the file
        console.log(file);
    }

    function handleAddImage(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (!inputRef || !inputRef.current) return;

        inputRef.current.click();
    }


    return (
        <div className='mt-4 mx-auto w-full max-w-xl'>
            <input placeholder='Add title' className='w-full text-xl font-medium bg-transparent outline-none placeholder:text-gray-400' />
            <EditorContent editor={editor} />

            <div className='mt-4 w-full flex items-center gap-2'>
                <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    className='p-1 text-gray-600 hover:text-gray-900 bg-transparent hover:bg-gray-200 rounded-md'
                >
                    <ListTodo className='size-5' />
                </button>

                <div className='flex items-center justify-center'>
                    <input ref={inputRef} type='file' onChange={handleFileUpload} className='hidden' />
                    <button type="button" onClick={handleAddImage} className='p-1 text-gray-600 hover:text-gray-900 bg-transparent hover:bg-gray-200 rounded-md'>
                        <ImagePlus className='size-5' />
                    </button>
                </div>

                <button
                    type='button'
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                    className='p-1 text-gray-600 hover:text-gray-900 bg-transparent hover:bg-gray-200 rounded-md'
                >
                    <MapPinned className='size-5' />
                </button>
            </div>


        </div>
    );
}
