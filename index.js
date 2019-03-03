const app = require('./app');
const cfg = require('./config/cfg');

app.listen(cfg.port, () => console.log(`Server has been started on ${cfg.port}`));