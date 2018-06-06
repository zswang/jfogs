import * as esprima from 'esprima'
import * as escodegen from 'escodegen'
import {
  RegExpLiteral,
  Literal,
  BaseNode,
  Identifier,
  Property,
  ObjectExpression,
  MemberExpression,
  Program,
} from 'estree'

export interface IFogOptions {
  /** 变量前缀 */
  prefix?: string
  /** 全局变量 */
  globalVariables?: string[]
}

type ESNode =
  | Literal
  | RegExpLiteral
  | Property
  | ObjectExpression
  | MemberExpression
  | Program

/**
 * 父级路径
 */
interface IParentPath {
  key: string
  parent: ESNode
}

export class Fog {
  /** 配置项 */
  options: IFogOptions

  constructor(options: IFogOptions = {}) {
    this.options = {
      /** 默认配置 */
      prefix: '$fog$',
      globalVariables: [
        'console',
        'document',
        'window',
        'navigator',
        'screen',
        'sessionStorage',
        'localStorage',
        'Math',
        'RegExp',
      ],
      ...options,
    }
  }

  /**
   * 混淆代码
   * @param code 源代码
   */
  obfuscate(code: string): string {
    let program = esprima.parseScript(code)
    let literals: (Literal | Identifier)[] = []
    let objects: {
      node: ObjectExpression
      path: IParentPath[]
    }[] = []

    /**
     * 扫描语法元素
     * @param node 语法节点
     * @param path 节点上级路径
     */
    const scan = (node: ESNode, path: IParentPath[]) => {
      if (!node) {
        return
      }

      // #region 对象表达式
      if (node.type === 'ObjectExpression') {
        objects.push({
          node: node,
          path: path,
        })
      }
      // #endregion

      // #region 字面量
      if (node.type === 'Literal') {
        let info = path[path.length - 1]
        // 正则表达式变为字符串
        let regex = (node as RegExpLiteral).regex
        if (regex) {
          let pattern: Literal = {
            type: 'Literal',
            value: regex.pattern,
          }
          let flags: Literal = {
            type: 'Literal',
            value: regex.flags,
          }
          info.parent[info.key] = {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'RegExp' },
            arguments: regex.flags ? [pattern, flags] : [pattern],
          }
          literals.push(pattern, flags)
        } else {
          literals.push(node)
        }
      }
      // #endregion

      // #region 成员访问
      if (node.type === 'MemberExpression') {
        if (node.property.type === 'Identifier') {
          node.property = {
            type: 'Literal',
            value: node.property.name,
          }
          node.computed = true
        }
      }
      // #endregion

      // #region 递归扫描
      Object.keys(node).forEach(key => {
        let sub = node[key]
        if (typeof sub === 'object') {
          scan(
            sub,
            path.concat([
              {
                key: key,
                parent: node,
              },
            ])
          )
        }
      })
      // #endregion
    }

    // #region 搜索需要处理的节点
    scan(program, [])
    // #endregion

    // #region 拆分对象生成
    let path: IParentPath
    let queue = []
    objects.reverse().forEach((item, index) => {
      let body: IParentPath
      for (let i = item.path.length - 1; (path = item.path[i]); i--) {
        if (path.key === 'body') {
          body = item.path[i + 1]
          break
        }
      }
      if (body) {
        let statements = []
        let objIdentifier = {
          type: 'Identifier',
          name: `${this.options.prefix}o${index}`,
        }
        statements.push({
          type: 'VariableDeclaration',
          declarations: [
            {
              type: 'VariableDeclarator',
              id: objIdentifier,
              init: {
                type: 'ObjectExpression',
                properties: [],
              },
            },
          ],
          kind: 'var',
        })

        item.node.properties.forEach(propertie => {
          let literal =
            propertie.key.type === 'Identifier'
              ? {
                  type: 'Literal',
                  value: propertie.key.name,
                }
              : propertie.key
          literals.push(literal as Literal)
          statements.push({
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'MemberExpression',
                computed: true,
                object: objIdentifier,
                property: literal,
              },
              right: propertie.value,
            },
          })
        })

        queue.unshift(() => {
          ;[].splice.apply(body.parent, [body.key, 0].concat(statements))
        })
        path = item.path[item.path.length - 1]
        path.parent[path.key] = objIdentifier
      }
    })
    queue.forEach(fn => {
      fn()
    })
    // #endregion

    // 集中处理字面量
    literals.forEach((node, index) => {
      let identifier: Identifier = node as Identifier
      let literal: Literal = node as Literal
      identifier.type = 'Identifier'
      identifier.name = `${this.options.prefix}${index}`
    })

    /** TODO: 添加修饰 */

    // 生成代码
    return escodegen.generate(program)
  }
}

/*<debug>*/
let fog = new Fog()
let source = `
var a = { a: 1, b: { c: 3, d: 4 } }
`

let code = fog.obfuscate(source)
console.log(code)

// console.log(JSON.stringify(esprima.parseScript(source), null, '  '))
/*</debug>*/
