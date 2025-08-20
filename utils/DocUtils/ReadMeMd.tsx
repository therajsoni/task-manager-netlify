"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { singleProjectType, TaskList, } from "@/types";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

export default function ReadMeMd({
    open,
    setOpen,
    selectedTask,
    tasks,
    type,
    projectDeatail,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    type?: string;
    selectedTask?: Task | TaskList;
    tasks?: Task[];
    projectDeatail?: singleProjectType;
}) {
    const [content, setContent] = useState<string>(
        `# Project ReadMe\n\nWrite documentation here...\n\n- Supports **Markdown**\n- Tables\n- Code blocks\n\n\`\`\`js\nconsole.log("Hello World")\n\`\`\``
    );

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent>
                <DialogHeader>Task MD</DialogHeader>
                <Card className="w-full p-4">
                    <Tabs defaultValue="write">
                        <TabsList>
                            <TabsTrigger value="write">Write</TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>

                        {/* Write Mode */}
                        <TabsContent value="write">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-64 border rounded-md p-2 font-mono text-sm"
                                placeholder="Write your README in Markdown..."
                            />
                            <div className="flex justify-end mt-2">
                                <Button onClick={() => setOpen(false)}>Save</Button>
                            </div>
                        </TabsContent>

                        {/* Preview Mode */}
                        <TabsContent value="preview">
                            <CardContent className="prose max-w-none dark:prose-invert">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                            </CardContent>
                        </TabsContent>
                    </Tabs>
                </Card>
            </DialogContent>
        </Dialog>
    );
}
