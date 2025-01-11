(async () => {
    const { chromium } = require("playwright")
    const Captcha = require("2captcha")

    const captchaKey = ""

    let month = new Date().getMonth() + 1
    const url = (month) =>
        `https://service2.diplo.de/rktermin/extern/appointment_showMonth.do?request_locale=es&locationCode=buen&realmId=541&categoryId=867&dateStr=14.0${month}.2022`
    let date = new Date().toLocaleString("es-AR", { timeZone: "America/Buenos_Aires" })
    console.log(`${date} - Starting...`)

    try {
        const browser = await chromium.launch()
        const page = await browser.newPage()

        const getDate = async () => {
            let anyDate = false
            let availableDate = ""
            const inputs = await page.locator(".wrapper div:not(:first-child)").allTextContents()
            for (let el of inputs) {
                anyDate = el.trim() !== "" && el.trim() !== "El texto introducido no es correcto"
                if (anyDate) {
                    availableDate = el.trim()
                    break
                }
            }
            console.log(anyDate, availableDate)
            return availableDate
        }

        await page.goto(url(month))
        const solver = new Captcha.Solver(captchaKey)
        const captchaImg = await page
            .locator("captcha div")
            .evaluate((el) => window.getComputedStyle(el).backgroundImage)
        const captcha = captchaImg.slice(5, -2)
        const captchaSolution = await solver.imageCaptcha(captcha)
        console.log(captchaSolution)
        const captchaCode = captchaSolution.data
        await page.locator("#appointment_captcha_month_captchaText").fill(captchaCode)
        await page.click("#appointment_captcha_month_appointment_showMonth")
        let date = ""
        for (let i = 0; i < 3; i++) {
            date = await getDate(page)
            console.log(date)
            if (date) break
            month++
            await page.goto(url(month))
        }
        if (date) {
            console.log(date)
        }
    } catch (error) {
        console.log(error)
    } finally {
        await browser.close()
    }
})()