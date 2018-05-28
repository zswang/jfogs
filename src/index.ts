import * as esprima from 'esprima'
import * as escodegen from 'escodegen'

export interface IFogOptions {}

export class Fog {
  /** 配置项 */
  options: IFogOptions

  constructor(options: IFogOptions = {}) {
    this.options = {
      /** 默认配置 */
      ...options,
    }
  }

  /**
   * 混淆代码
   * @param code 源代码
   */
  obfuscate(code: string): string {
    let program = esprima.parseScript(code)
    /** TODO: 搜索需要处理的节点 */
    /** TODO: 集中处理 */
    /** TODO: 添加修饰 */
    return escodegen.generate(program)
  }
}

/*<debug>*/
let fog = new Fog()
let code = fog.obfuscate(`
var o = { a: 1, b: 2, c: 3 }
`)
console.log(code)
/*</debug>*/
