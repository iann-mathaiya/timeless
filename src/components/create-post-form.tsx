import { toast } from 'sonner';
import { actions } from 'astro:actions';
import { ImagePlus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { navigate } from 'astro:transitions/client';
import type { Media, UploadedFiles } from '@/lib/types';
import { useRef, useState, type FormEvent } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { RiCloseLine } from '@remixicon/react';


export default function CreatePostForm() {
    const [fetchedMedia, setFetchedMedia] = useState<Media[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    console.log(fetchedMedia)

    function handleAddFile(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (!inputRef || !inputRef.current) return;

        inputRef.current.click();
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files) return;

        const file = files[0];

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);

        // return;

        const uploadToast = toast('');
        toast(`Uploading ${file.name}`, { id: uploadToast, duration: Number.POSITIVE_INFINITY });
        const { data, error } = await actions.media.uploadFile(formData);
        toast.dismiss(uploadToast);

        error && toast.error(error.message);

        if (data?.success) {
            const justUploaded = { fileName: data.fileName, fileType: data.fileType };
            setUploadedFiles(prevFiles => [...prevFiles, justUploaded]);

            const { data: signedUrlData, error } = await actions.media.getSignedUrl({ key: data.fileName });

            if (signedUrlData?.success) {
                toast.success(`${file.name} has been uploaded successfully`);
                const media: Media = { mediaURL: signedUrlData.signedUrl, fileName: data.fileName, fileType: data.fileType };
                setFetchedMedia(prevMedia => [...prevMedia, media]);
                setUploading(false);

                console.log(fetchedMedia)
            }
        }
    }

    async function handleSumbit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;

        const { error } = await actions.posts.createPost({ title: title, description, media: [JSON.stringify(uploadedFiles)] });

        if (error?.code === 'UNAUTHORIZED') navigate('/join');

        if (!error) navigate('/home');

    }

    async function handleRemoveFile(e: React.MouseEvent<HTMLButtonElement>, fileName: string){
        e.preventDefault();

        console.log(fileName)
        const { data, error } = await actions.media.removeFile({fileName: fileName})

        if(data?.success) { 
            setFetchedMedia((prevItems) =>
                prevItems.filter((item) => item.fileName !== fileName)
              );

            toast.success(data.message)
        }
    }

    return (
        <form onSubmit={handleSumbit} encType="multipart/form-data" className='px-4 mx-auto w-full max-w-xl'>
            <input placeholder='Add title' name='title' required className='w-full text-xl font-medium bg-transparent outline-none placeholder:text-gray-400' />

            <textarea placeholder='Write something...' name='description'
                className={twMerge('mt-2 min-h-20 w-full text-sm outline-none', (uploading || fetchedMedia.length > 0) && 'min-h-fit')} />

            <div className='flex items-center gap-2'>
                {uploading &&
                    <div className='aspect-square min-w-80 flex items-center justify-center bg-gray-200 animate-plse rounded-lg lg:rounded-xl'>
                        <div className="loader" />
                    </div>
                }
                {fetchedMedia.length > 0 &&
                    <div className='flex items-center gap-2'>

                        {fetchedMedia.map(({ mediaURL, fileType, fileName }) =>
                            <div key={mediaURL} className='relative max-w-80 w-80'>
                                {fileType === 'video/mp4' ?
                                    <video className='aspect-square min-w-80 w-80 rounded-lg lg:rounded-xl' controls>
                                        <source src={mediaURL} type="video/mp4" />
                                        <track src="captions_en.vtt" kind="captions" srcLang="en" label="english_captions" />
                                    </video>
                                    :
                                    <img src={mediaURL} alt='Just a placeholder' className='aspect-square min-w-80 w-80 object-cover object-center rounded-lg lg:rounded-xl' />
                                }
                                <Button onClick={(e) => handleRemoveFile(e, fileName as string)} variant='destructive' size='icon' className='absolute h-7 w-7 top-2 right-2 bg-red-100 hover:bg-red-200/65'>
                                    <RiCloseLine className='w-6 h-6 fill-red-600' />
                                </Button>
                            </div>
                        )}
                    </div>
                }
            </div>

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
                                    <button type="button" disabled={files.length === 3} onClick={handleAddFile} className='p-1 text-gray-600 hover:text-gray-900 bg-transparent hover:bg-gray-200 disabled:text-gray-400 disabled:hover:bg-gray-100 rounded-md'>
                                        <ImagePlus className='size-5' />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side='right' align='start'>
                                    <p>{files.length === 3 ? 'You can only add 3 images/reels' : 'Upload image or reel'}</p>
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
