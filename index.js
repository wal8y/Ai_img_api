import express from 'express';
import Replicate from 'replicate';
import dotenv from 'dotenv';

dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
});

const app = express();

app.use((req, res, next) => {
  console.log(`Request from IP: ${req.ip}`);
  next();
});

app.use(express.static('public'));
app.use(express.json());

app.post('/runReplicate', async (req, res) => {
  try {
    const { model, input } = req.body;
    const output = await replicate.run(model, { input });
    res.json(output);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
