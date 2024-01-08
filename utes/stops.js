// Logic to fetch stops data based on routeId and display it
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const routeId = urlParams.get('routeId');
  fetch(`/api/stops/${routeId}`)
    .then(response => response.json())
    .then(data => {
      // Logic to display stops information
    });
});