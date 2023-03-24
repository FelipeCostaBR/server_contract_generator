import express from 'express';
import fs from 'fs';
import cors from 'cors'
import pdf from 'html-pdf';
import path from 'path'



const app = express();

app.use(express.json())
app.use(cors())
app.post('/generate-pdf', (req, res) => {

  const { name } = req.body;
  const { value } = req.body;
  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });


  const base64Image3 = fs.readFileSync('img/image3.png', { encoding: 'base64' });
  const base64Image2 = fs.readFileSync('img/image2.png', { encoding: 'base64' });
  const base64Image1 = fs.readFileSync('img/image1.png', { encoding: 'base64' });

  // Read the image file and convert it to a base64 string

  const html_template = fs.readFileSync('./templates/Paymentvehicleconditions.html', 'utf8');
  const replacedHtml = html_template.replace(/\{\{name\}\}/g, name).replace(/\{\{value\}\}/g, value)
    .replace(/\{\{date\}\}/g, formattedDate)
    .replace(/\{\{base64Image3\}\}/g, base64Image3)
    .replace(/\{\{base64Image2\}\}/g, base64Image2)
    .replace(/\{\{base64Image1\}\}/g, base64Image1)


  pdf.create(replacedHtml).toFile('output.pdf', (err, buffer) => {
    if (err) return console.log(err);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
    res.json({ result: "success" })

  });
});

app.listen(3333, () => {
  console.log('App listening on port 3333!');
});