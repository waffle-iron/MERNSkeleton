/* eslint consistent-return:0 */

// Needed for developer defined process.env keys
require('dotenv').load(); // eslint-disable-line no-console

const mongoose = require('mongoose');
const express = require('express');
const logger = require('./logger');

const argv = require('minimist')(process.argv.slice(2));
const setup = require('../config/utils/middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;
const app = express();

// be -> fe helpers
const compression = require('compression');
const bodyParser = require('body-parser');
const { renderToString } = ('react-dom/server');
const { match } = ('react-router');
const { RouterContext } = ('react-router');

// backend routes
const skeletonRoutes = require('./routes/skeleton.routes');

// TODO: Add Webpack so that we can access via:
  // import seedDB = from '../config/utils/server/mongo/seed';
const seedDB = require('../config/utils/server/mongo/seed');

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
app.use('/skeleton', skeletonRoutes);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

const port = argv.port || process.env.PORT || 3000;

// connect to mongo
const mongoURL = (process.env.MONGO_USE_LOCAL === 'true')
  ? process.env.MONGO_LOCAL_URL
  : `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PW}@${process.env.MONGO_WEB_URL}${process.env.MONGO_DB}${process.env.MONGO_AUTH}`;
mongoose.connect(mongoURL, (error) =>
{
  if(error)
  {
    console.error('Please make sure Mongodb is installed and running!', error); // eslint-disable-line no-console
    throw error;
  }
  console.log('Mongo running at:\n\t', mongoURL); // eslint-disable-line no-console
  // feed some dummy data in DB.
  if(process.env.MONGO_SEED === 'true')
  { seedDB(); }
});


/*
app.use((req, res, next) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      return res.status(500).end(renderError(err));
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (!renderProps) {
      return next();
    }

    const store = configureStore();

    return fetchComponentData(store, renderProps.components, renderProps.params)
      .then(() => {
        const initialView = renderToString(
          <Provider store={store}>
            <IntlWrapper>
              <RouterContext {...renderProps} />
            </IntlWrapper>
          </Provider>
        );
        const finalState = store.getState();

        res
          .set('Content-Type', 'text/html')
          .status(200)
          .end(renderFullPage(initialView, finalState));
      })
      .catch((error) => next(error));
  });
});
*/

// Start your app.
app.listen(port, host, (err) =>
{
  if(err){ return logger.error(err.message); }

  // Connect to ngrok in dev mode
  if(ngrok)
  {
    ngrok.connect(port, (innerErr, url) =>
    {
      if(innerErr)
      {
        return logger.error(innerErr);
      }

      logger.appStarted(port, prettyHost, url);
    });
  }
  else
  {
    logger.appStarted(port, prettyHost);
  }
});
