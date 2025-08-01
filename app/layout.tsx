import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Lexend } from 'next/font/google'
import './globals.css'

export const metadata: Metadata = {
  title: 'TierPass',
  description: 'Smooth progression through tiers',
}

const lexend = Lexend({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={lexend.className}>
          <header className="bg-transparent shadow-sm">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-8">
                  <a href="/" className="text-xl font-bold text-gray-900">
                    Event Showcase
                  </a>
                  <SignedIn>
                    <nav className="hidden md:flex space-x-6">
                      <a href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
                        Dashboard
                      </a>
                      <a href="/events" className="text-gray-600 hover:text-gray-900 font-medium">
                        Events
                      </a>
                    </nav>
                  </SignedIn>
                </div>
                <div className="flex items-center gap-4">
                  <SignedOut>
                    <SignInButton >
                      <button className="text-[#333] rounded-sm font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton>
                      <button className="bg-[#6c47ff] text-white rounded-sm font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-[#5a3ee6] transition-colors">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </div>
              </div>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}