const controllers = require('./controllers');

const router = (app) => {
  app.get('/page1', controllers.page1);
  app.get('/page2', controllers.page2);
  app.get('/page3', controllers.page3);
  app.get('/page4', controllers.page4);
  app.get('/getName', controllers.getName);
  app.get('/findByName', controllers.searchName);

  app.get('/', controllers.index);

  app.get('/*', controllers.notFound);

  app.post('/setName', controllers.setName);

  app.post('/updateLast', controllers.updateLast);

  app.get('/getDogName', controllers.getDogName);
  app.get('/findByDogName', controllers.searchDogName);
  app.post('/setDogName', controllers.setDogName);
  app.post('/updateDogLast', controllers.updateDogLast);
};

// export the router function
module.exports = router;
