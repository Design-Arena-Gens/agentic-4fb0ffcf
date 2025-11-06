import './globals.css';

export const metadata = {
  title: 'Journal Entry Lecture',
  description: 'Lecturer-style video walkthrough of accounting journal entries',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
