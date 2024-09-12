var buildTemplate = (email, activation_link) => {
    var template = {
        from: 'Oros Capital Tridex <no-reply@orostridex.com',
        to: `${email}`,
        subject: 'Oros Capital Tridex - Account activation',
        html: `
            <div style="margin: 3rem; padding: 1rem; border-radius: 5px; box-shadow: 0rem 0rem 0.6rem 0rem #CCC;">
                <p>Hi there, <br /></p>
                <b>You have request a password reset link, kindly ignore this mail if you did not initiate a password request</b> <br />
                <p>
                    To reset your account please click the link below to verify your email reset link
                </p>

                <a href="${activation_link}">
                    Click here to reset account
                </a>

                <br />
                <p>Thanks for joing Oros Tridex (Trading and Security Exchange Platform) </p>
            </div>
        `
    }

    // return template
    return template;
}

module.exports = buildTemplate;