// app/_not-found/not-found.tsx or app/not-found.tsx

import Link from "next/link";

export default function NotFoundComponet() {
    return (
        <div className="fixed bg-amber-200 hover:bg-amber-200 text-2xl h-screen w-screen flex flex-1 justify-center items-center flex-col gap-4">
            <div>
                <h1 className="ml-20">404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
            </div>
            <div>
                <Link className=" bg-gray-300 ml-[-50px] py-3 px-5 rounded-xl" href={"/"}>Go Back </Link>
            </div>
        </div>
    );
}
