var buildTemplate = (names, email, activation_link) => {
    var template = {
        from: 'Oros Capital Tridex <no-reply@orostridex.com',
        to: `${email}`,
        subject: 'Oros Capital Tridex - Account activation',
        html: `
            <div style="margin: 3rem; padding: 1rem; border-radius: 5px; box-shadow: 0rem 0rem 0.6rem 0rem #CCC;">
                <p>Hello ${names}, <br /></p>
                <b>Welcome to Oros Capital Tridex. </b> <br />
                <p>
                    To activate your account please click the link below to verify your email address
                </p>

                <a href="${activation_link}">
                    Click here to activate account
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