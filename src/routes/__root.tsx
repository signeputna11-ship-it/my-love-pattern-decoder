import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/home"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "My Love Pattern" },
      { name: "description", content: "You don’t have a dating problem. You have a pattern. Understand it and choose differently." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "My Love Pattern" },
      { property: "og:description", content: "You don’t have a dating problem. You have a pattern. Understand it and choose differently." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "My Love Pattern" },
      { name: "twitter:description", content: "You don’t have a dating problem. You have a pattern. Understand it and choose differently." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/MO71nkDPtYdsU8NlEZ6WHLRHw3y2/social-images/social-1777891817337-MY_LOVE_PATTERN_LOGO_2.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/MO71nkDPtYdsU8NlEZ6WHLRHw3y2/social-images/social-1777891817337-MY_LOVE_PATTERN_LOGO_2.webp" },
      { name: "p:domain_verify", content: "5d4626f7cb981d9ff2e5140ba729030a" },
      { name: "google-site-verification", content: "TLjivVP9gjp07U79hyBiuc9uzjcKz3M7JoBRtyACpNM" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/signe-coach-mark.png" },
      { rel: "apple-touch-icon", href: "/signe-coach-mark.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '870884912085971');
fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=870884912085971&ev=PageView&noscript=1"
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
