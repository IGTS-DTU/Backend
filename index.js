import express from 'express';
import cors from 'cors';

import dinersRouter from './routes/diners.js';
import ubaRouter from './routes/uba.js';
import finalRouter from './routes/final.js';
const app = express();
const PORT = process.env.PORT || 3000; // Define PORT with fallback to 3000

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/diners', dinersRouter);
app.use('/uba', ubaRouter);
app.use('/final',finalRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
