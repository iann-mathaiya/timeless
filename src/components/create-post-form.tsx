import { useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { ImagePlus, ListTodo, MapPinned } from 'lucide-react';

export default function CreatePostForm() {
    const inputRef = useRef<HTMLInputElement>(null);

    const url = 'https://d2wx6rahy8yxgr.cloudfront.net/fit-in/2560x0/filters:format(webp)/filters:quality(100)/8a946048-8015-4fc3-8173-31961d6f78b4-send-us-a-message.png';


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

            <div className='mt-4 w-full flex items-center gap-2'>

                <div className='flex items-center justify-center'>
                    <input ref={inputRef} type='file' onChange={handleFileUpload} className='hidden' />
                    <button type="button" onClick={handleAddImage} className='p-1 text-gray-600 hover:text-gray-900 bg-transparent hover:bg-gray-200 rounded-md'>
                        <ImagePlus className='size-5' />
                    </button>
                </div>
            </div>
        </div>
    );
}
