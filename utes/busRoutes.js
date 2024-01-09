const axios = require('axios')
const NodeCache = require('node-cache')

const myCache = new NodeCache({ stdTTL: 300 }) //cache this for 5 minutes so I don't constantly have to make calls

// sort the routes in order Letters -> Numbers ascending
function sortRoutes(a, b) {
  const regex = /^([a-zA-Z]*)(\d*)$/;

  // Extract parts from 'Id'
  const [, aLetters = '', aNumbers = '0'] = a.id.match(regex) || [];
  const [, bLetters = '', bNumbers = '0'] = b.id.match(regex) || [];

  // Check if one has letters and the other doesn't
  if (aLetters && !bLetters) return -1; // a has letters and comes first
  if (!aLetters && bLetters) return 1;  // b has letters and comes first

  // If both have letters or both are numbers, compare the letter parts
  if (aLetters.toLowerCase() < bLetters.toLowerCase()) return -1;
  if (aLetters.toLowerCase() > bLetters.toLowerCase()) return 1;

  // If letters are equal, compare the number parts
  return parseInt(aNumbers, 10) - parseInt(bNumbers, 10);
}


async function fetchBusRoutes() {
  // Check if data is in cache
  const cachedData = myCache.get("busRoutes");
  if (cachedData) {
      return cachedData; // Return the cached data
  }

  // If not in cache, make the API call
  const response = await axios.get(process.env.ALL_ROUTES);


  const routesData = response.data.map(route => {
    return { name: route.Name, id: route.Id }; // Ensure 'Id' matches the API response
  });

  
  routesData.sort(sortRoutes)
  
  console.log("Processed Routes Data:", routesData); // Log the processed data

  // Save the processed data in the cache
  myCache.set("busRoutes", routesData);
  
  return routesData;
}

module.exports = fetchBusRoutes