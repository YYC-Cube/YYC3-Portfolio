"use client"

import { useTranslation } from "@/lib/i18n"
import Link from "next/link"

export default function Footer() {
  const { t } = useTranslation()

  const footerLinks: { label: string; href: string }[] = [
    { label: t("footer.about"), href: "/#about" },
    { label: t("footer.portfolio"), href: "/#portfolio" },
    { label: t("footer.services"), href: "/#services" },
    { label: t("footer.contact"), href: "/#contact" },
    { label: t("footer.privacy"), href: "/privacy" },
    { label: t("footer.terms"), href: "/terms" },
  ]

  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label={t("footer.about")}
        >
          {footerLinks.map((item) => (
            <div key={item.label} className="pb-6">
              <Link
                href={item.href}
                className="text-sm leading-6 text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>
        <p className="mt-10 text-center text-sm leading-5 text-muted-foreground">
          {t("footer.copyright")}
        </p>
      </div>
    </footer>
  )
}
