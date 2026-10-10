import QueryProvider from '@/providers/query-provider';
import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export const metadata = {
  title: 'FreshCart - E-Commerce',
  description: 'FreshCart application built with Next.js 14',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
     <Navbar/>
        <QueryProvider>
          {children}
        </QueryProvider>
        <Footer/>
      </body>
    </html>
  );
}