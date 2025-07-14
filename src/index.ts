import express from 'express';
import serverless from 'serverless-http';
import router from './interfaces/router';

const app = express();

app.use(express.json());
app.use('/api', router);

// Manejador para AWS Lambda
export const handler = serverless(app);

// Para desarrollo local
if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/api`);
  });
}