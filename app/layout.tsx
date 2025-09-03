import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { PercentageProvider } from "@/utils/statusContext/projectStatusContext";
import { RoleProvider } from "@/utils/roleProviderContext";
import { WorkSpaceProvider } from "@/components/WorkSpaceProvider";
import { FeatureProvider } from "@/utils/FeaturesContext";
import { RefreshDataProvider } from "@/utils/RefreshDbs";
// import { SocketIOProvider } from "@/utils/socket/socketIoProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pmanager",
  description: "project - manager",
  icons: {
    icon: `./project-aon-logo.png`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PercentageProvider>
          <WorkSpaceProvider>
            <RoleProvider>
              <FeatureProvider>
                <RefreshDataProvider>
                  {/* <SocketIOProvider> */}
                  {children}
                </RefreshDataProvider>
              </FeatureProvider>
              {/* </SocketIOProvider> */}
            </RoleProvider>
          </WorkSpaceProvider>
        </PercentageProvider>
        <Toaster />
      </body>
    </html>
  );
}
