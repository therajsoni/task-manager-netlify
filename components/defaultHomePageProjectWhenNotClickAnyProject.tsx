import { Button } from "./ui/button";

export default function DefaultPage() {
    return (
        <>
            <section className="bg-center  bg-white bg-blend-multiply mt-12 w-[95%] h-[92%] overflow-hidden ">
                <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">

                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-black md:text-5xl lg:text-6xl">Project manager</h1>
                    <div className="text-4xl">
                        {"The list of project's for management and manage easily"}
                    </div>
                    <p className="mb-8 text-lg font-normal text-black lg:text-xl sm:px-16 lg:px-48">
                        <Button className=" bg-black rounded-2xl mt-4">
                            {"Click the sidebar project's to explore"}
                        </Button>
                    </p>
                </div>
            </section>

        </>
    )
}