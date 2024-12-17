import { ImagePlus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useRef, useState, type FormEvent } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { actions } from 'astro:actions';

export default function CreatePostForm() {
    const [images, setImages] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const url = 'https://d2wx6rahy8yxgr.cloudfront.net/fit-in/2560x0/filters:format(webp)/filters:quality(100)/8a946048-8015-4fc3-8173-31961d6f78b4-send-us-a-message.png';

    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files) return;

        const file = files[0];

        const selectedFiles = Array.from(files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

        // use the file
        // console.log(file);

        setImages(prevImages => [...prevImages, url]);

        // console.log(images);

    }

    function handleAddImage(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (!inputRef || !inputRef.current) return;

        inputRef.current.click();
    }

    async function handleSumbit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        console.log(formData);

        const images = formData.get('imageIds') as string;

        files.forEach((file, index) => {
            formData.append(`file${index + 1}`, file); // Append files to FormData
        });

        console.log('files:', files);
        console.log('images:', images);
        console.log('formData:', formData);

        // const { error } = await actions.posts.createPost(formData);

    }

    return (
        <form onSubmit={handleSumbit} encType="multipart/form-data" className='mt-4 mx-auto w-full max-w-xl'>
            <input placeholder='Add title' name='title' className='w-full text-xl font-medium bg-transparent outline-none placeholder:text-gray-400' />

            <textarea placeholder='Write something...' name='description'
                className={twMerge('mt-2 min-h-20 w-full text-sm outline-none', images.length > 0 && 'min-h-fit')} />

            {images.length > 0 &&
                <div className='flex items-center gap-2'>
                    {images.map((image, index) =>
                        <img key={`${image}-${index}`} src={image} alt='Just a placeholder' className='w-80 rounded-md' />
                    )}
                </div>
            }

            <div className='mt-4 w-full flex items-center gap-2'>
                <div className='w-full flex items-center justify-between'>
                    <div className='flex items-center justify-center'>
                        <input 
                            disabled={files.length  === 3}
                            ref={inputRef} type='file' multiple 
                            accept='image/webp, image/jpeg, image/png' 
                            onChange={handleFileUpload} className='hidden' />
                        <TooltipProvider delayDuration={400} skipDelayDuration={150}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button type="button" disabled={files.length  === 3} onClick={handleAddImage} className='p-1 text-gray-600 hover:text-gray-900 bg-transparent hover:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-100 rounded-md'>
                                        <ImagePlus className='size-5' />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{files.length  === 3 ? 'You can only add 3 images/videos' : 'Add an image'}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <button
                        type='submit'
                        className='px-3 py-1.5 text-white text-sm bg-gray-950 hover:bg-orange-600 rounded-full'
                    >
                        Save post
                    </button>
                </div>


            </div>
        </form>
    );
}
