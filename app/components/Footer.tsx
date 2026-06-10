import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="页脚导航">
          {["关于我们", "作品展示", "服务项目", "联系方式", "隐私政策", "使用条款"].map((item) => (
            <div key={item} className="pb-6">
              <Link
                href="/"
                className="text-sm leading-6 text-muted-foreground hover:text-foreground"
              >
                {item}
              </Link>
            </div>
          ))}
        </nav>
        <p className="mt-10 text-center text-sm leading-5 text-muted-foreground">
          © 2026 YanYuCloudCube. 以五高五标五化五维为驱动，构建面向AI时代的智能应用开发范式。
        </p>
      </div>
    </footer>
  )
}
