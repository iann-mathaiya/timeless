import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';

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
            className='hover:bg-orange-100/60 text-sm text-orange-600 hover:text-orange-600 transition-all duration-300 ease-in-out'
        >
            {isCopied ? 'Copied link' : 'Copy pocket link'}
        </Button>
    );
}
