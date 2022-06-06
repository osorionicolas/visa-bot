const cron = require("node-cron")
const nodemailer = require("nodemailer")
const { chromium } = require("playwright")

const url = "https://www.cgeonline.com.ar/informacion/apertura-de-citas.html"
const sender = ""
const receiver = [""]

cron.schedule("* * * * *", async () => {
    let date = new Date().toLocaleString("es-AR", { timeZone: "America/Buenos_Aires" })
    console.log(`${date} - Starting...`)
    try {
        const browser = await chromium.launch()
        const page = await browser.newPage()
        await page.goto(url)
        const response = await page.textContent("tbody tr:nth-child(24) td:nth-child(3)")
        console.log(response)

        if (response !== "fecha por confirmar") {
            const transporter = nodemailer.createTransport({
                port: 25,
                host: "localhost",
            })
            const mailOptions = {
                from: sender,
                to: receiver,
                subject: "Hay fechas disponibles para reprogramar tu visa!",
                text: `Hemos encontrado una fecha disponible para reprogramar tu visa el día: ${response}`,
            }
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error)
                } else {
                    console.log("Email sent: " + info.response)
                    process.exit()
                }
            })
            browser.close()
        }
    } catch (error) {
        console.log(error)
    }
})
