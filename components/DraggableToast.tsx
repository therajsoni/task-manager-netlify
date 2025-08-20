// import React, { useRef, useState, useEffect } from "react";
// import { Button } from "./ui/button";

// export function DraggableToast({
//   data,
//   onClose,
// }: {
//   data: {
//     title : String,
//     description : String,
//     createdBy : String,
//     time : Date
//    }
//   onClose: () => void;
// }) {
//   const [position, setPosition] = useState({
//     x: window.innerWidth - 350,
//     y: 50, // default top-right
//   });
//   const [dragging, setDragging] = useState(false);
//   const offset = useRef({ x: 0, y: 0 });

//   const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
//     setDragging(true);
//     offset.current = {
//       x: e.clientX - position.x,
//       y: e.clientY - position.y,
//     };
//   };

//   const handleMouseMove = (e: MouseEvent) => {
//     if (!dragging) return;
//     setPosition({
//       x: e.clientX - offset.current.x,
//       y: e.clientY - offset.current.y,
//     });
//   };

//   const handleMouseUp = () => {
//     setDragging(false);
//   };

//   useEffect(() => {
//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [dragging]);

//   return (
//     <div
//       className="bg-amber-50 p-3 shadow-lg rounded-lg border cursor-move w-[300px] select-none"
//       style={{
//         position: "fixed",
//         left: `${position.x}px`,
//         top: `${position.y}px`,
//         zIndex: 9999,
//       }}
//     >
//       <h1>{data.title}</h1>  
//       <main onMouseDown={handleMouseDown} className="text-sm">
//         {data.description}
//       </main>
//       <footer className="text-xs text-gray-500 mt-2">by {data.createdBy} at {data.time.toLocaleString()}</footer>
//       <hr className="my-2" />
//       <Button className="w-full" onClick={onClose}>
//         Undo
//       </Button>
//     </div>
//   );
// }
