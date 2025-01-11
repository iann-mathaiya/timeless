import React from 'react';
import { Input } from './ui/input';
import { SmilePlus } from 'lucide-react';

export default function SearchFriendInput() {
    return (
        <div className="relative">
            <button type="button" className='h-7 px-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md focus:outline focus:outline-1 focus:outline-offset-2 focus:outline-gray-900'>
                <SmilePlus size={16} strokeWidth={2} aria-hidden="true" />
                <span>Search Friend</span>
            </button>

            {/* <Input type="text" placeholder="Search friend" className="peer ps-9 h-7 w-fit border-none shadow-none" />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <SmilePlus size={16} strokeWidth={2} aria-hidden="true" />
            </div> */}
        </div>
    );
}
