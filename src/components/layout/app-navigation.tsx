"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, House } from "lucide-react";

import { cn } from "@/lib/utils";

const navigation = [
  { label: "Home", href: "/", icon: House },
  { label: "Discover", href: "/discover", icon: Compass },
  { label: "Matches", href: "/matches", icon: Heart },
] as const;

export function AppNavigation() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[220px] flex-col border-r-[3px] border-[#17131e] bg-white px-4 py-7 md:flex">
        <Link
          href="/"
          className="flex h-12 items-center px-3 text-[30px] font-black tracking-[-0.09em] text-[#17131e]"
          aria-label="Coy home"
        >
          coy
          <span className="ml-1 size-2.5 rounded-full bg-[#ff347d]" aria-hidden="true" />
        </Link>

        <nav className="mt-10 space-y-3" aria-label="Primary navigation">
          {navigation.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-12 items-center gap-3 rounded-[14px] px-3.5 text-sm font-black transition",
                  active
                    ? "border-[2.5px] border-[#17131e] bg-[#ff347d] text-[#17131e] shadow-[4px_4px_0_#17131e]"
                    : "text-[#17131e]/60 hover:bg-[#f5f5f5] hover:text-[#17131e]",
                )}
              >
                <Icon className="size-[18px]" strokeWidth={2.5} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <header className="fixed inset-x-0 top-0 z-30 flex h-[68px] items-center border-b-[2.5px] border-[#17131e] bg-white px-5 md:hidden">
        <Link
          href="/"
          className="flex items-center text-[27px] font-black tracking-[-0.09em] text-[#17131e]"
          aria-label="Coy home"
        >
          coy
          <span className="ml-1 size-2 rounded-full bg-[#ff347d]" aria-hidden="true" />
        </Link>
      </header>

      <nav
        className="fixed inset-x-3 bottom-3 z-40 grid h-[76px] grid-cols-3 rounded-[24px] border-[3px] border-[#17131e] bg-white px-2 shadow-[5px_6px_0_#17131e] md:hidden"
        aria-label="Mobile navigation"
      >
        {navigation.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="flex flex-col items-center justify-center gap-1 text-[11px] font-black"
            >
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full border-2 transition",
                  active
                    ? "border-[#17131e] bg-[#ff347d] text-[#17131e]"
                    : "border-transparent text-[#17131e]/55",
                )}
              >
                <Icon className="size-[18px]" strokeWidth={2.5} aria-hidden="true" />
              </span>
              <span className={active ? "text-[#17131e]" : "text-[#17131e]/55"}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
