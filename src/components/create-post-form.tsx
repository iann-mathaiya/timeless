import { useState } from 'react';
import Text from '@tiptap/extension-text';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import { useDebouncedCallback } from 'use-debounce';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';


export default function CreatePostForm() {
    const [saveStatus, setSaveStatus] = useState("Unsaved");
    const [content, setContent] = useState('');


    const debouncedUpdates = useDebouncedCallback(async (editor) => {
        const json = editor.getJSON();
        setContent(editor.getText({ blockSeparator: '\n' }));
        setSaveStatus("Saved");
    }, 500);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            Document, Text, Paragraph,
            Placeholder.configure({
                placeholder: 'Write something...'
            }),
        ],
        editorProps: {
            attributes: {
                class: 'mt-2 outline-none text-sm text-slate-900 font-normal',
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


    return (
        <div className='mt-4 mx-auto w-full max-w-xl'>
            <input placeholder='Add title' className='w-full text-xl font-medium bg-transparent outline-none placeholder:text-gray-400' />

            <EditorContent editor={editor} />
        </div>
    );
}
