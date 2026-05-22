import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";

const LINKS = [
  { href: "/",               label: "Home"    },
  { href: "/rsc",            label: "RSC"     },
  { href: "/streaming",      label: "Stream"  },
  { href: "/server-actions", label: "Actions" },
  { href: "/caching",        label: "Cache"   },
  { href: "/isr",            label: "ISR"     },
  { href: "/auth",           label: "Auth"    },
  { href: "/edge",           label: "Edge"    },
  { href: "/seo",            label: "SEO"     },
];

// ✅ Server Component — reads session server-side, no client JS needed
export async function Nav() {
  const session = await getSession();

  return (
    <nav className="sticky top-0 z-10 border-b border-white/8 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 h-12 overflow-x-auto">
        <span className="text-xs font-bold text-sky-400 mr-2 shrink-0">Next MR</span>
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-2.5 py-1 rounded-md text-xs text-slate-400 hover:text-white hover:bg-white/8 transition-colors shrink-0"
          >
            {label}
          </Link>
        ))}
        <div className="ml-auto shrink-0">
          {session ? (
            <form action={logoutAction}>
              <button className="px-2.5 py-1 rounded-md text-xs text-slate-500 hover:text-red-400 transition-colors">
                Logout
              </button>
            </form>
          ) : (
            <Link href="/auth/login" className="px-2.5 py-1 rounded-md text-xs text-slate-500 hover:text-white transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
