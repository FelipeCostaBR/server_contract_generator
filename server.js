import express from 'express';
import fs from 'fs';
import cors from 'cors'
import pdf from 'html-pdf';
import moment from 'moment';
const app = express();

app.use(express.json())
app.use(cors())

app.get('/home', (req, res) => {
  res.json({ result: 'IT IS OKAY' })
})

app.post('/generate-pdf', (req, res) => {
  const { name,
    value,
    vehicle,
    registration,
    odometer,
    bond,
    rentStartDate,
    rentEndDate } = req.body;
  const today = moment().format('DD/MM/YYYY');

  const base64Image3 = fs.readFileSync('img/image3.png', { encoding: 'base64' });
  const base64Image2 = fs.readFileSync('img/image2.png', { encoding: 'base64' });
  const base64Image1 = fs.readFileSync('img/image1.png', { encoding: 'base64' });

  // Read the image file and convert it to a base64 string
  const html_template = fs.readFileSync('./templates/Paymentvehicleconditions.html', 'utf8');
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

  pdf.create(replacedHtml).toStream((err, stream) => {
    if (err) return res.sendStatus(500);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
    stream.pipe(res);
  });
});

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});