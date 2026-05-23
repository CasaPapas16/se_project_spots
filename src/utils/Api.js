class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "45b9d3fe-1801-414d-9383-20f51dd60d40",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

export default Api;
