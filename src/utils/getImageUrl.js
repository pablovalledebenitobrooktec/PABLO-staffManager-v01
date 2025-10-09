
require('dotenv').config();

function getImageUrl(profilePicture){
    if(!profilePicture) return null;

    return `${process.env.BASE_URL}${profilePicture}`;
}

module.exports = getImageUrl;