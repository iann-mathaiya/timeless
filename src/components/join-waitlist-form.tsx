import { Input } from './ui/input';
import type { FormEvent } from 'react';

export default function JoinWaitlistForm() {

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const email = formData.get("email") as string;
    }
    return (
        <>
            <form className="mt-8 px-4 w-full sm:w-2/5 flex rounded-lg">
                <Input
                    type="email" name='title' required placeholder="Email Address"
                    className="-me-px flex-1 rounded-e-none border border-gray-600 focus-visible:z-10 bg-transparent shadow-none"
                />
                <button type='submit' className="inline-flex items-center rounded-e-lg bg-gray-900 hover:bg-orange-600 px-3 text-sm font-medium text-white outline-offset-2 transition-colors focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:cursor-not-allowed disabled:opacity-50">
                    Join Waitlist
                </button>
            </form>
            <p className='mt-1 text-sm sm:text-xs text-gray-600 text-center'>Join the waitlist to get notified when we launch!</p>
        </>
    );
}