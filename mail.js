const fs = require("fs")
const path = require("path")
const auth = require("./config/auth.json")
const config = require("./config/config.json")
const nodemailer = require("nodemailer")
require("colors")

const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.secure,
    auth
})

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function sendMail(to, code) {
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            from: `${config.school.name} <${auth.user}>`,
            to,
            subject: `${config.school.name} t'invite sur son serveur discord`,
            html: fs.readFileSync(path.join(__dirname, "config", "template.html")).toString()
            .replace("CODE_HERE", code)
            .replace("SCHOOL_NAME", config.variables.SCHOOL_NAME)
            .replace("DISCORD_URL", config.variables.DISCORD_URL)
            .replace("URL_LOGO_HERE", config.variables.URL_LOGO_HERE),
            alternatives: [
                {
                    contentType: 'text/x-web-markdown',
                    content: fs.readFileSync(path.join(__dirname, "config", "template.md")).toString()
                    .replace("SCHOOL_NAME", config.variables.SCHOOL_NAME)
                    .replace("DISCORD_URL", config.variables.DISCORD_URL)
                    .replace("URL_LOGO_HERE", config.variables.URL_LOGO_HERE)
                }
            ]
        })
        .then(data => {
            resolve(data)
        })
        .catch(error => {
            reject(error)
        })
    })
}

async function main() {
    const list = fs.readFileSync(path.join(__dirname, "config", "mails.current.csv")).toString()
    const sessionId = Date.now()
    for (let i = 0; i < list.split("\n").length; i++) {
        const line = list.split("\n")[i]
        const mail = line.split(",")[0]
        const code = line.split(",")[1]
        try {
            await sendMail(mail, code)
            console.log("[" + "+".green + "] Mail sent to: " + mail.cyan.bold)
            fs.appendFileSync(path.join(__dirname, "history", `session-${sessionId}.txt`), "+" + mail + "\n")
            await delay(2000)
        } catch (error) {
            console.log(error)
            console.log("[" + "-".red + "] Mail not sent to: " + mail.cyan.bold)
            fs.appendFileSync(path.join(__dirname, "history", `session-${sessionId}.txt`), "-" + mail + "\n")
        }
    }
}

main()