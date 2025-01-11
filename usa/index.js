const puppeteer = require('puppeteer')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    port: 25,
    host: "localhost"
})

const url = 'https://url/'
const username = 'username'
const password = 'password'
const sender = ''
const receiver = [''] 
console.log("Starting...")
const browser = await puppeteer.launch({ headless: false })
try {
    page = await browser.newPage()
    page.on('console', msg => {
        for (let i = 0; i < msg._args.length; ++i)
            console.log(`${i}: ${msg._args[i]}`)
    })
    await page.goto(url, {waitUntil: 'load'})
    console.log("Page loaded...")
    await page.evaluate(() => {
        console.log("Executing login")
        document.getElementById("user_email").value = username
        document.getElementById("user_password").value = password
        document.querySelector('.icheckbox').click()
        document.querySelector('[name=commit]').click()
        return
    })
    console.log("Waiting for navigation")
    await page.waitForNavigation({waituntil: 'domcontentloaded'})
    console.log("Going to appoinment page")
    await page.goto(url, {waitUntil: 'load'})
    const response = await page.evaluate(async () => {
        const findAvailableDate = async (number) => {
            const availableDates = document.querySelectorAll('[data-handler=selectDay]')
            console.log(number, availableDates)
            if(availableDates.length == 0 && number < 7){
                while(!document.querySelector('[data-handler=next]')) {
                    await new Promise(r => setTimeout(r, 500));
                }
                const nextBtn = document.querySelector('[data-handler=next]')
                console.log(nextBtn)
                nextBtn.click()
                setTimeout(() => findAvailableDate(number + 1), 500)
            }
            else {
                console.log(availableDates)
                const dates = [...availableDates].filter(date => {
                    const data = date.dataset
                    console.log(date, date.dataset)
                    return data.year == 2021 || (data.month > 1 && data.year == 2022)
                })
                const availableDate = dates.length > 0 ? dates[0] : null
                console.log(availableDate)
                if(availableDate){
                    const date = `${availableDate.innerText}/${+availableDate.dataset.month + 1}/${availableDate.dataset.year}`
                    console.log(`Sending email. Date: ${date}`)
                    return date
                }
            }
        }
        document.querySelectorAll("[role=button]")[1].click()
        console.log("Verifying dates")
        if(document.getElementById("asc_date_time_not_available")) return
        while(!document.getElementById("appointments_asc_appointment_date")) {
            await new Promise(r => setTimeout(r, 500));
        }
        document.getElementById("appointments_asc_appointment_date").click()
        return findAvailableDate(0)
    })
    console.log(response)
    if(response){
        const mailOptions = {
            from: sender,
            to: receiver,
            subject: 'Hay fechas disponibles para reprogramar tu visa!',
            text: `Hemos encontrado una fecha disponible para reprogramar tu visa el día: ${response}`
        }
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error)
            } else {
            console.log('Email sent: ' + info.response)
            }
        })
    }
} catch (err) {
    console.error(err.message)
} 
finally {
    await browser.close()
}
