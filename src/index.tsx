import { Context, Schema, h, version } from 'koishi'
import { } from 'koishi-plugin-puppeteer'

const { version: pv } = require('../package.json')

export const name = 'imagify'

export interface Config {
  // maxLineCount: number
  maxLength: number
}

export const Config: Schema<Config> = Schema.object({
  // maxLineCount: Schema.number().min(1).default(600).description('当文本行数超过该值时转为图片'),
  maxLength: Schema.number().min(1).default(600).description('当返回的文本字数超过该值时转为图片')
})

export const using = ['puppeteer']

export function apply(ctx: Context, config: Config) {
  ctx.before('send', (session) => {
    if (h('', session.elements).toString(true).length > config.maxLength) {
      session.elements = [<html style={{
        color: '#ffffff',
        background: '#333333',
        padding: '1rem',
      }}>
        {session.elements}
        <footer>Generated by Koishi {version} / koishi-plugin-imagify v{pv}</footer>
      </html>]
    }
  }, true)
}
