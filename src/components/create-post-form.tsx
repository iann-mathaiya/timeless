import { actions } from 'astro:actions';
import { ImagePlus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { navigate } from 'astro:transitions/client';
import { useRef, useState, type FormEvent } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export default function CreatePostForm() {
    const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [fileNames, setFileNames] = useState<string[]>([])
    const inputRef = useRef<HTMLInputElement>(null);

    function handleAddImage(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (!inputRef || !inputRef.current) return;

        inputRef.current.click();
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files) return;

        const file = files[0];

        console.log(file)

        const formData = new FormData();
        formData.append("file", file);

        const { data, error } = await actions.media.uploadFile(formData);
        
        if (data?.success) {
            const { data: signedUrlData, error } = await actions.media.getSignedUrl({ key: data.fileName });
            console.log(signedUrlData);
            setFileNames(prevFiles => [...prevFiles, data.fileName])

            if(signedUrlData?.success) {
                setUploadedMedia(prevMedia => [...prevMedia, signedUrlData.signedUrl])
            }

            console.log(uploadedMedia)
        }
    }


    async function handleSumbit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const title = formData.get('title') as string
        const description = formData.get('description') as string

        const { error } = await actions.posts.createPost({title: title, description, media: fileNames});

        if (error?.code === 'UNAUTHORIZED') navigate('/join')

        if (!error) navigate('/home')

    }

    return (
        <form onSubmit={handleSumbit} encType="multipart/form-data" className='mt-4 mx-auto w-full max-w-xl'>
            <input placeholder='Add title' name='title' className='w-full text-xl font-medium bg-transparent outline-none placeholder:text-gray-400' />

            <textarea placeholder='Write something...' name='description'
                className={twMerge('mt-2 min-h-20 w-full text-sm outline-none', uploadedMedia.length > 0 && 'min-h-fit')} />

            {uploadedMedia.length > 0 &&
                <div className='flex items-center gap-2'>
                    {uploadedMedia.map((media) =>
                        <img key={`${media}`} src={media} alt='Just a placeholder' className='w-80 rounded-md' />
                    )}
                </div>
            }

            <div className='mt-4 w-full flex items-center gap-2'>
                <div className='w-full flex items-center justify-between'>
                    <div className='flex items-center justify-center'>
                        <input
                            disabled={files.length === 3}
                            ref={inputRef} type='file' multiple
                            accept='image/webp, image/jpeg, image/png, video/mp4'
                            onChange={handleFileUpload} className='hidden' />
                        <TooltipProvider delayDuration={400} skipDelayDuration={150}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button type="button" disabled={files.length === 3} onClick={handleAddImage} className='p-1 text-gray-600 hover:text-gray-900 bg-transparent hover:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-100 rounded-md'>
                                        <ImagePlus className='size-5' />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{files.length === 3 ? 'You can only add 3 images/videos' : 'Add an image'}</p>
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
