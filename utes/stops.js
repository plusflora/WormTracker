const axios = require('axios');
const NodeCache = require('node-cache')

async function fetchStopsForRoute(routeId) {
  const apiUrl = `${process.env.ALL_STOPS}?routeId=${routeId}`;
  try {
      const response = await axios.get(apiUrl);

      // Extracting the relevant data
      const stopsData = response.data.Contents.dataObjects;
      
      const stopsArray = Array.isArray(stopsData) ? stopsData : [stopsData];

      return stopsArray;
  } catch (error) {
      console.error("Error fetching stops data:", error);
      throw error;
  }
}
// //fetch stops data based on routeId and display it
// document.addEventListener('DOMContentLoaded', () => {
//   document.querySelectorAll('.btn-primary').forEach(button => {
//     button.addEventListener('click', function(event) {
//       event.preventDefault();
//       const routeId = this.getAttribute('data-route-id');
//       window.location.href = `/stops/${routeId}`;
//     });
//   });
// });

module.exports = fetchStopsForRoute