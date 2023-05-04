import axios from 'axios';
// utilites folder is for universal, reusable functions
export const logIn = async (formData) => {
    try{
        let serverResponse = await axios({
            method: "POST",
            url: "https://wind-bnb-website-api.vercel.app/users/login",
            data: formData,
            mode: 'cors'
        });
        console.log(serverResponse);
        return serverResponse;
    
    } catch (e){
        return "You have an error with the log in. The user was not authenticated."
    }
}
    

export const getUserFromSession = async () => {
    try{
        let response = await axios({
            method: "GET",
            url: 'https://wind-bnb-website-api.vercel.app/session-info',
            mode: 'cors'
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
    } catch(e){
        return "You have an error getting the session-info"
    }
   
}

export const makeServerCall = async (user) => {
    try{
    console.log(user)
    let serverResponse = await axios({
        method: 'GET',
        url: `https://wind-bnb-website-api.vercel.app/get_trips/${user}`
    });
    console.log(serverResponse);
    return serverResponse;
    } catch (e){
        return "You had an error getting the trips"
    }
    
  }
 