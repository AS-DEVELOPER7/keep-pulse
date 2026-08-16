import './globals.css';
import StoreProvider from '@/lib/redux/StoreProvider.jsx';
import { ThemeProvider } from '@/components/providers/ThemeProvider.jsx';

export const metadata = {
  title: 'KeepPulse | Supabase & API Keep-Alive Engine',
  description: 'Prevent free-tier cloud databases and Supabase projects from pausing due to inactivity.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

// Inline script to prevent FOUC (Flash Of Unstyled Content)
const themeScript = `
  (function() {
    try {
      var savedTheme = localStorage.getItem('keep_pulse_theme') || 'system';
      var isDark = savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
        <ThemeProvider>
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

