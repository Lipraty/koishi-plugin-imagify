import { Context, Schema, h, version } from 'koishi'
import { } from 'koishi-plugin-puppeteer'

const { version: pv } = require('../package.json')

export const name = 'imagify'

export interface Config {
  maxLineCount: number
  maxLength: number
  background: string
  blur: number
}

export const Config: Schema<Config> = Schema.object({
  maxLineCount: Schema.number().min(1).default(20).description('当文本行数超过该值时转为图片'),
  maxLength: Schema.number().min(1).default(600).description('当返回的文本字数超过该值时转为图片'),
  background: Schema.string().role('link').description('背景图片地址，以 http(s):// 开头'),
  blur: Schema.number().min(1).max(10).default(3).description('文本卡片模糊程度')
})

export const using = ['puppeteer']

export function apply(ctx: Context, config: Config) {
  const htmlStyle = {
    'font-size': '1.3rem',
    padding: '1rem',
    background: `${config.background ? `url(${config.background})` : '#fff'} `,
  }
  const pStyle = {
    'margin': '12px 22px 12px 22px',
  }
  const cardStyle = {
    'backdrop-filter': `blur(${config.blur}px)`
  }
  const footerStyle = {
    'font-size': '0.85rem',
    background: '#333333',
    color: '#ffffff',
    padding: '18px',
    margin: '0 -1rem -1rem -1rem'
  }

  ctx.before('send', (session) => {
    let contentMapper = [session.content]
    if (session.content.includes('\n')) {
      contentMapper = session.content.split('\n')
    }
    if (h('', session.elements).toString(true).length > config.maxLength || contentMapper.length > config.maxLineCount) {
      session.elements = [<html style={htmlStyle}>
        <div style={cardStyle}>
          {contentMapper.map(ele => <p style={pStyle}>{ele}</p>)}
        </div>
        <footer style={footerStyle}>Generated by Koishi {version} / koishi-plugin-imagify v{pv}</footer>
      </html>]
    }
  })
}
