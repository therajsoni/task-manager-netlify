"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Trash, MoreVertical, ExternalLink, Download, Link, OptionIcon, Loader } from "lucide-react";
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
  const [data, setData] = React.useState<{
    name: string,
    url: string,
    uploader: string,
    date: Date
  }[]>([]);
  const [selectedDoc, setSelectedDoc] = React.useState<{
    name: string,
    url: string,
    uploader: string,
    date: Date
  } | null>(null);
  React.useEffect(() => {
    if (clickProjectData?.attachments) {
      setData(clickProjectData.attachments);
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
    setIsUploading(true);
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    try {
      const res = await fetch(`/api/project/attachments/${clickProjectData?._id}`, {
        method: "POST",
        body: fd,
      });
      const result = await res.json();
      if (result.success) {
        setData(result.project.attachments);
        setFiles([]);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  const [fetchloading, setFetchloding] = React.useState(false);
  const fetchAttachments = async () => {
    setFetchloding(true);
    try {
      const res = await fetch(`/api/project/attachments/fetchUploadById/${clickProjectData?._id}`);
      const result = await res.json();
      if (result.success) {
        setData(result.attachments); // yaha tum apna state update kar sakte ho
        setFetchloding(false);
      }
    } catch (err) {
      toast.error("Error occured while fetching the project files")
      console.error("Failed to fetch attachments", err);
      setFetchloding(false);
    }
  };

  const [deleteUploading, setDeleteUploading] = React.useState(false);
  const handleDelete = async (fileName: string) => {
    setDeleteUploading(true);
    try {
      const res = await fetch(
        `/api/project/attachments/Get/${clickProjectData?._id}?file=${encodeURIComponent(fileName)}`,
        { method: "DELETE" }
      );
      const result = await res.json();
      if (result.success) {
        setData(result.project.attachments);
        setSelectedDoc(null); // close dialog if open
        setDeleteUploading(false);
      }
    } catch (err) {
      console.error("Delete failed", err);
      setDeleteUploading(false);
    }
  };

  React.useEffect(() => {
    if (clickProjectData?._id !== undefined) {
      fetchAttachments();
    }
  }, [])



  return (
    <>
      <Dialog open={uploadBoxOpen} onOpenChange={setUploadBoxOpen}>
        <DialogContent>
          <DialogTitle>Upload {"File's"} & Review</DialogTitle>

          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-2">
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
  fetchloading && <div> <Loader className="animate-spin"/> </div>
}

          <div className="mt-6 overflow-y-scroll hide-scrollbar h-50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Uploader</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Download</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, idx) => (
                  <TableRow
                    key={idx}
                    className="cursor-pointer hover:bg-muted"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <TableCell onClick={() => {
                      setSelectedDoc(item);
                    }} >{idx + 1}</TableCell>
                    <TableCell onClick={() => {

                      setSelectedDoc(item);
                    }} >{NameLengthManage(item?.name, 22)}</TableCell>
                    <TableCell onClick={() => {

                      setSelectedDoc(item);
                    }} >{item.uploader}</TableCell>
                    <TableCell onClick={() => {

                      setSelectedDoc(item);
                    }} >{new Date(item?.date).toLocaleString()}</TableCell>
                    <TableCell>
                      <button className="flex justify-center items-center ">
                        <a
                          href={item?.url}
                          download
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center justify-center"
                        >
                          Download
                        </a>
                      </button>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.name);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader className="flex justify-between items-center">
                <DialogTitle>{selectedDoc?.name}</DialogTitle>
                {selectedDoc && (
                  <div className="flex flex-row gap-4 justify-center items-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(selectedDoc.name)}
                    >
{
  deleteUploading ? <Loader className="animate-spin"/> :                    <>   <Trash className="h-4 w-4" /> Delete</>
}
                    </Button>
                    <button>
                      <a
                        href={selectedDoc?.url}
                        download
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        {" Download"}
                      </a>
                    </button>
                  </div>
                )}
              </DialogHeader>
              {selectedDoc?.url && (
                selectedDoc.name.match(/\.(jpg|jpeg|png|gif|mp4|mov|avi)$/i) ? (
                  // ✅ Agar image/video hai to preview
                  selectedDoc.name.match(/\.(mp4|mov|avi)$/i) ? (
                    <video
                      src={selectedDoc.url}
                      controls
                      className="w-full h-[500px] border rounded"
                    />
                  ) : (
                    <img
                      src={selectedDoc.url}
                      alt={selectedDoc.name}
                      className="w-full h-[500px] object-contain border rounded"
                    />
                  )
                ) : (
                  // ✅ Agar dusra file (doc, xls, pdf, txt...) hai to preview na kare
                  <div className="flex flex-col items-center justify-center ">
                    <p className="text-muted-foreground mb-4">
                      Preview not available for this file type.
                    </p>
                    {/* <a
        href={selectedDoc.url}
        download
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Download File
      </a> */}
                    {/* <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="sm" className="flex items-center gap-2">
      <OptionIcon/>
      More Options
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem
      onClick={() => window.open(selectedDoc?.url, "_blank")}
    >
      <ExternalLink className="h-4 w-4 mr-2" /> Open in new tab
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <a href={selectedDoc?.url} download>
        <Download className="h-4 w-4 mr-2" /> Download
      </a>
    </DropdownMenuItem>
    <DropdownMenuItem
      onClick={() => {
        navigator.clipboard.writeText(selectedDoc?.url || "");
      }}
    >
      <Link className="h-4 w-4 mr-2" /> Copy link
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu> */}
                  </div>
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
