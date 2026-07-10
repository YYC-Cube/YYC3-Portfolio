"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GitHubRepo, getGitHubRepos, filterShowcaseRepos, categorizeRepos } from "@/lib/github"

/**
 * GitHub 仓库展示组件
 * 自动从GitHub API获取并展示你的78个项目
 */
export default function GitHubRepos() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([])
  const [categories, setCategories] = useState<Record<string, GitHubRepo[]>>({})
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取仓库数据
  useEffect(() => {
    async function fetchRepos() {
      try {
        setLoading(true)
        const allRepos = await getGitHubRepos()
        
        if (allRepos.length === 0) {
          setError("无法获取GitHub仓库数据，请检查网络连接或GitHub用户名配置")
          return
        }

        // 筛选适合展示的仓库
        const showcaseRepos = filterShowcaseRepos(allRepos)
        
        setRepos(showcaseRepos)
        setFilteredRepos(showcaseRepos)
        
        // 分类
        const categorized = categorizeRepos(showcaseRepos)
        setCategories(categorized)
        
        setError(null)
      } catch (err) {
        setError("获取仓库数据时发生错误")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [])

  // 分类筛选
  useEffect(() => {
    if (selectedCategory === "全部") {
      setFilteredRepos(repos)
    } else {
      const categoryRepos = categories[selectedCategory] || []
      setFilteredRepos(categoryRepos)
    }
  }, [selectedCategory, repos, categories])

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // 格式化数字（stars, forks等）
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k"
    }
    return num.toString()
  }

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">正在从GitHub加载78个项目...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <p className="text-muted-foreground">
              提示：请确保在 <code className="bg-secondary px-2 py-1 rounded">lib/github.ts</code>{" "}
              中设置了正确的GitHub用户名
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="github-repos" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            GitHub 项目展示
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            从我的78个开源项目中精选展示
          </p>
          <div className="mt-6 flex justify-center gap-8 text-sm text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">{repos.length}</span> 个展示项目
            </div>
            <div>
              <span className="font-semibold text-foreground">
                {repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)}
              </span>{" "}
              ⭐ 总Stars
            </div>
            <div>
              <span className="font-semibold text-foreground">
                {repos.reduce((sum, repo) => sum + repo.forks_count, 0)}
              </span>{" "}
              🍴 总Forks
            </div>
          </div>
        </motion.div>

        {/* 分类筛选 */}
        <div className="flex justify-center flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory("全部")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === "全部"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            全部 ({repos.length})
          </button>
          {Object.entries(categories).map(([category, categoryRepos]) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category} ({categoryRepos.length})
            </button>
          ))}
        </div>

        {/* 项目网格 */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredRepos.map((repo, index) => (
            <motion.div
              key={repo.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-3xl shadow-lg overflow-hidden hover-lift transition-all duration-300 ease-in-out border-2 border-transparent hover:border-primary/10"
            >
              <div className="p-6">
                {/* 项目标题和链接 */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {repo.name}
                    </a>
                  </h3>
                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                      title="在线演示"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
                </div>

                {/* 项目描述 */}
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {repo.description}
                </p>

                {/* 技术标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {repo.language && (
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                      {repo.language}
                    </span>
                  )}
                  {repo.topics?.slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* 统计信息 */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {formatNumber(repo.stargazers_count)}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formatNumber(repo.forks_count)}
                  </div>
                  <div className="text-xs">
                    更新于 {formatDate(repo.updated_at)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 查看更多 */}
        <div className="text-center mt-12">
            <a
              href={`https://github.com/YYC-Cube?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-colors"
            >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            查看全部78个项目
          </a>
        </div>
      </div>
    </section>
  )
}
