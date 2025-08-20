import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
export function AlertLogges({
    open, onClose
}: {
    open: boolean,
    onClose: Dispatch<SetStateAction<boolean>>
}) {
    const [openRead, setOpenRead] = useState(false);
    const [logMsgs, setLogMsgs] = useState("");
    const [logges, setLogges] = useState<undefined | {
        by: string,
        msg: string,
        time: Date
    }[]>();
    const fetchAlertLogges = async () => {
        const requests = await fetch("http://localhost:3001/getalllogs", {
            method: "GET",
        });
        const response = await requests.json();
        setLogges(response?.data);
    }
    useEffect(() => {
        fetchAlertLogges();
    })
    return (<>
        <Dialog open={open} onOpenChange={onClose} >
            <DialogContent>
                <DialogTitle>
                    Alert List
                </DialogTitle>

                <Table>
                    <TableCaption>A list of Alert Logges</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Creator</TableHead>
                            <TableHead>by</TableHead>
                            <TableHead>Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logges?.map((log, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{(log.msg)?.length > 15 ? <>
                                    <div onClick={() => {
                                        setOpenRead(true);
                                        setLogMsgs(log?.msg)
                                    }}>
                                        {
                                            (log.msg)?.substring(0, 15) + " Read..."
                                        }
                                    </div>
                                </> : log.msg}</TableCell>
                                <TableCell>{log?.by}</TableCell>
                                <TableCell>{log?.by}</TableCell>
                                <TableCell>{dayjs(log?.time).format("DD/MM/YYYY HH:mm:ss")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
        {
            openRead && <Dialog open={openRead} onOpenChange={setOpenRead}>
                <DialogContent>
                    <DialogTitle></DialogTitle>
                    {logMsgs}
                </DialogContent>

            </Dialog>
        }
    </>
    )
}
