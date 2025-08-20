"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useWorkSpaceProvider } from "@/components/WorkSpaceProvider";
const itemsPerPage = 5;
export default function EngineerProjectsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const {
        myregistrationDeatails,
        myProjectsOverView,
        myProjectList,
    } = useWorkSpaceProvider();
    const totalPages = Math.ceil(myProjectsOverView?.totalProjects?.length || 0 / itemsPerPage) + 1;
return (
        <div className="p-6 space-y-6 overflow-y-scroll hide-scrollbar max-h-full">
            <Link href={"/"} className="bg-black  px-4 py-2 text-white">
                Back
            </Link>
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">My WorkSpace Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-muted-foreground">name</p>
                        <p className="text-lg font-bold">
                            {myregistrationDeatails?.name}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">username</p>
                        <p className="text-lg font-bold">{myregistrationDeatails?.username}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="text-lg font-bold">{myregistrationDeatails?.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Registed Date
                        </p>
                        <p className="text-lg font-bold">
                            {
                                myregistrationDeatails?.registrationDate !== undefined ?
                                    typeof myregistrationDeatails?.registrationDate === "number"
                                        || typeof myregistrationDeatails?.registrationDate === "string"
                                        ? myregistrationDeatails?.registrationDate :
                                        new Date(myregistrationDeatails?.registrationDate).toLocaleString()
                                    : "Date not provided"
                            }
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="text-lg font-bold">{myregistrationDeatails?.phone}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Company Base Role</p>
                        <p className="text-lg font-bold">{myregistrationDeatails?.role}</p>
                    </div>

                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">My WorkSpace on Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-muted-foreground">Projects Worked</p>
                        <p className="text-lg font-bold">{myProjectsOverView?.completedProjects}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Projects Working</p>
                        <p className="text-lg font-bold">{myProjectsOverView?.currentProjectsInRoled}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Projects</p>
                        <p className="text-lg font-bold">{myProjectsOverView?.totalProjects}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Roles</p>
                        <div className="flex gap-2 flex-wrap flex-col">
                            {myProjectsOverView?.roles?.map(role => (
                                <span key={role}>{role}</span>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Projects List</CardTitle>
                </CardHeader>
                <CardContent className="">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Project</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Added</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {myProjectList?.map((project, index) => (
                                <TableRow key={index}>
                                    <TableCell>{project?.name}</TableCell>
                                    <TableCell>{project?.role}</TableCell>
                                    <TableCell>{new Date(project?.added).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex justify-between items-center mt-4">
                        <Button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}