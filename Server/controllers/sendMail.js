const nodemailer = require('nodemailer')
const {google} = require('googleapis')
const {OAuth2} = google.auth;
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

/*const {
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS
} = process.env*/

const MAILING_SERVICE_CLIENT_ID = '395683594204-pj1one08odudqfbbktao8clgr53n63lj.apps.googleusercontent.com'
const MAILING_SERVICE_CLIENT_SECRET = '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'
const MAILING_SERVICE_REFRESH_TOKEN = '1//04GxiXhgJ6ggWCgYIARAAGAQSNwF-L9IrL9gV-p1rRcHceJcI0cZWK0lxT5q-R4NgrODq6yCpKB8iqi2ttFbWTxiJ9DvTuxI3O60'
const SENDER_EMAIL_ADDRESS = 'lakshanshami27@gmail.com'

const oauth2Client = new OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    OAUTH_PLAYGROUND
)

//send mail
const sendEmail = (to, url) => {

    oauth2Client.setCredentials({
        refresh_token: MAILING_SERVICE_REFRESH_TOKEN
    })

    const accessToken = oauth2Client.getAccessToken()
    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            accessToken
        }
    })

    const mailOptions = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: "FitUS Gym Management System",
        html:`

        <div>${url}</div>
        
        `

    }

    smtpTransport.sendMail(mailOptions, (err, infor) =>{
        if(err) return err;
        return infor
    })

}

module.exports = sendEmail