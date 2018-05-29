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

    const scan = (node, parent) => {
      if (!node) {
        return
      }
      if (node.type === 'Literal') {
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
        }
      }
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

    scan(program, [])
    /** TODO: 搜索需要处理的节点 */
    /** TODO: 集中处理 */
    /** TODO: 添加修饰 */
    return escodegen.generate(program)
  }
}

/*<debug>*/
let fog = new Fog()
let code = fog.obfuscate(`
var o = { a: 1, b: 2, c: /[\\w&]+a\\n/ }
`)
console.log(code)
/*</debug>*/
