import { app } from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`Server on ${env.PORT} – Swagger: /api-docs`);
});
