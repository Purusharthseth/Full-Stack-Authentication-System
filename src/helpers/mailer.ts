import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import { connect } from '@/dbconfig/dbconfig';

connect();

interface SendEmailParams {
    email: string;
    emailType: 'VERIFY' | 'RESET';
    userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailParams) => {
    try {
        const hashedToken = await bcryptjs.hash(userId, 10);

        const updateFields =
            emailType === 'VERIFY'
                ? { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }
                : { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 };

        await User.findByIdAndUpdate(userId, updateFields, { new: true });

        const transport = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: Number(process.env.MAILTRAP_PORT),
            auth: {
                user: process.env.MAILTRAP_USER!,
                pass: process.env.MAILTRAP_PASS!,
            },
        });

        const linkPath = emailType === 'VERIFY' ? 'verify' : 'reset';
        const subject = emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password';
        const actionText = emailType === 'VERIFY' ? 'Verify Email' : 'Reset Password';

        const mailOptions = {
            from: 'purusharth2@gmail.com',
            to: email,
            subject,
            html: `<p>Please ${actionText.toLowerCase()} by clicking the link below:</p>
                <a href="${process.env.DOMAIN}/auth/${linkPath}?token=${hashedToken}">${actionText}</a>`,
        };

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
    } catch (error) {
        const err = error as Error;
        throw new Error(err.message);
    }
};
