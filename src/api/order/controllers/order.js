"use strict";

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async UpdatebyId(ctx) {
    const { id } = ctx.params;

    try {
      // Find the order by ID
      const entity = await strapi.db.query("api::order.order").findOne({
        where: { id },
      });

      // If the entity is not found, respond with a 404 status
      if (!entity) {
        return ctx.notFound("Order not found");
      }

      const updatedEntity = await strapi.db.query("api::order.order").update({
        where: { id },
        data: { Order_Status: "Confirm" }, // Set the order status to "confirm"
      });
          const congratulationsMessage = `
        <html>
          <body>
            <h2 style="color: green;">Congratulations!</h2>
            <p style="font-size: 18px;">Your order has been successfully confirmed.</p>
            <p style="font-weight: bold;">Thank you for choosing us!</p>
          </body>
        </html>
      `;
      return ctx.send(congratulationsMessage);
    } catch (error) {
      // Handle any errors that occur during the fetch
      return ctx.internalServerError("Error occurred while fetching the order");
    }
  },
}));
