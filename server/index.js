const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const exceljs = require('exceljs');

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
  host: '103.92.235.85',
  user: 'yatayati_trial',
  password: 'yatayati_trial',
  database: 'yatayati_trial'
});


app.post('/items', (req, res) => {
  const { sno, customername, shippingorder, carrier, tracking } = req.body;
  const sqlInsert = "INSERT INTO sales_table (sno, customername, shippingorder, carrier, tracking) VALUES (?, ?, ?, ?, ?)";
  const values = [sno, customername, shippingorder, carrier, tracking];

  connection.query(sqlInsert, values, (err, result) => {
    if (err) {
      console.error('Error inserting data: ' + err.stack);
      res.status(500).json({ error: 'Error inserting data into database' });
      return;
    }
    console.log('Data inserted successfully');
    res.status(200).json({ message: 'Data inserted successfully' });
  });
});

app.get('/items', (req, res) => {
    connection.query('SELECT * FROM sales_table', (error, results, fields) => {
      if (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data from database' });
      } else {
        console.log('Data fetched successfully');
        res.status(200).json(results); 
      }
    });
  });
  app.put('/items/:sno', (req, res) => {
    const sno = req.params.sno;
    const { customername, shippingorder, carrier, tracking } = req.body;
    const sql = `UPDATE sales_table SET customername = ?, shippingorder = ?, carrier = ?, tracking = ? WHERE sno = ?`;
    connection.query(sql, [customername, shippingorder, carrier, tracking, sno], (err, result) => {
      if (err) {
        console.error('Error updating item:', err);
        res.status(500).json({ error: 'Error updating item' });
      } else {
        console.log('Item updated successfully');
        res.status(200).json({ message: 'Item updated successfully' });
      }
    });
  });
  app.delete('/items/:sno', (req, res) => {
    const sno = req.params.sno;
    const sql = `DELETE FROM sales_table WHERE sno = ?`;
    connection.query(sql, sno, (err, result) => {
      if (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ error: 'Error deleting item' });
      } else {
        console.log('Item deleted successfully');
        res.status(200).json({ message: 'Item deleted successfully' });
      }
    });
  });

  app.get('/download', (req, res) => {
    connection.query('SELECT id, sno, customername, shippingorder, carrier, tracking FROM sales_table', (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ error: 'Error fetching data' });
      }
  
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Data');
  
      worksheet.addRow(['ID', 'S.No', 'Customer Name', 'Shipping Order', 'Carrier', 'Tracking']);
  
      results.forEach(row => {
        worksheet.addRow([row.id, row.sno, row.customername, row.shippingorder, row.carrier, row.tracking]);
      });
  
      workbook.xlsx.writeBuffer()
        .then(buffer => {
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=items.xlsx');
          res.send(buffer);
        })
        .catch(err => {
          console.error('Error writing Excel file:', err);
          res.status(500).json({ error: 'Error writing Excel file' });
        });
    });
  });
  
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
