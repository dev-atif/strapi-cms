const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or another email service
  auth: {
    user: "atifali5410@gmail.com",
    pass: "ssodtqytifvmpdvc", // Make sure to use an app password for security
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error verifying transporter:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

// Function to send email
const sendEmail = async (
  to,
  subject,
  to_name,
  order_details,
  total_amount,
  orderId
) => {
  const rows = order_details
    .map(
      (item) => `
      <tr>
        <td>${item.product_name}</td>
        <td>${item.quantity}</td>
        <td>${item.Selected_Size ? item.Selected_Size : "N/A"}</td>
        <td>${item.Selected_Color ? item.Selected_Color : "N/A"}</td>
        <td>$${parseFloat(item.price).toFixed(2)}</td>
        <td>$${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  const htmlContent = `
    <html>
    <body>
      <h2>Order Confirmation</h2>
      <p>Dear ${to_name},</p>
      <p>Thank you for your order!</p>
      <p>Here are the details of your order:</p>
      <table border="1" cellpadding="10" cellspacing="0">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Size</th>
            <th>Color</th>
            <th>Price</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <p><strong>Total Amount: $${parseFloat(total_amount).toFixed(2)}</strong></p>
      <p>To confirm your order, please click the button below:</p>
      <a href="http://localhost:1337/api/orders/update/${orderId}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; border-radius: 5px;">
        Please Click Here to confirm Order
      </a>
      <p>Thank you for shopping with us!</p>
      <p>Best regards,</p>
      <p>Your Company Name</p>
    </body>
    </html>
  `;

  const mailOptions = {
    from: "atifali5410@gmail.com",
    to,
    subject,
    html: htmlContent,
  };

  const maxRetries = 3; // Number of times to retry sending the email
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}`);
      return; // Exit the function if the email is sent successfully
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        throw new Error("Error sending email after multiple attempts");
      }
      await new Promise((res) => setTimeout(res, 3000)); // Wait 3 seconds before retrying
    }
  }
};

// Lifecycle hook to send email after an order is created
module.exports = {
  async afterCreate(event) {
    const { result } = event;
    console.log(result); // Log the order result

    try {
      const order_details = result.Products; // Adjust according to your order structure
      const total_amount = result.Total_Amount; // Adjust according to your order structure
      const orderId = result.id; // Get the order ID

      // Ensure that the order_details is an array and total_amount is defined
      if (Array.isArray(order_details) && total_amount) {
        await sendEmail(
          result.Email,
          "Order Confirmation",
          result.Customer_Name,
          order_details,
          total_amount,
          orderId
        );
      } else {
        console.error(
          "Order details or total amount is not defined correctly."
        );
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  },
};
