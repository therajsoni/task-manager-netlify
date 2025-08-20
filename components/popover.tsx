import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function PopoverDemo({ setOpenActionFor, index }: { setOpenActionFor: (args:number)=>void, index: number }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" style={{
                    backgroundColor: "black",
                    color: "white",
                }}>+</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="leading-none font-medium">Actions For Task</h4>
                        <p className="text-muted-foreground text-sm">
                            Set the action For Task
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="">
                            <Button style={{
                                color: "white",
                                backgroundColor: "black"
                            }}
                                onClick={() => setOpenActionFor(index)}
                            >ADD HIS SUBTASKS</Button>
                        </div>
                        <div className="">
                            <Button style={{
                                color: "white",
                                backgroundColor: "black"
                            }}
                                onClick={() => setOpenActionFor(index)}
                            >ADD THIS TASK REPOSIBILITY</Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
