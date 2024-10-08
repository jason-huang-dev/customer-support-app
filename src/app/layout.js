import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, SignIn, UserButton } from "@clerk/nextjs";
import CapitalOne from './assets/image.png';
import { Typography } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CapitalOne AI Assistant",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body 
          className={inter.className}
          style={{
            backgroundImage: `url(${CapitalOne.src})`, // Ensure the image URL is correctly resolved
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100vh', // Ensure the body takes the full viewport height
          }}
        >
          <header className="flex justify-between p-1">
            <SignedIn>
              <Typography variant="h6" sx={{color:"black"}}>Capital One</Typography>
            </SignedIn>
            <UserButton style={{ width: '40px', height: '40px' }} />
          </header>

          <main 
            className="flex justify-center items-center h-screen"
          >
            <SignedOut>
              <SignIn routing="hash" />
            </SignedOut>
            <SignedIn>
              {children}
            </SignedIn>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
