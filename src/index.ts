import type { Context, Session } from 'koishi'
import { h, Schema } from 'koishi'

export const name = 'welcome'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.i18n.define('zh-CN', {
    added: '{at}，欢迎加入群聊！',
    removed: '{username}退出了群聊。',
  })

  function makeParam(session: Session): object {
    return {
      userId: session.userId,
      username: session.username,
      user: session.user,
      channel: session.channel,
      guild: session.guild,
      at: h.at(session.userId),
    }
  }

  ctx.on('guild-member-added', async (session) => {
    const text = session?.text('added', makeParam(session))
    await session.send(text)
  })

  ctx.on('guild-member-removed', async (session) => {
    await session.send(session.text('removed', session))
  })
}
