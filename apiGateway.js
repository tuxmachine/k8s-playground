const express = require("express");
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const request = require("request");

const app = express();
const { AUTH_URL, POKEDEX_URL } = process.env;

const proxy = dest => (req, res) => {
  const method = req.method.toLowerCase();
  const headers = req.headers;
  const proxiedRequest = request[method](`${dest}${req.url}`, { headers });
  proxiedRequest.on("error", error =>
    res.status(500).json({ type: "upstream error", message: error.message })
  );
  req.pipe(proxiedRequest).pipe(res);
};

app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use("/auth", proxy(AUTH_URL));
app.use("/pokedex", proxy(POKEDEX_URL));
app.use(express.static('./public'));

app.listen(3000, () => {
  console.log(`API Gateway listening on port 3000`);
});
