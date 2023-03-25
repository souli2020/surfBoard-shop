const SibApiV3Sdk = require('sib-api-v3-sdk');

const sendTransactionalEmail = async (req, res, user, templateId, token, redirect, success, error) => {

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.to = [{
        email: user.email,
        name: user.username,
    }];

    sendSmtpEmail.templateId = templateId;

    if (token) {
        sendSmtpEmail.params = {
            reset_link: `http://${req.headers.host}/reset/${token}`,
            username: user.username,
        };
    } else {
        sendSmtpEmail.params = {
            username: user.username,
        };
    }
    try {

        await apiInstance.sendTransacEmail(sendSmtpEmail)
        if (req && res && success) {

            req.session.success = success;
            res.redirect(redirect)
        }
    } catch (err) {
        if (req && res && error) {
            console.log(err);
            req.session.error = error;
            res.redirect(redirect)
        }
    }
}
module.exports = sendTransactionalEmail;