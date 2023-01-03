import fetch from 'node-fetch'
import { youtubeSearch } from '@bochilteam/scraper'
let handler = async (m, { conn, groupMetadata, usedPrefix, text, args, command }) => {
  if (!text) throw `Use example ${usedPrefix}${command} gustixa`
  let ply = await youtubeSearch(text)
  let vid = ply.video[0]
  if (!vid) throw 'Video/Audio Tidak ditemukan'
  let { title, description, thumbnail, videoId, durationH, viewH, publishedTime } = vid
  const url = 'https://www.youtube.com/watch?v=' + videoId
  let des = `*YOUTUBE DOWNLOADER*
📌 *Title:* ${title}
🔗 *Url:* ${url}
🖹 *Description:* ${description}
⏲️ *Published:* ${publishedTime}
⌚ *Duration:* ${durationH}
👁️ *Views:* ${viewH}
  `.trim()
  await conn.sendButton(m.chat, des, wm, thumbnail, [
   ['Audio 🎧', `${usedPrefix}yta ${url} yes`],
   ['Video 🎥', `${usedPrefix}ytv ${url} yes`]
   ], m)

}
handler.help = ['play', 'play'].map(v => v + ' <pencarian>')
handler.tags = ['downloader']
handler.command = /^(y((outube|((utu|t)b|t))play|tp)|play(yt)?)$/i

handler.exp = 0
handler.limit = false

export default handler

async function shortUrl(url) {
  url = encodeURIComponent(url)
  let res = await fetch(`https://is.gd/create.php?format=simple&url=${url}`)
  if (!res.ok) throw false
  return await res.text()
}
