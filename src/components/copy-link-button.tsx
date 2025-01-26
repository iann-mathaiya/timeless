import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { RiLink } from '@remixicon/react';

export default function CopyLinkButton() {
    const [isCopied, setIsCopied] = useState(false)
    const LINK = 'https://www.pocket-journal.com';

    function copyLink(){
        navigator.clipboard.writeText(LINK)
        setIsCopied(true)
    }

    useEffect(() => {
        if(isCopied) {
            setTimeout(() => {
                setIsCopied(false)
            }, 1000);
        }
    }, [isCopied])

    return (
        <Button
            variant='ghost'
            size='sm'
            disabled={isCopied}
            onClick={copyLink}
            className='hover:bg-transparent text-sm text-gray-900 hover:text-orange-600 transition-all duration-300 ease-in-out'
        >
            <RiLink className="size-5" aria-hidden />
            <span>{isCopied ? 'Copied link' : 'Copy pocket link'}</span>
        </Button>
    );
}
