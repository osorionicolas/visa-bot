(async () => {
    const { chromium } = require("playwright")

    const url = "https://www.cgeonline.com.ar/informacion/apertura-de-citas.html"

    let date = new Date().toLocaleString("es-AR", { timeZone: "America/Buenos_Aires" })
    console.log(`${date} - Starting...`)
    const browser = await chromium.launch()
    try {
        const page = await browser.newPage()
        await page.goto(url)
        const response = await page.textContent("tbody tr:nth-child(24) td:nth-child(3)")
        console.log(response)

        if (response !== "fecha por confirmar") {
            console.log(response)
        }
    } catch (error) {
        console.log(error)
    } finally {
        await browser.close()
    }
})()