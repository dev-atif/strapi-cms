module.exports = {
  routes: [
    {
      method: "GET",
      path: "/orders/update/:id", // Custom endpoint to find an order by ID
      handler: "order.UpdatebyId", // Reference to the custom controller method
      config: {
        auth: false, // Set to true if authentication is required
      },
    },
  ],
};
