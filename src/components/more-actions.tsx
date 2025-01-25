import { Ellipsis, Pencil, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { actions } from 'astro:actions';
import { useAtom } from 'jotai';
import { userIdAtom } from '@/lib/store';
import { toast } from 'sonner';
import { navigate } from 'astro:transitions/client';

type MoreActions = { postId: string; };

export default function MoreActions({ postId }: MoreActions) {
    const [userId] = useAtom(userIdAtom);
    
    async function handleDelete() {
        const { data, error } = await actions.posts.deletePost({userId: userId, postId: postId})

        if(data?.success){
            toast(`${data.deletedPost[0].deletedTitle} has been deleted successfully`)
            setTimeout(() => {
                navigate('/home')
            }, 200);
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 relative data-[state=open]:bg-accent overflow-visible"
                >
                    <Ellipsis />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className='w-40 p-1 flex flex-col gap-1'>
                {/* <Button variant="ghost" disabled className='px-2 h-8 w-full inline-flex justify-start font-normal text-start'>
                    <Pencil />
                    <span>Edit</span>
                </Button> */}
                <Button variant="destructive" onClick={handleDelete} className='px-2 h-8 w-full inline-flex justify-start font-normal text-gray-900 hover:text-red-600 text-start bg-transparent shadow-none hover:bg-red-100/80'>
                    <Trash2 />
                    <span>Delete</span>
                </Button>
            </PopoverContent>
        </Popover>
    );
}
