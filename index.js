import express from 'express';
import fs from 'fs';
import cors from 'cors'
import puppeteer from 'puppeteer';
import moment from 'moment';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(cors())

app.post('/generate-pdf', async (req, res) => {
  const { name,
    value,
    vehicle,
    registration,
    odometer,
    bond,
    rentStartDate,
    rentEndDate } = req.body;
  const today = moment().format('DD/MM/YYYY');

  const base64Image3 = fs.readFileSync(path.join(__dirname, 'img/image3.png'), { encoding: 'base64' });
  const base64Image2 = fs.readFileSync(path.join(__dirname, 'img/image2.png'), { encoding: 'base64' });
  const base64Image1 = fs.readFileSync(path.join(__dirname, 'img/image1.png'), { encoding: 'base64' });

  // Read the image file and convert it to a base64 string
  const html_template = fs.readFileSync(path.join(__dirname, './templates/Paymentvehicleconditions.html'), 'utf8');
  const replacedHtml = html_template
    .replace(/\{\{name\}\}/g, name)
    .replace(/\{\{value\}\}/g, value)
    .replace(/\{\{date\}\}/g, today)
    .replace(/\{\{vehicle\}\}/g, vehicle)
    .replace(/\{\{odometer\}\}/g, odometer.toLocaleString('en-US'))
    .replace(/\{\{bond\}\}/g, bond)
    .replace(/\{\{registration\}\}/g, registration)
    .replace(/\{\{rentStartDate\}\}/g, moment(rentStartDate, 'YYYY-MM-DD').format('DD/MM/YYYY'))
    .replace(/\{\{rentEndDate\}\}/g, moment(rentEndDate, 'DD/MM/YYYY').format('DD/MM/YYYY'))
    .replace(/\{\{base64Image3\}\}/g, base64Image3)
    .replace(/\{\{base64Image2\}\}/g, base64Image2)
    .replace(/\{\{base64Image1\}\}/g, base64Image1)

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.setContent(replacedHtml, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="terms_conditions_${name}_${today}.pdf"`);
    res.send(pdfBuffer);

    await browser.close();
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});