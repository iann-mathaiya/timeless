import type React from "react"

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    className?: string
    children: React.ReactNode
}

export default function Link({ href, children, className, ...props }: LinkProps) {
    return (
        <a href={href} className={className} {...props}>
            {children}
        </a>
    )
}
