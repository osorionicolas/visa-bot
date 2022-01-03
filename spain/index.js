const cron = require('node-cron')

var task = cron.schedule('* * * * *', async () => {
	const puppeteer = require('puppeteer')
	const nodemailer = require('nodemailer')
	const cron = require('node-cron')

	const transporter = nodemailer.createTransport({
		port: 25,
		host: "localhost"
	})
	
	const url = 'https://www.cgeonline.com.ar/informacion/apertura-de-citas.html'
	const sender = ''
	const receiver = ['']
	console.log(new Date().toLocaleString('es-AR', { timeZone: 'America/Buenos_Aires' }))
	console.log("Starting...")
    const browser = await puppeteer.launch({ headless: true })
	try {
		page = await browser.newPage()
		page.on('console', msg => {
			for (let i = 0; i < msg._args.length; ++i)
				console.log(`${i}: ${msg._args[i]}`)
		})
		await page.goto(url, {waitUntil: 'load'})
		console.log("Page loaded...")
		const response = await page.evaluate(() => {
			console.log("Checking date")
			let response = document.getElementById("contenido").querySelector("tbody tr:nth-child(2) td:nth-child(3)").textContent
			console.log(response)
			return response
		})
		if(response !== 'fecha por confirmar'){
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
				process.exit()
			  }
			})
		}
	} catch (err) {
		console.error(err.message)
	} 
	finally {
		await browser.close()
	}
})