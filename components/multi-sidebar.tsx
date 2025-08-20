// "use client"

// import * as React from "react"
// import { ArchiveX, Command, File, Inbox, Send, Trash2 } from "lucide-react"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarHeader,
//   SidebarInput,
//   SidebarMenu,
//   SidebarMenubutton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar"
// import { NavUser } from "@/components/nav-user"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Button } from "@/components/ui/button"

// // existing data
// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   navMain: [
//     { title: "Inbox", icon: Inbox, isActive: true },
//     { title: "Drafts", icon: File, isActive: false },
//     { title: "Sent", icon: Send, isActive: false },
//     { title: "Junk", icon: ArchiveX, isActive: false },
//     { title: "Trash", icon: Trash2, isActive: false },
//   ],
//   projects: ["Project A", "Project B", "Project C"],
//   projectSections: ["Overview", "Tasks", "Settings"],
// }

// export default function AppSidebar() {
//   const [activeItem, setActiveItem] = React.useState(data.navMain[0])
//   const [selectedProject, setSelectedProject] = React.useState<string | null>(null)
//   const [selectedSection, setSelectedSection] = React.useState<string | null>(null)
//   const [isSectionSidebarOpen, setIsSectionSidebarOpen] = React.useState(false)

//   const { setOpen } = useSidebar()

//   return (
//     <div className="flex">
//       {/* ✅ First sidebar: Inbox, Sent, etc */}
//       <Sidebar collapsible="icon" className="border-r">
//         <SidebarHeader>
//           <SidebarMenu>
//             <SidebarMenuItem>
//               <SidebarMenubutton size="lg" asChild className="md:h-8 md:p-0">
//                 <a href="#">
//                   <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
//                     <Command className="size-4" />
//                   </div>
//                   <div className="grid flex-1 text-left text-sm leading-tight">
//                     <span className="truncate font-medium">Acme Inc</span>
//                     <span className="truncate text-xs">Enterprise</span>
//                   </div>
//                 </a>
//               </SidebarMenubutton>
//             </SidebarMenuItem>
//           </SidebarMenu>
//         </SidebarHeader>
//         <SidebarContent>
//           <SidebarGroup>
//             <SidebarGroupContent className="px-1.5 md:px-0">
//               <SidebarMenu>
//                 {data.navMain.map((item) => (
//                   <SidebarMenuItem key={item.title}>
//                     <SidebarMenubutton
//                       tooltip={{ children: item.title }}
//                       onClick={() => {
//                         setActiveItem(item)
//                         setSelectedProject(null)
//                         setIsSectionSidebarOpen(false)
//                         setOpen(true)
//                       }}
//                       isActive={activeItem?.title === item.title}
//                       className="px-2.5 md:px-2"
//                     >
//                       <item.icon />
//                       <span>{item.title}</span>
//                     </SidebarMenubutton>
//                   </SidebarMenuItem>
//                 ))}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         </SidebarContent>
//         <SidebarFooter>
//           <NavUser user={data.user} />
//         </SidebarFooter>
//       </Sidebar>

//       {/* ✅ Second sidebar: projects list */}
//       <Sidebar collapsible="none" className="border-r">
//         <SidebarHeader className="gap-3.5 border-b p-4">
//           <div className="text-foreground text-base font-medium">Projects</div>
//           <SidebarInput placeholder="Search projects..." />
//         </SidebarHeader>
//         <SidebarContent>
//           <SidebarGroup className="px-0">
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 {data.projects.map((project) => (
//                   <SidebarMenuItem key={project}>
//                     <SidebarMenubutton
//                       onClick={() => {
//                         setSelectedProject(project)
//                         setIsSectionSidebarOpen(true) // open third sidebar
//                       }}
//                       isActive={selectedProject === project}
//                     >
//                       {project}
//                     </SidebarMenubutton>
//                   </SidebarMenuItem>
//                 ))}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         </SidebarContent>
//       </Sidebar>

//       {/* ✅ Third sidebar: project sections */}
//       {isSectionSidebarOpen && selectedProject && (
//         <Sidebar collapsible="none" className="border-r">
//           <SidebarHeader className="gap-3.5 border-b p-4">
//             <div className="flex justify-between w-full">
//               <div className="text-foreground text-base font-medium">{selectedProject}</div>
//               <Button size="sm" variant="ghost" onClick={() => setIsSectionSidebarOpen(false)}>×</Button>
//             </div>
//           </SidebarHeader>
//           <SidebarContent>
//             <SidebarGroup className="px-0">
//               <SidebarGroupContent>
//                 <SidebarMenu>
//                   {data.projectSections.map((section) => (
//                     <SidebarMenuItem key={section}>
//                       <SidebarMenubutton
//                         onClick={() => setSelectedSection(section)}
//                         isActive={selectedSection === section}
//                       >
//                         {section}
//                       </SidebarMenubutton>
//                     </SidebarMenuItem>
//                   ))}
//                 </SidebarMenu>
//               </SidebarGroupContent>
//             </SidebarGroup>
//           </SidebarContent>
//         </Sidebar>
//       )}

//       {/* ✅ Content area (same as before) */}
//       <div className="flex-1 p-4">
//         {selectedProject && selectedSection ? (
//           <div className="text-lg font-medium">
//             Showing: {selectedProject} - {selectedSection}
//           </div>
//         ) : (
//           <div className="text-muted-foreground">
//             Select a project and section to view details.
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
