import { actions } from 'astro:actions';
import { Input } from './ui/input';
import { useState, type FormEvent } from 'react';

export default function JoinWaitlistForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        setIsSubmitting(true);
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const email = formData.get("email") as string;

        const { data: waitlistData, error } = await actions.waitlist.joinWaitlist({ emailAddress: email });

        if (error?.code === 'FORBIDDEN') {
            setError(error.message);
        }

        if (waitlistData?.data) {
            setSubmittedEmail(waitlistData.data[0].insertedEmail);
            console.log(submittedEmail);
        }

        setIsSubmitting(false);

    }

    console.log(error);
    return (
        <>
            <form onSubmit={handleSubmit} className="mt-8 px-4 w-full sm:w-2/4 flex rounded-lg">
                <Input
                    type="email" name='email' required placeholder="Email Address"
                    className="-me-px flex-1 rounded-e-none border border-gray-600 focus-visible:z-10 bg-transparent shadow-none"
                />
                <button type='submit' className="inline-flex items-center rounded-e-lg bg-gray-900 hover:bg-orange-600 px-3 text-sm font-medium text-white outline-offset-2 transition-colors focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:cursor-not-allowed disabled:opacity-50">
                    Join Waitlist
                </button>
            </form>
            <p className='mt-1 text-sm sm:text-xs text-center'>
                {error ?
                    <span className='text-red-600'>{error}</span> :
                    <span className='text-gray-600'>Join the waitlist to get notified when we launch!</span>
                }
            </p>
        </>
    );
}