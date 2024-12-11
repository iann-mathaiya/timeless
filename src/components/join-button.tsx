import { GoogleLogo } from "./icons"
import { signIn } from "../lib/auth-client"

export default function JoinButton() {
    return (
        <button
            type="button"
            onClick={async () => {
                await signIn.social({
                    provider: "google",
                    callbackURL: "/home",
                })
            }}
            className="mt-4 w-full h-8 flex items-center justify-center gap-2 text-white bg-gray-950 hover:bg-orange-600 rounded-lg transition-all duration-300 ease-in-out">
            <GoogleLogo className="size-4" />
            <span className="text-sm font-medium">
                Sign up with Google
            </span>
        </button>
    )
}
