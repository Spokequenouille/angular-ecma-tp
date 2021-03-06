//Antoine Schulz

import fastify from 'fastify';
// see axios doc on how to use it
import axios from 'axios';

const app = fastify({ logger: true });

const getCat = () => {
  return new Promise( resolve => {
    axios.get('https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=3').then(res => {
      let catsFacts = [];
      res.data.forEach(element => {
        catsFacts.push(element.text);
      });
      resolve(catsFacts);
    }).catch(camarchepas => resolve(null));
  });
}

const getFox = () => {
  return new Promise(resolve => {
    axios.get('https://randomfox.ca/floof/')
    .then(res => {
      resolve(res.data.image)
    })
    .catch(camarchepas => resolve(null));
  });
}

const getDayOffByCountry = (countryCode ) => {
  return new Promise(resolve => {
    axios.get(`https://date.nager.at/api/v2/PublicHolidays/2021/${countryCode}`)
    .then(res => {
      resolve(res.data)
    })
    .catch(camarchepas => {
      resolve(null);
    });
  });
};

const getAll = async(countryCode) => {
  const holidays = await getDayOffByCountry(countryCode);
  const foxPicture = await getFox();
  const catFacts = await getCat();
  return Promise.all([catFacts, foxPicture, holidays]).then(() => {
    return{
      foxPicture, catFacts, holidays
    }
  })
}

app.post('/', async (req, res) => {
  return getAll(req.body.countryCode);
});

// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
