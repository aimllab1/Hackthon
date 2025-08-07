document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("submit-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;

    fetch('https://script.google.com/macros/s/AKfycbzOyGUFSm_WZ_GUjMkYEbud4H3iXu-gVbpCzOhrbU3Hlkb1dr6FLPjyEmxU8E5kvTqT5g/exec', {
      method: 'POST',
      body: new URLSearchParams({ name, email }), // Google Apps Script expects form-like data
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    .then(res => {
      if (res.ok) {
        alert("Thank you! You’ll receive an email soon.");
        form.reset();
      } else {
        throw new Error("Network response was not ok.");
      }
    })
    .catch(err => {
      alert("Submission failed. Please try again.");
      console.error(err);
    });
  });
});
