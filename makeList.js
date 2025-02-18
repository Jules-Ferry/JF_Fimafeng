const fs = require("fs")
const path = require("path")
const config = require("./config/config.json")
const givedCode = []

function generateCSV() {
    const members = JSON.parse(fs.readFileSync(path.join(__dirname, "config", "members.current.json")))
    const lines = []
    for (let i = 0; i < members.length; i++) {
        const member = members[i]
        const mail = `${member.name}.${member.family_name}@${config.mail.studentsHost}`.toLowerCase().split(" ").join("")
        lines.push(`${mail},${makeid(5)}`)
    }
    fs.writeFileSync(path.join(__dirname, "config", "mails.current.csv"), lines.join("\r\n"))
}

function makeid(length) {
    let result = ""
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const charactersLength = characters.length
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
        counter += 1
    }
    if (givedCode.includes(result)) {
        return makeid(length)
    } else {
        return result
    }
}

generateCSV()