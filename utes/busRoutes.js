const axios = require('axios')
const NodeCache = require('node-cache')

const myCache = new NodeCache({ stdTTL: 300 }) //cache this for 5 minutes so I don't constantly have to make calls

async function fetchBusRoutes() {
  // Check if data is in cache
  const cachedData = myCache.get("busRoutes");
  if (cachedData) {
      console.log("Returning cached data:", cachedData);
      return cachedData; // Return the cached data
  }

  // If not in cache, make the API call
  const response = await axios.get(process.env.ALL_ROUTES);
  console.log("API Response:", response.data); // Log the raw API response

  const routesData = response.data.map(route => {
      return { name: route.Name, id: route.id };
  });

  console.log("Processed Routes Data:", routesData); // Log the processed data

  // Save the processed data in the cache
  myCache.set("busRoutes", routesData);

  return routesData;
}

module.exports = fetchBusRoutes