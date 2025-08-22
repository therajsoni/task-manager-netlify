"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Trash, MoreVertical, ExternalLink, Download, Link, OptionIcon, Loader, Eye, DownloadCloud } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { singleProjectType } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import NameLengthManage from "@/utils/nameLengthManage";
import { useRoleProvider } from "@/utils/roleProviderContext";
import toast from "react-hot-toast";
import { Input } from "../ui/input";
type AttachmentType = {
  _id: string;
  public_id: string;
  secure_url: string;
  format: string;
  bytes: number;
  original_filename: string;
  resource_type: string;
  date?: Date; // optional if backend doesn't send
  savedFileName: string;
  uploader : {
    _id : string,
    username : string,
  },
  createdAt : Date
};


export default function TaskEditor({
  clickProjectData,
  openMain,
  uploadBoxOpen,
  setUploadBoxOpen
}: {
  clickProjectData: singleProjectType | undefined,
  openMain: boolean, setUploadBoxOpen: React.Dispatch<React.SetStateAction<boolean>>, uploadBoxOpen: boolean
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [data, setData] = React.useState<AttachmentType[]>([]);
  const [selectedDoc, setSelectedDoc] = React.useState<AttachmentType | null>(null);
  const [nameValue, setNameValue] = React.useState("");
  React.useEffect(() => {
    if (clickProjectData?.attachments) {
      // setData(clickProjectData.attachments);
    }
  }, [clickProjectData, open]);

  const handlePick = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };
  const { data: LoggedData } = useRoleProvider();



  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      const unique = newFiles.filter((f) => !existing.has(f.name + f.size));
      return [...prev, ...unique];
    });
    e.target.value = "";
  };
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    if (nameValue.length === 0) {
      toast.error("Kindly give a file Name");
      return;
    }
    setIsUploading(true);
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    try {
      const res = await fetch(`/api/project/attachments/${clickProjectData?._id}/?fileName=${nameValue}`, {
        method: "POST",
        body: fd,
      });
      const result = await res.json();
      if (result.success) {
        // setData(result.project.attachments);
        toast.success("uploaded")
        setFiles([]);
        setNameValue("");
      } else {
        console.log(result);
        toast.error(result?.message);
      }
    } catch (err) {
      console.log(err, "Error");
      toast.error("Server Error occured");
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
    await fetchAttachments();
  };

  const [fetchloading, setFetchloding] = React.useState(false);
  const fetchAttachments = async () => {
    setFetchloding(true);
    try {
      const res = await fetch(`/api/project/attachments/fetchUploadById/${clickProjectData?._id}`);
      const result = await res.json();
      if (result.success) {
        const mapped = result.attachments.map((a:AttachmentType) => ({
          _id: a._id,
          public_id: a.public_id,
          secure_url: a.secure_url,
          format: a.format,
          bytes: a.bytes,
          original_filename: a.original_filename,
          resource_type: a.resource_type,
          date: a.createdAt ? new Date(a.createdAt) : new Date(), // fallback
          savedFileName: a?.savedFileName || "Unknow Name",
          uploader : a?.uploader || {}
        }));
        setData(mapped);

      }

    } catch (err) {
      toast.error("Error occured while fetching the project files")
      console.error("Failed to fetch attachments", err);
      setFetchloding(false);
    }
  };

  console.log(data, "data-images");


  const [deleteUploading, setDeleteUploading] = React.useState(false);
  const handleDelete = async (publicId: string) => {
    setDeleteUploading(true);
    try {
      const res = await fetch(
        `/api/project/attachments/Get/${clickProjectData?._id}?public_id=${publicId}`,
        { method: "DELETE" }
      );
      const result = await res.json();
      if (result.success) {
        setData(result.project.attachments);
        setSelectedDoc(null);
      }
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setDeleteUploading(false);
    }
    await fetchAttachments();
  };

  React.useEffect(() => {
    if (clickProjectData?._id !== undefined) {
      fetchAttachments();
    }
  }, []);

  const [selectImage, setSelectImage] = React.useState("");

  console.log(data, "setdata");
  

  return (
    <>
      <Dialog open={uploadBoxOpen} onOpenChange={setUploadBoxOpen}>
        <DialogContent>
          <DialogTitle>Upload {"File's"} & Review</DialogTitle>
          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Input placeholder="name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                e.preventDefault();
                setNameValue(e.target.value);
              }} value={nameValue} />
              <Button
                type="button"
                variant="outline"
                onClick={handlePick}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Add
              </Button>
              <Button
                type="button"
                onClick={handleUpload}
                disabled={isUploading || files.length === 0}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              multiple
              onChange={handleAddFiles}
            />
            {files.length > 0 && (
              <div className="rounded-lg border p-3 space-y-2">
                <p className="text-sm font-medium">Files to upload:</p>
                <ul className="space-y-1">
                  {files.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between text-sm text-muted-foreground"
                    >
                      <span>
                        {f.name} ({formatSize(f.size)})
                      </span>
                      <button
                        onClick={() => removeFile(i)}
                        className="p-1 hover:text-red-600"
                      >
                        <X className="h-4 w-4" onClick={() => {
                          setIsUploading(false);
                        }} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          {
            // fetchloading ? <div className="flex m-auto p-auto"> <Loader className="animate-spin" /> </div> :
            <div className="mt-6 overflow-y-scroll hide-scrollbar h-50">
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* <TableHead>No</TableHead> */}
                    <TableHead>Name</TableHead>
                    <TableHead>Uploader</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>

                  {data.map((item, idx) => (
                    <TableRow
                      key={idx}
                      className="cursor-pointer hover:bg-muted"

                    >
                      {/* <TableCell onClick={() => setSelectedDoc(item)}>{idx + 1}</TableCell> */}
                      <TableCell onClick={() => setSelectedDoc(item)}>
                        {NameLengthManage(item?.savedFileName, 22) || "Unknow Name"}
                      </TableCell>
                      <TableCell>{NameLengthManage(item?.uploader?.username,12)}</TableCell>
                      <TableCell>{item.date ? new Date(item.date).toLocaleString() : "--"}</TableCell>
                      <TableCell className="flex flex-row  mt-1 gap-3">
                        <Eye onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoc(item)
                        }} className="bg-black text-white m-1 border-1 border-white border-solid rounded-xl p-2" size={36} />
                        <a
                          href={item.secure_url}
                          download
                          target="_blank"
                        >
                          <DownloadCloud className="bg-blue-600 m-1 border-1 border-white border-solid  rounded-xl p-2" size={36} />
                        </a>
                        {
                          deleteUploading && item.public_id === selectImage ? <Loader className="animate-spin bg-red-50 m-3 border-1 border-gray-800 border-solid rounded-xl " /> : <Trash onClick={(e) => {
                            e.stopPropagation();
                            if (!deleteUploading) {
                              handleDelete(item.public_id);
                              setSelectImage(item.public_id)
                            }
                          }} className="bg-red-50 m-1 border-1 border-gray-800 border-solid rounded-xl p-2" size={36} />
                        }
                      </TableCell>
                      {/* <TableCell className="flex flex-row bg-blue-600 mt-1"> */}
                      {/* </TableCell> */}
                      {/* <TableCell >
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.public_id);
                            }}
                          >
                       
                          </Button>
                        </TableCell> */}

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          }

          <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader className="flex justify-between items-center">
                <DialogTitle>{selectedDoc?.savedFileName}</DialogTitle>
                {selectedDoc && (
                  <div className="flex flex-row gap-4 justify-center items-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(selectedDoc.public_id)}
                    >
                      {
                        deleteUploading ? <Loader className="animate-spin" /> : <>   <Trash className="h-4 w-4" /> Delete</>
                      }
                    </Button>
                    <button>
                      <a
                        href={selectedDoc?.secure_url}
                        download
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        {" Download"}
                      </a>
                    </button>
                  </div>
                )}
              </DialogHeader>
              <DialogTitle>{selectedDoc?.savedFileName}</DialogTitle>

              {selectedDoc?.secure_url && (
                selectedDoc.resource_type === "image" ? (
                  <iframe
                    src={selectedDoc.secure_url}
                    className="w-full h-[500px] object-contain border rounded"
                  />
                ) : selectedDoc.resource_type === "video" ? (
                  <video
                    src={selectedDoc.secure_url}
                    controls
                    className="w-full h-[500px] border rounded"
                  />
                ) : (
                  <p className="text-muted-foreground">
                    Preview not available for this file type.
                  </p>
                )
              )}

            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>
    </>
  );
}
function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}
