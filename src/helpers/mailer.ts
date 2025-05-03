import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import { connect } from '@/dbconfig/dbconfig';
import crypto from 'crypto';

connect();

interface SendEmailParams {
    email: string;
    emailType: 'VERIFY' | 'RESET';
}

export const sendEmail = async ({ email, emailType }: SendEmailParams) => {
    try {
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await bcryptjs.hash(rawToken, 10);
        const updateFields =
            emailType === 'VERIFY'
                ? { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }
                : { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 };

        const user = await User.findOneAndUpdate({email}, updateFields, { new: true });
        if(!user) throw new Error('User not found');

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
            from: `no-reply@full-stack-authentication-system.vercel.app`,
            to: email,
            subject,
            html: `<p>Please ${actionText.toLowerCase()} by clicking the link below:</p>
                <a href="${process.env.DOMAIN}/auth/${linkPath}?token=${rawToken}">${actionText}</a>`,
        };

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
    } catch (error) {
        const err = error as Error;
        throw new Error(err.message);
    }
};
