import type { PropsWithChildren } from 'react'

function Layout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen min-w-screen flex-col items-center bg-BG">
            <div className="h-full w-full max-w-400 flex-1">
                <div className="mb-1 flex justify-center border-b-2 border-P1 p-1">
                    <p className="text-md">
                        the official demo site for electricity statistics! by{' '}
                        <span className="text-md font-bold">William Lempinen</span>
                    </p>
                </div>
                <main className="p-4">{children}</main>
            </div>
        </div>
    )
}

export default Layout
