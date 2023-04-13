import axios from 'axios';
// utilites folder is for universal, reusable functions
export const logIn = async (formData) => {

    let serverResponse = await axios({
        method: "PUT",
        url: "https://wind-bnb-website-api.vercel.app/users/login",
        data: formData,
        headers: {
            'Content-Type': 'application/json',
            }
    });
    console.log(serverResponse);

return serverResponse;
} 
export const getUserFromSession = async () => {
    let response = await axios('https://wind-bnb-website-api.vercel.app/session-info')
    console.log(response);
    console.log(`hello, this is your session secret, so we can rule this out ${process.env.SESSION_SECRET}`)
    // WE HAVE THE LOGGED IN USER! :)
    if (response.data.session.passport) {
      let user = response.data.session.passport.user;
      console.log(user)
      return user;
    } else {
    return false
    }
}

export const makeServerCall = async (user) => {
    console.log(user)
    let serverResponse = await axios({
        method: 'GET',
        url: `https://wind-bnb-website-api.vercel.app/get_trips/${user}`
    });
    console.log(serverResponse);
    
    return serverResponse;
  }
 