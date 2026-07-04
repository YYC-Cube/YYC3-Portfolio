/**
 * GitHub API 集成
 * 自动获取仓库数据，用于项目展示
 */

const GITHUB_USERNAME = "YYC-Cube" // GitHub用户名
const GITHUB_API = "https://api.github.com"

export interface GitHubRepo {
  id: number
  name: string
  description: string
  html_url: string
  homepage: string | null
  language: string
  languages_url: string
  stargazers_count: number
  watchers_count: number
  forks_count: number
  open_issues_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  size: number
  default_branch: string
  topics: string[]
  visibility: string
  archived: boolean
  disabled: boolean
}

export interface RepoStats {
  totalStars: number
  totalForks: number
  totalWatchers: number
  languages: Record<string, number>
  topRepos: GitHubRepo[]
}

/**
 * 获取所有公开仓库
 */
export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&type=public`,
      {
        headers: {
          "Accept": "application/vnd.github.v3+json",
          // 如果需要访问私有仓库或提高API限制，添加token
          // "Authorization": `token ${process.env.GITHUB_TOKEN}`,
        },
        next: { revalidate: 3600 }, // 每小时重新验证一次
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repos: GitHubRepo[] = await response.json()
    return repos
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error)
    return []
  }
}

/**
 * 获取仓库的主要编程语言
 */
export async function getRepoLanguages(repoName: string): Promise<Record<string, number>> {
  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repoName}/languages`,
      {
        headers: {
          "Accept": "application/vnd.github.v3+json",
        },
        next: { revalidate: 86400 }, // 每天重新验证一次
      }
    )

    if (!response.ok) {
      return {}
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch languages for ${repoName}:`, error)
    return {}
  }
}

/**
 * 计算仓库统计数据
 */
export function calculateRepoStats(repos: GitHubRepo[]): RepoStats {
  const stats: RepoStats = {
    totalStars: 0,
    totalForks: 0,
    totalWatchers: 0,
    languages: {},
    topRepos: [],
  }

  repos.forEach((repo) => {
    // 统计总数
    stats.totalStars += repo.stargazers_count
    stats.totalForks += repo.forks_count
    stats.totalWatchers += repo.watchers_count

    // 找出热门仓库（按stars排序）
    stats.topRepos.push(repo)
  })

  // 按stars排序，取前10个
  stats.topRepos.sort((a, b) => b.stargazers_count - a.stargazers_count)
  stats.topRepos = stats.topRepos.slice(0, 10)

  return stats
}

/**
 * 筛选适合展示的项目
 * 规则：
 * 1. 不是fork的仓库
 * 2. 不是archived
 * 3. 有描述
 * 4. 最近有更新（可选）
 */
export function filterShowcaseRepos(repos: GitHubRepo[]): GitHubRepo[] {
  return repos.filter((repo) => {
    // 排除fork的仓库
    // 注意：GitHub API的fork字段需要额外请求，这里用名称简单判断
    // 或者你可以在GitHub设置中给适合展示的仓库添加topic: "showcase"
    
    // 排除archived和disabled
    if (repo.archived || repo.disabled) return false

    // 必须有描述
    if (!repo.description || repo.description.trim().length === 0) return false

    // 必须有首页或演示地址（可选）
    // if (!repo.homepage) return false

    return true
  })
}

/**
 * 按分类组织仓库
 */
export function categorizeRepos(repos: GitHubRepo[]): Record<string, GitHubRepo[]> {
  const categories: Record<string, GitHubRepo[]> = {
    "热门项目": [],
    "最近更新": [],
    "Web应用": [],
    "移动应用": [],
    "工具库": [],
    "AI/ML": [],
    "其他": [],
  }

  repos.forEach((repo) => {
    // 热门项目（stars >= 5）
    if (repo.stargazers_count >= 5) {
      categories["热门项目"].push(repo)
    }

    // 最近更新（最近30天）
    const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceUpdate <= 30) {
      categories["最近更新"].push(repo)
    }

    // 按语言分类
    const lang = repo.language?.toLowerCase()
    if (["javascript", "typescript", "react", "vue", "nextjs"].includes(lang || "")) {
      categories["Web应用"].push(repo)
    } else if (["swift", "kotlin", "flutter", "react native"].includes(lang || "")) {
      categories["移动应用"].push(repo)
    } else if (["python", "rust", "go"].includes(lang || "")) {
      categories["工具库"].push(repo)
    } else if (repo.topics?.includes("ai") || repo.topics?.includes("machine-learning")) {
      categories["AI/ML"].push(repo)
    } else {
      categories["其他"].push(repo)
    }
  })

  // 去重（一个项目可能在多个分类中）
  Object.keys(categories).forEach((key) => {
    categories[key] = Array.from(new Set(categories[key].map((r) => r.id)))
      .map((id) => categories[key].find((r) => r.id === id)!)
  })

  return categories
}
