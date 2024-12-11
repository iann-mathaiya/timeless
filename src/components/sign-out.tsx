import { signOut } from "../lib/auth-client"

export default function SignOutButton() {
    return (
        <button
            type="button"
            onClick={async () => await signOut()}
            className="mt-2 w-20 h-8 flex items-center justify-center gap-2 text-white bg-gray-950 hover:bg-orange-600 rounded-lg transition-all duration-300 ease-in-out">
            <span className="text-sm font-medium">
                Sign out
            </span>
        </button>
    )
}
