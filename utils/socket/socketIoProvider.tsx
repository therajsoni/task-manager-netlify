// "use client";
// import { createContext, ReactNode, useContext, useState } from "react";

// type SocketIoContextType = {
//   appearMessage: boolean;
//   setAppearMessage: () => void;
//   setDisappearMessage: () => void;
// };

// const SocketIoContext = createContext<SocketIoContextType>({
//   appearMessage: false,
//   setAppearMessage: () => {},
//   setDisappearMessage: () => {},
// });

// export const SocketIOProvider = ({ children }: { children: ReactNode }) => {
//   const [appearMessage, setStateAppearMessage] = useState<boolean>(false);

//   function setAppearMessage() {
//     setStateAppearMessage(true);
//   }

//   function setDisappearMessage() {
//     setStateAppearMessage(false);
//   }

//   return (
//     <SocketIoContext.Provider
//       value={{
//         appearMessage,
//         setAppearMessage,
//         setDisappearMessage,
//       }}
//     >
//       {children}
//     </SocketIoContext.Provider>
//   );
// };

// export const useSocketIOProvider = () => useContext(SocketIoContext);
