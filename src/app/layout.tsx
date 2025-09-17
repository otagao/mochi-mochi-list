import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'もちもちリスト',
  description: 'チェックボックス式のかわいい持ち物リスト',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}