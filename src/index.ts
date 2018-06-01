import * as esprima from 'esprima'
import * as escodegen from 'escodegen'
import { RegExpLiteral } from 'estree'

export interface IFogOptions {
  /** 变量前缀 */
  prefix?: string
}

export class Fog {
  /** 配置项 */
  options: IFogOptions

  constructor(options: IFogOptions = {}) {
    this.options = {
      /** 默认配置 */
      prefix: '$fog$',
      ...options,
    }
  }

  /**
   * 混淆代码
   * @param code 源代码
   */
  obfuscate(code: string): string {
    let program = esprima.parseScript(code)
    let literals = []

    const scan = (node, parent) => {
      if (!node) {
        return
      }

      // 字面量
      if (node.type === 'Literal') {
        // 正则表达式变为字符串
        if (node.regex) {
          let regex = (node as RegExpLiteral).regex
          let info = parent[parent.length - 1]
          info.parent[info.key] = {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'RegExp' },
            arguments: [
              {
                type: 'Literal',
                value: regex.pattern,
              },
              {
                type: 'Literal',
                value: regex.flags,
              },
            ],
          }
        } else {
          literals.push(node)
        }
      }

      // 成员访问
      if (node.type === 'MemberExpression') {
        if (node.property.type === 'Identifier') {
          node.property = {
            type: 'Literal',
            value: node.property.name,
          }
          node.computed = true
        }
      }

      // 递归扫描
      Object.keys(node).forEach(key => {
        let sub = node[key]
        if (typeof sub === 'object') {
          scan(
            sub,
            parent.concat([
              {
                key: key,
                parent: node,
              },
            ])
          )
        }
      })
    }

    /** TODO: 搜索需要处理的节点 */
    scan(program, [])

    /** TODO: 集中处理 */
    literals.forEach((literal, index) => {
      literal.type = 'Identifier'
      literal.name = `${this.options.prefix}${index}`
    })

    /** TODO: 添加修饰 */
    return escodegen.generate(program)
  }
}

/*<debug>*/
let fog = new Fog()
let code = fog.obfuscate(`
window.console.log('a')
`)
console.log(code)

// console.log(JSON.stringify(esprima.parseScript(code), null, '  '))
/*</debug>*/
