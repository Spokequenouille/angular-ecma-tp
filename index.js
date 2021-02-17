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
    }).catch(fail => resolve(null));
  });
}

const getFox = () => {
  return new Promise(resolve => {
    axios.get('https://randomfox.ca/floof/')
    .then(res => {
      resolve(res.data.image)
    })
    .catch(fail => resolve(null));
  });
}

const getDayOffByCountry = (code ) => {
  return new Promise(resolve => {
    axios.get(`https://date.nager.at/api/v2/PublicHolidays/2021/${code}`)
    .then(res => {
      resolve(res.data)
    })
    .catch(fail => {
      resolve("null");
      console.log(fail)
    });
  });
};

const getAll = async(code) => {
  console.log('le code est : ' + code)
  const dayOffByCountry = await getDayOffByCountry(code);
  const fox = await getFox();
  const cat = await getCat();
  return Promise.all([cat, fox, dayOffByCountry]).then(() => {
    return{
      fox, cat, dayOffByCountry
    }
  })
}

app.post('/', async (req, res) => {
  console.log("ntm " +req.body.countryCode);
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