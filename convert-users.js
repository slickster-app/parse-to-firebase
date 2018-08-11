const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');

if (!argv.in || !argv.out) {
    console.info('Usage: node convert-users --in=path/to/source --out=path/to/output [--includeSocials]');
    return;
}

const inputData = require(argv.in);
const outputData = {
    users: []
};

inputData.forEach(user => {
    if (user.email && !user.authDataThirdParty) {
        let password = user._hashed_password;
        if (!password) {
            password = "";
        }
        const passwordUser = {
            localId: user._id,
            email: user.email,
            displayName: user.username,
            passwordHash: Buffer.from(password).toString('base64'),
        }
        outputData.users.push(passwordUser);
    }

    if (!argv.includeSocials) {
        return;
    }

    if (user._auth_data_facebook) {
        const fbUser = {
            localId: user._id,
            displayName: user.username,
            providerUserInfo: [{
                providerId: 'facebook.com',
                rawId: user._auth_data_facebook.id
            }]
        }
        outputData.users.push(fbUser);
    }

    if (user.authDataThirdParty && JSON.parse(user.authDataThirdParty).google) {
        const gUser = {
            localId: user._id,
            email: user.email,
            displayName: user.username,
            providerUserInfo: [{
                providerId: 'google.com',
                rawId: JSON.parse(user.authDataThirdParty).google.id,
            }]
        }
        outputData.users.push(gUser);
    }
});

fs.writeFileSync(argv.out, JSON.stringify(outputData));