import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://prayer168.github.io/seeds/"),
  alternates: { canonical: "/" },
  title: "種子星球｜世界奇趣種子圖鑑與手作工坊",
  description: "為國小高年級設計的互動種子圖鑑：探索 12 種世界奇趣種子、四種種子傳播方式、8 款安全手作與素養闖關。全站教學圖片由 Image 2.0 生成。",
  keywords: ["種子圖鑑", "自然科學", "互動教材", "種子手作", "國小自然"],
  openGraph: {
    title: "種子星球｜一顆種子，一次環遊世界",
    description: "探索奇妙種子、破解旅行方法，再把自然靈感變成可愛手作。",
    type: "website",
    locale: "zh_TW",
    images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "種子星球：世界奇趣種子圖鑑與手作工坊" }]
  },
  twitter: { card: "summary_large_image", title: "種子星球", description: "世界奇趣種子圖鑑與手作工坊", images: ["/og-cover.png"] }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
