const express = require("express");
const querystring = require("querystring");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());
const allowedOrigins = ['http://localhost:3000', 'https://redirect-uri-tan.vercel.app'];

app.use(cors({ origin: allowedOrigins }))

app.use(express.json());
const session = require("express-session");
const cookieParser = require("cookie-parser");
app.use(cookieParser());


app.get("/oauth", (req, res) => {
    const csrfState = Math.random().toString(36).substring(2);
    res.cookie("csrfState", csrfState, { maxAge: 60000 });
      let url = "https://www.tiktok.com/v2/auth/authorize/";
      // the following params need to be in `application/x-www-form-urlencoded` format.
      url += "?client_key=aw0h2vs3s39ad7dk";
      url += "&scope=user.info.basic,video.upload,video.publish";
      url += "&response_type=code";
      url +=
      "&redirect_uri=https://redirect-uri-tan.vercel.app/redirect";
      url += "&state=" + csrfState;
    res.json({ url: url });
  });

  app.post("/tiktokaccesstoken", async (req, res) => {
    try {
      const { code } = req.body;
      const decode = decodeURI(code);
      const tokenEndpoint = "https://open.tiktokapis.com/v2/oauth/token/";
      const params = {
        client_key: "aw0h2vs3s39ad7dk",
        client_secret: "Gd5cLdFaAsv0pzQgidmWWkkeQHxoyBZt",
        code: decode,
        grant_type: "authorization_code",
        redirect_uri: "https://redirect-uri-tan.vercel.app/redirect",
      };
  
      const response = await axios.post(
        tokenEndpoint,
        querystring.stringify(params),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache",
          },
        }
      );
  
      // Log and send the response data back to the frontend
      console.log("response>>>>>>>", response.data);
      res.json(response.data); // Send JSON response back to the frontend
    } catch (error) {
      console.error("Error during callback:", error.message);
      res.status(500).json({ error: "An error occurred during the login process." });
    }
  });
  app.post('/api/creator_info', async (req, res) => {
    const url = 'https://open.tiktokapis.com/v2/post/publish/creator_info/query/';
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(400).json({ error: 'Authorization header is missing' });
    }

    try {
        const response = await axios.post(url, {}, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json; charset=UTF-8'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response.status || 500).json({ error: error.message });
    }
});
  
// window.location.href = `http://localhost:3000/redirect/?response=${encodeURIComponent(JSON.stringify(responseData))}`; 
// res.redirect(`http://localhost:3000/redirect/?response=${encodeURIComponent(JSON.stringify(responseData))}`);


// const REDIRECT_URI = 'https://redirect-uri-tan.vercel.app/redirect';
// const PORT = 4000
// app.get('/oauth/callback', (req, res) => {
//     const csrfState = Math.random().toString(36).substring(2);
//     res.cookie("csrfState", csrfState, { maxAge: 60000 });

//     const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=aw0h2vs3s39ad7dk&scope=user.info.basic,video.upload,video.publish&response_type=code&redirect_uri='https://redirect-uri-tan.vercel.app/redirect'&state=${csrfState}`;
    

//     res.redirect(authUrl);  // Redirect the user to the TikTok authorization page
// });

// app.get('/oauth/redirect', async (req, res) => {
//     const authorizationCode = req.query.code;

//     if (!authorizationCode) {
//         return res.redirect(`http://localhost:3000/redirect/?response=${encodeURIComponent(JSON.stringify({ error: 'Authorization code not found in the URL.' }))}`);
//     }

//     try {
//         const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', new URLSearchParams({
//             client_key: 'aw0h2vs3s39ad7dk',
//             client_secret: 'Gd5cLdFaAsv0pzQgidmWWkkeQHxoyBZt',
//             code: authorizationCode,
//             grant_type: 'authorization_code',
//             redirect_uri: REDIRECT_URI,
//         }).toString(), {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//         },{timeout:1000});

//         const responseData = response.data;

//         // Redirect to React app with the response data
//         res.redirect(`http://localhost:3000/redirect/?response=${encodeURIComponent(JSON.stringify(responseData))}`);
//     } catch (error) {
//         console.error('Error during token exchange:', error);
//         const responseData = { error: 'Failed to exchange token' };
//         res.redirect(`http://localhost:3000/redirect/?response=${encodeURIComponent(JSON.stringify(responseData))}`);
//     }
// });
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });





 // Constants
// const CLIENT_KEY = 'YOUR_CLIENT_KEY';
// const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
// const REDIRECT_URI = 'YOUR_REDIRECT_URI';

// // Get the authorization code from the URL
// const urlParams = new URLSearchParams(window.location.search);
// const authorizationCode = urlParams.get('code');

// (async () => {
//     let responseData;

//     if (authorizationCode) {
//         // Prepare the POST request data
//         const postData = new URLSearchParams({
//             client_key: CLIENT_KEY,
//             client_secret: CLIENT_SECRET,
//             code: authorizationCode,
//             grant_type: 'authorization_code',
//             redirect_uri: REDIRECT_URI,
//         });

//         try {
//             // Make the POST request using fetch
//             const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//                 body: postData.toString(),
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             // Decode the JSON response
//             responseData = await response.json();
//         } catch (error) {
//             // Handle fetch errors
//             responseData = {
//                 error: 'Fetch error: ' + error.message,
//             };
//         }
//     } else {
//         // Handle case where authorization code is not found
//         responseData = {
//             error: 'Authorization code not found in the URL.',
//         };
//     }

//     // Redirect back to React app with response JSON
//     window.location.href = `http://localhost:3000/redirect/?response=${encodeURIComponent(JSON.stringify(responseData))}`;
// })();

app.listen(4000, ()=>{console.log("server is running on port 4000")})
  