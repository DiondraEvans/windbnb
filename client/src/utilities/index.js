import axios from 'axios';
// utilites folder is for universal, reusable functions
export const logIn = async (formData) => {
    let serverResponse = await axios({
        method: "PUT",
        url: "/users/login",
        data: formData,
    });
    console.log(serverResponse);

return serverResponse;
} 

export const getUserFromSession = async () => {
    let response = await axios({
        method: "GET",
        url: 'https://wind-bnb-website-api.vercel.app/session-info'
    })
    console.log(response);
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
 