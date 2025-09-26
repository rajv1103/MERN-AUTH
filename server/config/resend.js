import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Wrap sendMail in an async function
export const sendWelcomeEmail = async ({ to, name }) => {
  try {
    const data = await resend.emails.send({
      from: "MERN_AUTH <onboarding@resend.dev>",
      to,
      subject: "🎉 Welcome to MERN_AUTH!",
      text: `
Hi ${name},

We're thrilled to welcome you to MERN_AUTH! Your account has been successfully created.

📧 Registered Email: ${to}

Feel free to explore and reach out if you need help.

Warm regards,  
The MERN_AUTH Team
      `,
    });

    console.log("✅ Email sent successfully:", data);
    return { success: true, data };
  } catch (err) {
    console.error("❌ Email sending failed:");
    return { success: false, error: err };
  }
};

export const verifyEmail = async ({ to, name, otp }) => {
  try {
    const data = await resend.emails.send({
      from: "MERN_AUTH <onboarding@resend.dev>",
      to,
      subject: "Verification",
      text: `Hi ${name},
      
We're welcome you to MERN_AUTH! Your Otp is : ${otp}
Warm regards,  
The MERN_AUTH Team
      `,
    });
    console.log("✅ Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Email sending failed:");
    return { success: false, error: err };
  }
};

export const resetOtpMail = async ({ to, name, otp }) => {
  try {
    const data = await resend.emails.send({
      from: "MERN_AUTH <onboarding@resend.dev>",
      to,
      subject: "Verification",
      text: `Hi ${name},
      
We're welcome you to MERN_AUTH! Your Reset Otp is : ${otp}
Warm regards,  
The MERN_AUTH Team
      `,
    });
    console.log("✅ Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Email sending failed:");
    return { success: false, error: err };
  }
};