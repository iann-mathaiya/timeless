import { useCallback, useRef, useState } from 'react';
import Text from '@tiptap/extension-text';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { useDebouncedCallback } from 'use-debounce';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, EditorContent } from '@tiptap/react';
import Image from '@tiptap/extension-image';
import { cx } from 'class-variance-authority';
import { ImagePlus, ListTodo, MapPinned } from 'lucide-react';

export default function CreatePostForm() {
    const [saveStatus, setSaveStatus] = useState("Unsaved");
    const [content, setContent] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const url = 'https://d2wx6rahy8yxgr.cloudfront.net/fit-in/2560x0/filters:format(webp)/filters:quality(100)/8a946048-8015-4fc3-8173-31961d6f78b4-send-us-a-message.png';

    const debouncedUpdates = useDebouncedCallback(async (editor) => {
        const text = editor.getText();
        // setContent(editor.getText({ blockSeparator: '\n' }));
        console.log(text);
        setSaveStatus("Saved");
    }, 500);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            // StarterKit,
            Document, Text, Paragraph,
            Placeholder.configure({
                placeholder: 'Write something...'
            }),
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
            Image.configure({
                HTMLAttributes: {
                    class: cx("max-h-80 flex gap-2 rounded-lg"),
                },
            })
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

        // TODO: upload file to R2 then get the presigned url but for now
        if (!editor) {
            return null;
        }
        editor.chain().focus().setImage({ src: url }).run();

    }

    function handleAddImage(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (!inputRef || !inputRef.current) return;

        if (!editor) {
            return null;
        }

        editor.chain().focus().setParagraph().run()

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
