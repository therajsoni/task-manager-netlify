"use client";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { Button } from "../ui/button";
import { ClickProject, ProjectResponse } from "@/types";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { useRoleProvider } from "@/utils/roleProviderContext";
export default function UsersTable({
    clickProjectData, groupList, setOnDelete, onRefetch, onUpdateOptions,
}: {
    clickProjectData: ClickProject, groupList: string[], setOnDelete: Dispatch<SetStateAction<number>>,
    onRefetch: () => Promise<void>,
    onUpdateOptions: () => Promise<void>
}) {
    const [refreshData, setRefreshData] = useState<ClickProject | undefined>();
    const [removingUser, setRemovingUser] = useState<string | null>(null);
    const refreshDataProject = useCallback(async () => {
        try {
            const request = await fetch(`/api/project/getId/${clickProjectData?._id}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        id: clickProjectData?._id
                    }),
                    cache: 'no-store',
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            if (request?.ok) {
                const response = await request.json();
                console.log(response, "48");

                if (response.success) {
                    setRefreshData(response.data);
                }
            }
        } catch (error) {
            toast.error("error occured while fetching project by id");
        }
    }, [clickProjectData?._id]);
    useEffect(() => {
        if (groupList?.length > 0) {
            refreshDataProject();
        }
    }, [ groupList]);
    const handleRemove = async (name: string) => {
        setRemovingUser(name);
        try {
            const request = await fetch(`/api/project/project-member-delete/${refreshData?._id}`, {
                method: "POST",
                body: JSON.stringify({ name, id: refreshData?._id }),
                headers: {
                    "Content-Type": "application/json",
                },
                cache: 'no-store'
            });
            const response = await request.json();
            if (request.ok && response?.success) {
                toast.success(response.message);
                refreshDataProject();
                 // Refresh list after deletion
                setOnDelete((prev: number) => prev === 0 ? 1 : 0);
                await onRefetch();
                await onUpdateOptions();
            } else {
                toast.error("Failed to remove member.");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setRemovingUser(null);
        }
    };
    const [taskFetch, setTaskFetch] = useState<ProjectResponse>();
    const fetchTaskByProjectId = useCallback(async () => {
        const request = await fetch("/api/tasks", {
            method: "POST",
            body: JSON.stringify({
                projectId: refreshData?._id
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });
        const response = await request.json();
        if (request.ok && response.success) {
            setTaskFetch(response?.data);
        } else {
            // okay
            // toast.error(response?.message);
        }
    }, [refreshData?._id])
    useEffect(() => {
        fetchTaskByProjectId();
    }, [fetchTaskByProjectId]);
    const {
        loginrole,
        data: UserGlobalData,
        projectBaseRole,
    } = useRoleProvider();
    useEffect(() => {
        if (loginrole && UserGlobalData && clickProjectData?.name) {
            projectBaseRole(clickProjectData.name);
        }
    }, [loginrole, UserGlobalData, clickProjectData?.name]);
    return (
        <>
            <Table>
                <TableCaption>
                    {(refreshData?.group?.length || 0) + " total member(s) & status is pending"}
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Date Joined</TableHead>
                        <TableHead>Remove</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.isArray(refreshData?.group) && refreshData?.group?.length > 0 ? (
                        refreshData?.group?.map((user, idx: number) => {
                            if (user === undefined) return;
                            if ("member" in user && "time" in user) {
                                return (
                                    <TableRow key={idx}>
                                        <TableCell>{user?.member}</TableCell>
                                        <TableCell>{dayjs(user?.time).format("DD/MM/YY")}</TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => handleRemove(user?.member)}
                                                disabled={removingUser === user?.member}
                                            >
                                                {removingUser === user?.member ? <Loader className="animate-spin" /> : "Remove"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                            return null;
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                No members found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}