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

    return (
        <>
            {submittedEmail ?
                <div className="my-16 mx-auto w-full max-w-md transition-all duration-300 ease-in-out">
                    <h1 className="text-2xl text-center font-serif text-stone-900">Subscribed!</h1>
                    <p className="mt-1 text-sm text-center text-stone-600 text-balance">
                        <span className='text-orange-700 font-medium underline underline-offset-2 decoration-1 decoration-dotted'>
                            {submittedEmail}
                        </span> {' '}
                        has been added to our waitlist.
                        We&#39;ll reach out when we release the closed beta.
                    </p>
                </div>
                :

                <div className='my-16 w-full flex flex-col items-center justify-center'>

                    <div className="mx-auto w-full max-w-md">
                        <h1 className="text-2xl text-center font-serif text-stone-900">Join the waitlist!</h1>
                        <p className="mt-0.5 text-sm text-center text-stone-600 text-balance">
                            Get notified when we launch!
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-2 px-8 sm:px-4 w-full sm:w-2/4 flex rounded-lg">
                        <Input
                            type="email" name='email' required placeholder="Email Address"
                            className="-me-px flex-1 rounded-e-none border border-gray-600 focus-visible:z-10 bg-transparent shadow-none"
                        />
                        <button type='submit' className="inline-flex items-center rounded-e-lg bg-gray-900 hover:bg-orange-600 px-3 text-sm font-medium text-white outline-offset-2 transition-colors focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:cursor-not-allowed disabled:opacity-50">
                            Join Waitlist
                        </button>
                    </form>
                    {error && <p className='mt-1 text-sm sm:text-xs text-red-600 text-center'>{error}</p>}

                </div>
            }
        </>
    );
}