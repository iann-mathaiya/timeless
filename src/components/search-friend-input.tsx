import { Input } from './ui/input';
import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';
import { SmilePlus, X } from 'lucide-react';

export default function SearchFriendInput() {
    const [showInput, setShowInput] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    function focusInput() {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }

    function toggle() {
        setIsAnimating(true);
        setShowInput(prev => !prev);
        if (!showInput) {
            focusInput();
        }
    }

    function clearInput() {
        setSearchValue('');
        focusInput();
    }

    function handleBlur(e: React.FocusEvent) {
        if (!searchValue) {
            setIsAnimating(true);
            setShowInput(false);
        }
    }

    function onAnimationComplete() {
        setIsAnimating(false);
    }

    return (
        <div className="relative">
            <AnimatePresence initial={false} mode='wait' presenceAffectsLayout={false}>
                {showInput ?
                    <motion.div
                        key="input"
                        layoutId="search-input"
                        transition={{ duration: isAnimating ? 0.2 : 0 }}
                        onAnimationComplete={onAnimationComplete}
                    >
                        <Input
                            type="text"
                            ref={inputRef}
                            value={searchValue}
                            onBlur={handleBlur}
                            placeholder="Search friend"
                            onChange={e => setSearchValue(e.target.value)}
                            className="peer ps-9 h-7 w-fit border-none shadow-none" />

                        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                            <SmilePlus size={16} strokeWidth={2} aria-hidden="true" />
                        </div>

                        {searchValue &&
                            <button type='button' onClick={clearInput} className="ps-3 absolute inset-y-0 right-2 flex items-center justify-center text-muted-foreground/80 hover:text-gray-900 peer-disabled:opacity-50">
                                <X size={14} strokeWidth={2} aria-hidden="true" />
                            </button>
                        }
                    </motion.div>
                    :
                    <motion.button
                        key="button"
                        layoutId="search-input"
                        transition={{ duration: isAnimating ? 0.2 : 0 }}
                        onAnimationComplete={onAnimationComplete}
                        type="button"
                        onClick={toggle}
                        className='h-7 px-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md focus:outline focus:outline-1 focus:outline-offset-2 focus:outline-gray-900'>
                        <SmilePlus size={16} strokeWidth={2} aria-hidden="true" />
                        <span>Search Friend</span>
                    </motion.button>
                }
            </AnimatePresence>
        </div>
    );
}
