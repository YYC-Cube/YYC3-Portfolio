/**
 * @fileoverview ICU MessageFormat 解析器
 * @description 实现 ICU MessageFormat 规范，支持 plural、select、selectOrdinal 等语法
 */

import type {
  ICUArgument,
  ICUDate,
  ICULiteral,
  ICUNode,
  ICUNumber,
  ICUParseError,
  ICUParseResult,
  ICUPlural,
  ICUPluralClause,
  ICUSelect,
  ICUSelectClause,
  ICUSelectOrdinal,
  ICUTime,
} from "./types"

/**
 * ICU MessageFormat 解析器
 * 支持的语法类型：
 * - {var} 参数插值
 * - {var, plural, ...} 复数形式
 * - {var, select, ...} 选择形式
 * - {var, selectordinal, ...} 序数形式
 * - {var, number} 数字格式化
 * - {var, date, ...} 日期格式化
 * - {var, time, ...} 时间格式化
 */
export class ICUParser {
  private pos = 0
  private input = ""
  private errors: ICUParseError[] = []

  parse(input: string): ICUParseResult {
    this.pos = 0
    this.input = input
    this.errors = []

    const nodes = this.parseMessage()
    return { nodes, errors: [...this.errors] }
  }

  private parseMessage(stopAt?: string): ICUNode[] {
    const nodes: ICUNode[] = []

    while (this.pos < this.input.length) {
      if (stopAt && this.input[this.pos] === stopAt) {
        break
      }
      if (this.input[this.pos] === "{") {
        nodes.push(this.parseArgument())
      } else if (this.input[this.pos] === "'" && this.input[this.pos + 1] === "'") {
        // Escaped single quote
        this.pos += 2
        nodes.push(this.createLiteral("'"))
      } else if (this.input[this.pos] === "'") {
        nodes.push(this.parseEscaped())
      } else {
        const start = this.pos
        while (
          this.pos < this.input.length &&
          this.input[this.pos] !== "{" &&
          !(this.input[this.pos] === "'" && this.input[this.pos + 1] === "'") &&
          !(stopAt && this.input[this.pos] === stopAt)
        ) {
          this.pos++
        }
        nodes.push(this.createLiteral(this.input.slice(start, this.pos)))
      }
    }

    return nodes
  }

  private parseEscaped(): ICULiteral {
    const start = this.pos
    this.pos++ // skip opening '
    while (this.pos < this.input.length) {
      if (this.input[this.pos] === "'") {
        const content = this.input.slice(start + 1, this.pos)
        this.pos++ // skip closing '
        return this.createLiteral(content)
      }
      this.pos++
    }
    // Unclosed escaped sequence
    this.addError("Unclosed escaped sequence", start)
    return this.createLiteral(this.input.slice(start + 1))
  }

  private parseArgument(): ICUNode {
    const start = this.pos
    this.pos++ // skip {

    const name = this.parseIdentifier()

    if (this.peek() === "}") {
      this.pos++ // skip }
      return this.createArgument(name)
    }

    this.skipWhitespace()

    if (this.peek() === ",") {
      this.pos++ // skip ,
      this.skipWhitespace()
      const formatType = this.parseIdentifier().toLowerCase()
      return this.parseFormat(name, formatType)
    }

    // Unexpected character
    this.addError(`Unexpected character at position ${this.pos}`, start)
    this.skipToClosingBrace()
    return this.createLiteral(this.input.slice(start, this.pos))
  }

  private parseFormat(name: string, formatType: string): ICUNode {
    switch (formatType) {
      case "plural":
        return this.parsePlural(name)
      case "select":
        return this.parseSelect(name)
      case "selectordinal":
        return this.parseSelectOrdinal(name)
      case "number":
        return this.parseNumber(name)
      case "date":
        return this.parseDate(name)
      case "time":
        return this.parseTime(name)
      default:
        this.skipToClosingBrace()
        return this.createArgument(name)
    }
  }

  private parsePlural(name: string): ICUPlural {
    let offset = 0

    // Skip the comma and whitespace after the format type (e.g., "plural,")
    if (this.peek() === ",") this.pos++
    this.skipWhitespace()

    // Parse optional offset
    if (
      this.input.slice(this.pos, this.pos + 7).toLowerCase() === "offset:"
    ) {
      this.pos += 7
      offset = this.parseNumberLiteral()
      this.skipWhitespace()
    }

    const clauses = this.parseSelectLike("plural") as ICUPluralClause[]

    return {
      type: "plural",
      name,
      offset,
      clauses,
    }
  }

  private parseSelect(name: string): ICUSelect {
    // Skip the comma and whitespace after the format type
    if (this.peek() === ",") this.pos++
    this.skipWhitespace()
    const clauses = this.parseSelectLike("select") as ICUSelectClause[]
    return { type: "select", name, clauses }
  }

  private parseSelectOrdinal(name: string): ICUSelectOrdinal {
    // Skip the comma and whitespace after the format type
    if (this.peek() === ",") this.pos++
    this.skipWhitespace()
    const clauses = this.parseSelectLike("selectOrdinal") as ICUSelectClause[]
    return { type: "selectOrdinal", name, clauses }
  }

  private parseSelectLike(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _type: "plural" | "select" | "selectOrdinal"
  ): ICUPluralClause[] | ICUSelectClause[] {
    const clauses: ICUPluralClause[] = []

    while (this.pos < this.input.length) {
      this.skipWhitespace()

      if (this.peek() === "}") {
        this.pos++ // skip }
        return clauses
      }

      if (this.peek() === "=") {
        // Explicit number match: =0, =1, etc.
        this.pos++ // skip =
        const value = this.parseNumberLiteral()
        this.skipWhitespace()
        const content = this.parseClauseContent()
        clauses.push({ selector: `=${value}`, content })
      } else {
        const selector = this.parseSelector()
        this.skipWhitespace()
        const content = this.parseClauseContent()
        clauses.push({ selector, content } as ICUPluralClause)
      }
    }

    // If we got here without hitting the closing }, ensure we return
    return clauses
  }

  private parseNumber(name: string): ICUNumber {
    this.skipWhitespace()

    let format: string | undefined
    if (this.peek() === ",") {
      this.pos++ // skip ,
      this.skipWhitespace()
      format = this.parseIdentifier()
    }

    this.skipToClosingBrace()
    return { type: "number", name, format }
  }

  private parseDate(name: string): ICUDate {
    this.skipWhitespace()

    let format: "short" | "medium" | "long" | "full" | undefined
    if (this.peek() === ",") {
      this.pos++ // skip ,
      this.skipWhitespace()
      const fmt = this.parseIdentifier().toLowerCase() as ICUDate["format"]
      if (fmt) format = fmt
    }

    this.skipToClosingBrace()
    return { type: "date", name, format }
  }

  private parseTime(name: string): ICUTime {
    this.skipWhitespace()

    let format: "short" | "medium" | "long" | "full" | undefined
    if (this.peek() === ",") {
      this.pos++ // skip ,
      this.skipWhitespace()
      const fmt = this.parseIdentifier().toLowerCase() as ICUTime["format"]
      if (fmt) format = fmt
    }

    this.skipToClosingBrace()
    return { type: "time", name, format }
  }

  private parseClauseContent(): ICUNode[] {
    this.skipWhitespace()

    if (this.peek() === "{") {
      this.pos++ // skip {
      const content = this.parseMessage("}")
      this.skipWhitespace()
      if (this.peek() === "}") {
        this.pos++ // skip }
      }
      return content
    }

    return []
  }

  private parseSelector(): string {
    const start = this.pos

    while (this.pos < this.input.length) {
      const ch = this.input[this.pos]
      if (ch === "{" || ch === "}" || ch === ",") break
      if (/\s/.test(ch)) break
      this.pos++
    }

    return this.input.slice(start, this.pos)
  }

  private parseNumberLiteral(): number {
    const start = this.pos
    while (this.pos < this.input.length && /[\d.]/.test(this.input[this.pos])) {
      this.pos++
    }
    return Number.parseFloat(this.input.slice(start, this.pos)) || 0
  }

  private parseIdentifier(): string {
    const start = this.pos
    while (
      this.pos < this.input.length &&
      /[\w]/.test(this.input[this.pos])
    ) {
      this.pos++
    }
    return this.input.slice(start, this.pos)
  }

  private peek(): string {
    return this.input[this.pos] ?? ""
  }

  private skipWhitespace(): void {
    while (this.pos < this.input.length && /\s/.test(this.input[this.pos])) {
      this.pos++
    }
  }

  private skipToClosingBrace(): void {
    let depth = 1
    while (this.pos < this.input.length && depth > 0) {
      if (this.input[this.pos] === "{") depth++
      else if (this.input[this.pos] === "}") depth--
      if (depth > 0) this.pos++
    }
    if (this.pos < this.input.length) this.pos++ // skip }
  }

  private addError(message: string, position: number): void {
    this.errors.push({ message, position })
  }

  private createLiteral(value: string): ICULiteral {
    return { type: "literal", value }
  }

  private createArgument(name: string): ICUArgument {
    return { type: "argument", name }
  }
}

/**
 * ICU MessageFormat 编译器
 * 将解析后的 AST 节点编译为最终字符串
 */
export class ICUCompiler {
  private parser = new ICUParser()

  /**
   * 编译 ICU 消息为字符串
   * @param message ICU MessageFormat 字符串
   * @param params 参数
   * @returns 编译后的字符串
   */
  compile(message: string, params?: Record<string, string | number>): string {
    const { nodes } = this.parser.parse(message)
    return nodes.map((node) => this.compileNode(node, params)).join("")
  }

  private compileNode(
    node: ICUNode,
    params?: Record<string, string | number>
  ): string {
    switch (node.type) {
      case "literal":
        return node.value

      case "argument": {
        const val = params?.[node.name]
        return val !== undefined ? String(val) : `{${node.name}}`
      }

      case "number": {
        const val = params?.[node.name]
        if (val === undefined) return `{${node.name}}`

        if (node.format === "percent") {
          return `${(Number(val) * 100).toFixed(0)}%`
        }
        return Number(val).toLocaleString()
      }

      case "date": {
        const val = params?.[node.name]
        if (val === undefined || typeof val !== "number") {
          return val !== undefined ? String(val) : `{${node.name}}`
        }
        return new Date(val).toLocaleDateString()
      }

      case "time": {
        const val = params?.[node.name]
        if (val === undefined || typeof val !== "number") {
          return val !== undefined ? String(val) : `{${node.name}}`
        }
        return new Date(val).toLocaleTimeString()
      }

      case "plural": {
        const val = params?.[node.name]
        const count = typeof val === "number" ? val : Number(val ?? 0)
        const adjusted = count - node.offset
        return this.compilePluralSelect(node.clauses, adjusted, params)
      }

      case "select": {
        const val = params?.[node.name]
        return this.compilePluralSelect(
          node.clauses,
          String(val ?? ""),
          params
        )
      }

      case "selectOrdinal": {
        const val = params?.[node.name]
        const count = typeof val === "number" ? val : Number(val ?? 0)
        return this.compilePluralSelect(node.clauses, count, params)
      }

      default:
        return ""
    }
  }

  private compilePluralSelect(
    clauses: Array<{ selector: string; content: ICUNode[] }>,
    value: number | string,
    params?: Record<string, string | number>
  ): string {
    const strValue = String(value)
    const pluralParams = {
      ...params,
      "#": String(value),
    }

    // 1. Check exact numeric match (=0, =1, etc.)
    for (const clause of clauses) {
      if (clause.selector.startsWith("=") && clause.selector.slice(1) === strValue) {
        return this.compileNodesReplaceHash(clause.content, pluralParams, value)
      }
    }

    // 2. Check exact selector match (for select/selectOrdinal as well as plural)
    const exactClause = clauses.find((c) => c.selector === strValue)
    if (exactClause) {
      return this.compileNodesReplaceHash(exactClause.content, pluralParams, value)
    }

    // 3. Check "one" for plural (value === 1)
    const numValue = typeof value === "number" ? value : Number(value)
    if (numValue === 1 && !isNaN(numValue)) {
      const oneClause = clauses.find((c) => c.selector === "one")
      if (oneClause) {
        return this.compileNodesReplaceHash(oneClause.content, pluralParams, value)
      }
    }

    // 4. Check "other" (catch-all)
    const otherClause = clauses.find((c) => c.selector === "other")
    if (otherClause) {
      return this.compileNodesReplaceHash(otherClause.content, pluralParams, value)
    }

    // 4. Fallback: just return the value
    return strValue
  }

  private compileNodesReplaceHash(
    nodes: ICUNode[],
    params?: Record<string, string | number>,
    pluralValue?: number | string
  ): string {
    return nodes
      .map((node) => {
        const compiled = this.compileNode(node, params)
        // Replace # with the plural value for literal nodes
        if (pluralValue !== undefined && node.type === "literal" && compiled.includes("#")) {
          return compiled.replace(/#/g, String(pluralValue))
        }
        return compiled
      })
      .join("")
  }

  private compileNodes(
    nodes: ICUNode[],
    params?: Record<string, string | number>
  ): string {
    return nodes.map((node) => this.compileNode(node, params)).join("")
  }
}

// Singleton
const defaultCompiler = new ICUCompiler()

/**
 * 编译 ICU MessageFormat 消息
 * @param message ICU 消息字符串
 * @param params 参数
 */
export function compileICUMessage(
  message: string,
  params?: Record<string, string | number>
): string {
  return defaultCompiler.compile(message, params)
}

/**
 * 检测字符串是否为 ICU MessageFormat 消息
 */
export function isICUMessage(text: string): boolean {
  // ICU messages contain {var, type, ...} pattern
  return /\{[\w]+\s*,\s*(plural|select|selectordinal|number|date|time)\b/.test(
    text
  )
}
