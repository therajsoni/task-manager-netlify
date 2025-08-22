'use client';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useRoleProvider } from '@/utils/roleProviderContext';
import NotFound from '../not-found';
import dayjs from 'dayjs';
import { getSocket } from '@/config-socket/socket';

export default function AdminPage() {
    const [selectedRole, setSelectedRole] = useState('');
    const [projectSearch, setProjectSearch] = useState("");
    const socket = useMemo(() => {
        const socket = getSocket();
        return socket.connect();
    }, []);
    useEffect(() => {
        socket.on("connect", () => {
            console.log("I am connected and admin i am")
        })
        return () => { socket.disconnect(); }
    }, [])
    const [openModal, setOpenModal] = useState({
        type: "",
        value: false
    });
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState
        <{
            name: string,
            username: string,
            email: string,
            password: string,
            phone: string,
            role: string,
        }>
        ({
            name: "",
            username: "",
            email: "",
            password: "",
            phone: "",
            role: "",
        });
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setData({ ...data, [e.target.name]: e.target.value });
    }
    const handleSubmit = async () => {
        setLoading(true);
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        for (const key in data) {
            const value = data[key as keyof typeof data];
            if (typeof value === "string" && value.trim().length === 0) {
                setLoading(false);
                return toast.error(`${key} is required`);
            }
            if (key === "email" && !emailRegex.test(value)) {
                setLoading(false);
                return toast.error("Enter valid email");
            }
            if (key === "phone" && (value.length !== 10 || value.charAt(0) === "0")) {
                setLoading(false);
                return toast.error("Enter valid phone number");
            }
        }
        const registerAllUser = await fetch("/api/admin/register", {
            method: "POST",
            body: JSON.stringify({
                data: data
            }),
            headers: {
                "Content-Type": "applucation/json",
            }
        });
        if (registerAllUser?.ok) {
            const jsonResponse = await registerAllUser.json();
            if (jsonResponse?.success) {
                toast.success(jsonResponse?.message);
                setData({
                    name: "",
                    username: "",
                    email: "",
                    password: "",
                    phone: "",
                    role: "",
                });
                setLoading(false);
                await listOfAllUserFunction();
            } else {
                toast.error(jsonResponse?.message);
                await listOfAllUserFunction();
                setLoading(false);
            }
        } else {
            setLoading(false);
            toast.error("Error occur while register");
            await listOfAllUserFunction();
        }
        setLoading(false);
    }
    const [listOfUsers, setLiastOfUsers] = useState<{
        _id: string,
        name: string,
        username: string,
        email: string,
        password: string,
        phone: string,
        role: string,
    }[]>();
    const listOfAllUserFunction = async () => {
        const listOfAllUsers = await fetch("/api/admin/register");
        if (listOfAllUsers?.ok) {
            const jsonBody = await listOfAllUsers?.json();
            setLiastOfUsers(jsonBody?.data);
        }
    }
    useEffect(() => {
        listOfAllUserFunction();
    }, []);
    const [updateAnyUser, setUpdateAnyUser] = useState<{
        _id: string;
        name: string,
        username: string,
        email: string,
        password: string,
        phone: string,
        role: string,
    }>({
        _id: "",
        name: "",
        username: "",
        email: "",
        password: "",
        phone: "",
        role: "",
    });
    const [selectedTabs, setSelectedTabs] = useState({
        users: true,
        projects: false,
        userWithProjects: false,
    })
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const handleChangeUpdate = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!updateAnyUser) return;
        setUpdateAnyUser({ ...updateAnyUser, [e.target.name]: e.target.value });
    }
    const handleSubmitUpdate = async () => {
        setLoading(true);
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        for (const key in updateAnyUser) {
            const value = updateAnyUser[key as keyof typeof updateAnyUser];
            if (typeof value === "string" && value.trim().length === 0) {
                setLoading(false);
                return toast.error(`${key} is required`);
            }
            if (key === "email" && !emailRegex.test(value)) {
                setLoading(false);
                return toast.error("Enter valid email");
            }
            if (key === "phone" && (value.length !== 10 || value.charAt(0) === "0")) {
                setLoading(false);
                return toast.error("Enter valid phone number");
            }
        }
    const updateAnyUserByData = await fetch("/api/admin/register/update", {
            method: "PATCH",
            body: JSON.stringify({
                data: updateAnyUser
            }),
            headers: {
                "Content-Type": "applucation/json",
            }
        });
        if (updateAnyUserByData?.ok) {
            const jsonResponse = await updateAnyUserByData.json();
            if (jsonResponse?.success) {
                toast.success(jsonResponse?.message);
                setUpdateAnyUser({
                    name: "", username: "", email: "",
                    password: "",
                    phone: "",
                    role: "",
                    _id: ""
                });
                setOpenModal({ type: "", value: false });
                setUpdateDialogOpen(false);
                setLoading(false);
                await listOfAllUserFunction();
            } else {
                setLoading(false);
                toast.error(jsonResponse?.message);
                await listOfAllUserFunction();
            }
        } else {
            setLoading(false);
            toast.error("Error occur while register");
        }
    }
    const handleDelete = async (id: string) => {
        setLoading(true);
        const request = await fetch("/api/admin/register/delete", {
            method: "POST",
            body: JSON.stringify({
                _id: id
            })
        });
        if (request.ok) {
            const jsonBody = await request.json();
            if (jsonBody.success) {
                toast.success("User Deleted");
                setLoading(false);
                await listOfAllUserFunction();
            } else {
                toast.error("Error occured");
                await listOfAllUserFunction();
                setLoading(false);
            }
        } else {
            setLoading(false);
            toast.error("Error occured");
        }
    }
    const [projects, setProjects] = useState<{
        _id: string, name: string, client: string, by: {
            username: string, _id: string
        }, projectManager: {
            username: string, _id: string
        }, createdAt: Date, group: {
            member: string, time: Date
        }[],
    }[]>();
    const allProjectsFetch = async () => {
        try {
            const getAll = await fetch("/api/project/getAll", {
                method: "GET"
            });
            const json = await getAll.json();
            setProjects(json?.data)
        } catch (error) {
            toast.error("Fetching project At error occured");
        }
    }
    useEffect(() => {
        allProjectsFetch()
    }, [selectedTabs])
    const handleProjectDelete = async (id: string) => {
        try {
            const request = await fetch(`/api/project/delete`, {
                method: "POST",
                body: JSON.stringify({ id }),
                headers: {
                    "Content-Type": 'application/json',
                }
            });
            if (request.ok) {
                const response = await request.json();
                if (response?.success) {
                    toast.success(response?.message, {
                        duration: 3000
                    })
                    await allProjectsFetch();
                } else {
                    toast.error(response?.message);
                }
            } else {
                toast.error("Error occured when deleting the project")
            }
        } catch (error) {
            toast.error("Error occured when deleting the project")

        }
    }
    const { loginrole } = useRoleProvider();
    if (loginrole !== "core-admin") {
        return <NotFound />
    }
    const filteredUsers = selectedRole
        ? listOfUsers?.filter((user) => user.role === selectedRole)
        : listOfUsers;
    const filteredProjects = projectSearch
        ? projects?.filter((p) =>
            [p.name, p.client, p.by?.username, p.projectManager?.username]
                .some((field) =>
                    field?.toLowerCase().includes(projectSearch.toLowerCase())
                )
        )
        : projects;
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Hello, Admin</h1>
            <section className="mb-4 flex items-center gap-4">
                <Link href={"/"} className='text-white bg-black px-4 py-2 rounded-lg'>Back</Link>
                <Button
                    className="bg-black hover:bg-black text-gray-200"
                    onClick={() => {
                        setOpenModal({
                            type: "Create New User", value: true
                        })
                    }}
                >
                    Register New User
                </Button>
                <Button
                    onClick={() => {
                        setSelectedTabs({
                            users: true,
                            projects: false,
                            userWithProjects: false
                        })
                    }}
                >
                    All Users
                </Button>
                <Button onClick={() => {
                    setSelectedTabs({
                        users: false,
                        projects: true,
                        userWithProjects: false
                    })
                }}>
                    Manage Projects
                </Button>
                {/* <Button onClick={() => {
                    setSelectedTabs({
                        users: false,
                        projects: false,
                        userWithProjects: true
                    })
                }}>
                    User With Projects
                </Button> */}
                {selectedTabs.userWithProjects !== true && <Popover>
                    <PopoverTrigger asChild>
                        <Button className="bg-black hover:bg-black text-gray-200">
                            Filter
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56">
                        {selectedTabs.users && <> <label className="block text-sm font-medium mb-2">
                            Filter by Role:
                        </label>
                            <select
                                className="w-full border px-2 py-1 rounded"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="project-manager">ProjectManager</option>
                                <option value="developer">Developer</option>
                            </select></>}
                        {selectedTabs.projects && (
                            <Input
                                placeholder="Search projects..."
                                className=""
                                value={projectSearch}
                                onChange={(e) => setProjectSearch(e.target.value)}
                            />
                        )}

                    </PopoverContent>
                </Popover>}
            </section>
            <main className="overflow-x-auto">
                <h1 className='font-bold text-3xl py-2 px-0 underline text-blue-500'>
                    {
                        (selectedTabs.users === true && selectedTabs.projects === false) ? "All User's" : selectedTabs.projects ? "All Project's" : "All Project's with User's"
                    }
                </h1>
                <Table>
                    <TableHeader>
                        {
                            selectedTabs.users === true && selectedTabs.projects === false &&
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Password</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className='w-1 '>Update </TableHead>
                                <TableHead></TableHead>
                                <TableHead>DELETE</TableHead>
                            </TableRow>
                        }
                        {
                            selectedTabs.users === false && selectedTabs.projects === true &&
                            <TableRow className='text-lg p-2 m-4'>
                                <TableHead>No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Creator</TableHead>
                                <TableHead>Project Manager</TableHead>
                                <TableHead>Create Date</TableHead>
                                <TableHead>No of Members<span className='text-xs font-light p-1 mt-2'>(including self)</span></TableHead>
                                <TableHead className=''>DELETE</TableHead>
                            </TableRow>
                        }
                        {
                            selectedTabs.userWithProjects === true && <TableRow className='text-lg p-2 m-4'>
                                <TableHead>No</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>No of Projects</TableHead>
                                <TableHead>Project Deatils</TableHead>
                                <TableHead>Filter By Role</TableHead>
                            </TableRow>
                        }

                    </TableHeader>
                    <TableBody>
                        {selectedTabs.users === true && selectedTabs.projects === false && filteredUsers?.map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{user?.name}</TableCell>
                                <TableCell>{user?.username}</TableCell>
                                <TableCell>{user?.email}</TableCell>
                                <TableCell>{user?.password}</TableCell>
                                <TableCell>{user?.phone}</TableCell>
                                <TableCell className="capitalize">{user?.role}</TableCell>
                                <TableCell className='text-white bg-black w-1  rounded-sm ' onClick={() => {
                                    setUpdateAnyUser(user);
                                    setUpdateDialogOpen(true);
                                }} >
                                    Update User
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell className=' w-3  text-white bg-black rounded-sm' onClick={() => {
                                    const promt = confirm(`Do you want to delete ${user?.name}`);
                                    if (promt === true) {
                                        handleDelete(user?._id);
                                    }
                                }}>DELETE</TableCell>
                            </TableRow>
                        ))}
                        {
                            selectedTabs.users === false && selectedTabs.projects === true && filteredProjects?.map((project, index) => (
                                <TableRow key={index} className='m-4'>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{project?.name}</TableCell>
                                    <TableCell>{project?.client}</TableCell>
                                    <TableCell>{project?.by?.username}</TableCell>
                                    <TableCell>{project?.projectManager?.username}</TableCell>
                                    <TableCell>{dayjs(project?.createdAt).format("DD/MM/YYYY, HH:mm:ss")}</TableCell>
                                    <TableCell className=''>{project?.group?.length}</TableCell>
                                    <TableCell className='text-white bg-black  rounded-sm flex justify-center' onClick={async () => {
                                        await handleProjectDelete(project?._id);
                                    }}>Delete</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </main>
            <Dialog open={openModal?.value} onOpenChange={() => {
                setOpenModal({
                    value: false,
                    type: "",
                })
            }}>
                <DialogContent>
                    <DialogTitle>{openModal?.type}</DialogTitle>
                    <div className="">
                        <Card className='border-none shadow-none'>
                            <CardContent>
                                <div>
                                    <div className="flex flex-col gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="name">Name**</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Type your Name"
                                                required autoComplete="off"
                                                autoCorrect="off"
                                                spellCheck={false}
                                                name="name"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    handleChange(e)
                                                }}
                                                value={data?.name}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="username">Username**</Label>
                                            <Input
                                                id="username"
                                                type="username"
                                                placeholder="Type your Username"
                                                required autoComplete="off"
                                                autoCorrect="off"
                                                spellCheck={false}
                                                name="username"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    handleChange(e)
                                                }}
                                                value={data?.username}
                                            />
                                        </div>

                                        <div className="grid gap-3">
                                            <Label htmlFor="email">Email**</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Type your Email"
                                                required autoComplete="off"
                                                autoCorrect="off"
                                                spellCheck={false}
                                                name="email"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    handleChange(e)
                                                }}
                                                value={data?.email}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Password**</Label>
                                            </div>
                                            <Input onPaste={(e) => { e.preventDefault() }} id="password"
                                                type="password" name="password" placeholder="Type your password" required autoComplete="off"
                                                autoCorrect="off"
                                                spellCheck={false}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    handleChange(e)
                                                }}
                                                value={data?.password}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="phone">Phone**</Label>
                                            <Input
                                                id="phone"
                                                type="password"
                                                placeholder="Type your Phone"
                                                required autoComplete="off"
                                                autoCorrect="off"
                                                spellCheck={false}
                                                name="phone"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    handleChange(e)
                                                }}
                                                value={data?.phone}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="role">Role**</Label>
                                            <Input
                                                id="role"
                                                type="text"
                                                placeholder="Type your Role"
                                                required autoComplete="off"
                                                autoCorrect="off"
                                                spellCheck={false}
                                                name="role"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    handleChange(e)
                                                }}
                                                value={data?.role}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Button className="text-fuchsia-50 bg-amber-400 rounded-2xl hover:bg-amber-400"
                                                onClick={handleSubmit}
                                            >
                                                {
                                                    loading ? <Loader className='animate-spin' /> : "Register"
                                                }
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
                <DialogContent>
                    <DialogTitle>{"Update User"}</DialogTitle>
                    <div className="">
                        <Card className='border-none shadow-none'>
                            <CardContent>
                                <div>
                                    <div className="flex flex-col gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="name">Name**</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Type your Name"
                                                required autoComplete="off"
                                                autoCorrect="off"
                                                spellCheck={false}
                                                name="name"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    handleChangeUpdate(e)
                                                }}
                                                value={updateAnyUser?.name}
                                                className='cursor-not-allowed'
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="username">Username**</Label>
                                            <Input
                                                id="username"
                                                type="username"
                                                placeholder="Type your Username"
                                                required autoComplete="off"
                                                autoCorrect="off"
                                                spellCheck={false}
                                                name="username"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    handleChangeUpdate(e)
                                                }}
                                                value={updateAnyUser?.username}
                                                className='cursor-not-allowed'
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="email">Email**</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Type your Email"
                                                required autoComplete="off"
                                                autoCorrect="off"
                                                spellCheck={false}
                                                name="email"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    handleChangeUpdate(e)
                                                }}
                                                value={updateAnyUser?.email}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Password**</Label>
                                            </div>
                                            <Input onPaste={(e) => { e.preventDefault() }} id="password"
                                                type="password" name="password" placeholder="Type your password" required autoComplete="off"
                                                autoCorrect="off"
                                                spellCheck={false}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    handleChangeUpdate(e)
                                                }}
                                                value={updateAnyUser?.password}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="phone">Phone**</Label>
                                            <Input
                                                id="phone"
                                                type="text"
                                                placeholder="Type your Phone"
                                                required autoComplete="off"
                                                autoCorrect="off"
                                                spellCheck={false}
                                                name="phone"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    handleChangeUpdate(e)
                                                }}
                                                value={updateAnyUser?.phone}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="role">Role**</Label>
                                            <Input
                                                id="role"
                                                type="role"
                                                placeholder="Type your Role"
                                                required autoComplete="off"
                                                autoCorrect="off"
                                                spellCheck={false}
                                                name="role"
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                    handleChangeUpdate(e)
                                                }}
                                                value={updateAnyUser?.role}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Button className="text-fuchsia-50 bg-amber-400 rounded-2xl hover:bg-amber-400"
                                                onClick={handleSubmitUpdate}
                                            >
                                                {
                                                    loading ? <Loader className='animate-spin' /> : "Update"
                                                }
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}