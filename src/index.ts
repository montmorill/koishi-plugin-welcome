import type { Context, Session } from 'koishi'
import { h, Schema } from 'koishi'

export const name = 'welcome'

declare module 'koishi' {
  interface User {
    avatar?: string
  }
}

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  ctx.i18n.define('zh-CN', {
    added: '{at}，欢迎加入群聊！',
    removed: '{username}退出了群聊。',
  })

  function makeParams(session: Session): object {
    const avatar = (session.user as any)?.avatar
    return {
      user: session.user,
      userId: session.userId,
      username: session.username,
      avatar,
      img: h.img(avatar),
      at: h.at(session.userId),
      channel: session.channel,
      channelId: session.channelId,
      guild: session.guild,
      guildId: session.guildId,
    }
  }

  ctx.on('guild-member-added', async (session) => {
    await session.send(session.text('added', makeParams(session)))
  })

  ctx.on('guild-member-removed', async (session) => {
    await session.send(session.text('removed', makeParams(session)))
  })
}
