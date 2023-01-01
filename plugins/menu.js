import { promises, readFileSync } from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'
import fetch from 'node-fetch'

let tags = {
  'main': 'Main',
  'rpg': 'RolePlay Games',
  'xp': 'Exp & Limit',
  'jadian': 'Jadian',
  'sticker': 'Sticker',
  'edukasi': 'Edukasi',
  'quran': 'Al Quran',
  'tools': 'Tools',
  'kerang': 'Kerang Ajaib',
  'primbon': 'Primbon',
  'fun': 'Fun',
  'game': 'Game',
  'genshin': 'GENSHIN IMPACT',
  'quotes': 'Quotes',
  'audio': 'Audio',
  'maker': 'Maker',
  'downloader': 'Downloader',
  'internet': 'Internet',
  'random': 'Random',
  'nsfw': 'Nsfw',
  'nulis': 'MagerNulis & Logo',
  'anonymous': 'Anonymous Chat',
  'database': 'Database',
  'admin': 'Admin',
  'group': 'Group',
  'vote': 'Voting',
  'absen': 'Absen',
  'premium': 'Premium',
  'advanced': 'Advanced',
  'info': 'Info',
  'owner': 'Owner',
  'jadibot': 'Jadi Bot',
  'host': 'Host',
  'Baileys': 'Baileys',
  'nocategory': 'No Category',
}

const defaultMenu = {
  before: `
Hai, %name! %ucapan

*Tanggal:* %week, %date
*Waktu:* %time
*Bot Uptime:* %uptime
*Pengguna:* %totalreg Orang
*Lib:* Baileys-Md
*Language:* Javascript,Ts-Node
*Fitur:* %totalfeatures command

%readmore
*Support me:* ${webs}
*Note:*
_Jika Respon Tidak Muncul Kemungkinan Terjadi Error_
`.trimStart(),
  header: `${cmenut} *%category* ${emojis}`,
  body: `┊${pmenus} %cmd %islimit %isPremium`,
  footer: `${cmenuf}`,
  after: `${cmenua}`,
}
let handler = async (m, { conn, groupMetadata, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let { exp, limit, level, role, money, lastclaim, lastweekly, registered, regTime, age, banned, pasangan } = global.db.data.users[who]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(who)
    let pp = await conn.profilePictureUrl(who).catch(_ => './src/avatar_contact.png')
    if (typeof global.db.data.users[who] == "undefined") {
      global.db.data.users[who] = {
        exp: 0,
        limit: 10,
        lastclaim: 0,
        registered: false,
        name: conn.getName(m.sender),
        age: -1,
        regTime: -1,
        afk: -1,
        afkReason: '',
        banned: false,
        level: 0,
        lastweekly: 0,
        role: 'Warrior V',
        autolevelup: false,
        money: 0,
        pasangan: "",
      }
     }
     let math = max - xp
    let totalfeatures = Object.values(global.plugins).filter(
    (v) => v.help && v.tags
  ).length;
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? 'Ⓛ' : '')
                .replace(/%isPremium/g, menu.premium ? '🅟' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: conn.getName(conn.user.jid),
      npmname: _package.name,
      npmdesc: _package.description,
      version: _package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
      level, totalfeatures, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role, ucapan,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    let pusat = ["ke1", "ke2", "ke3", "ke4", "ke5", "ke6", "ke7", "ke8"]
let pilih = pusat.getRandom()
if (pilih == "ke1") {
	await conn.send2ButtonDoc(m.chat, text.trim(), author, emojis + ' All Menu', _p + 'allmenu', emojis + ' List Menu', _p + 'menulist', fakes, fakefb)
}
if (pilih == "ke2") {
	await conn.send2ButtonLoc(m.chat, knimg, text.trim(), author, emojis + ' All Menu', _p + 'allmenu', emojis + ' List Menu', _p + 'menulist', fakes, fakefb)
}
if (pilih == "ke3") {
	await conn.send2ButtonImg(m.chat, knimg, text.trim(), author, emojis + ' All Menu', _p + 'allmenu', emojis + ' List Menu', _p + 'menulist', fakes, fakefb)
}
if (pilih == "ke4") {
	await conn.send2ButtonVid(m.chat, knimg, text.trim(), author, emojis + ' All Menu', _p + 'allmenu', emojis + ' List Menu', _p + 'menulist', fakes, fakefb)
}
if (pilih == "ke5") {
	await conn.sendTemplateButtonDoc(m.chat, knimg, text.trim(), author, emojis + ' List Menu', _p + 'menulist', fakes, fakefb)
}
if (pilih == "ke6") {
	await conn.sendTemplateButtonLoc(m.chat, knimg, text.trim(), author, emojis + ' List Menu', _p + 'menulist', fakes, fakefb)
}
if (pilih == "ke7") {
	await conn.send2TemplateButtonFakeImg(m.chat, knimg, text.trim(), author, emojis + ' All Menu', _p + 'allmenu', emojis + ' List Menu', _p + 'menulist', fakes, fakefb)
}
if (pilih == "ke8") {
	let btn = [{
		urlButton: {
			displayText: 'Chat Owner',
			url: 'https://wa.me/' + nomorown
		}
	}, {
		quickReplyButton: {
			displayText: emojis + ' All Menu',
			id: _p + 'allmenu'
		}
	}, {
		quickReplyButton: {
			displayText: emojis + ' List Menu',
			id: _p + 'menulist'
		}
	}]
	await conn.sendButtonGif(m.chat, text.trim(), wm, {
		url: global.giflogo
	}, btn, knimg)
}
// Sound
await conn.sendFile(m.chat, 'https://raw.githubusercontent.com/saipulanuar/Api-Github/main/audio/bot.mp3', '', '', m)
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}

handler.command = /^(allmenu|help|\?)$/i

handler.exp = 3

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return ['\n' + d, ' *Days ☀️*\n ', h, ' *Hours 🕐*\n ', m, ' *Minute ⏰*\n ', s, ' *Second ⏱️* '].map(v => v.toString().padStart(2, 0)).join('')
}

function pickRandom(list) {
     return list[Math.floor(Math.random() * list.length)]
  }