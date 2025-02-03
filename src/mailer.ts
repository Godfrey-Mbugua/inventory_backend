import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendWelcomeEmail = async (email: string, username: string): Promise<void> => {
  try {
    const templatePath = path.join(__dirname, 'templates', 'welcome-email.ejs');
    const emailHtml = await ejs.renderFile(templatePath, { username });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to INVENTORY',
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export const sendClientConfirmationEmail = async (email: string, firstname: string, lastname: string): Promise<void> => {
  try {
    const templatePath = path.join(__dirname, 'templates', 'client-confirmation.ejs');
    const emailHtml = await ejs.renderFile(templatePath, { firstname, lastname });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Message Received - HANDS LIMITED',
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);
    console.log('Client confirmation email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending client confirmation email:', error);
    throw error;
  }
};

export const sendLowStockEmail = async (adminEmail: string, productName: string, currentStock: number, reorderLevel: number) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: 'Low Stock Alert',
    text: `Dear Admin,

The stock for the product "${productName}" is running low.

Current Stock: ${currentStock}
Reorder Level: ${reorderLevel}

Please take the necessary actions to restock the product.

Best regards,
Your Inventory Management System`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Low stock email sent successfully to:', adminEmail);
  } catch (error) {
    console.error('Error sending low stock email:', error);
    throw error;
  }
};

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP server connection error:', error);
  } else {
    console.log('SMTP server connection successful');
  }
});

// Function to check stock levels and send alert if below minimum
export const checkStockLevels = async (productName: string, currentStock: number, adminEmail: string) => {
  const MINIMUM_STOCK_LEVEL = 10;

  if (currentStock < MINIMUM_STOCK_LEVEL) {
    await sendLowStockEmail(adminEmail, productName, currentStock, MINIMUM_STOCK_LEVEL);
  }
};