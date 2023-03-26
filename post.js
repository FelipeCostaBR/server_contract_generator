const data = {
  name: 'John Doe',
  value: 1000,
  vehicle: 'Toyota Corolla',
  registration: 'ABCD-1234',
  odometer: 12000,
  bond: 500,
  rentStartDate: '2023-04-01',
  rentEndDate: '2023-04-30'
};

fetch('https://server-contract-generator.vercel.app/generate-pdf', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
  .then(response => response.blob())
  .then(blob => {
    // Download the generated PDF
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'contract.pdf';
    link.click();
  })
  .catch(error => {
    console.error('Error generating contract:', error);
  });
