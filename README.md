# Instructions
1. Delete your current project folder, and everything in it.
2. Navigate to your desired folder, and create a new folder for this project (i.e. fourtify-api)
3. cd into the folder: `cd fourtify-api`
4. Clone the repo into this folder: `git clone https://github.com/Fourtify/fourtify-api.git .`
5. `npm install` or `sudo npm install`
6. Make a file called ".env" -- `vim .env`
7. Paste the following content:
```

EXPRESS_SECRET=FOURTIFY
NODE_ENV=development
PORT=3001
NODE_TLS_REJECT_UNAUTHORIZED=0

```
8. `npm start`



// --- Postman Oauth Steps --- //
Updated with new admin account

Step 1. 
Set to POST, URL = http://127.0.0.1:3001/authentication/token
In Headers add: 
        Header = Authorization      Value = Basic NjkzZTlhZjg0ZDNkZmNjNzFlNjQwZTAwNWJkYzVlMmU6MDc3ZWJmNjUxMjM5MjRjZWM2ZjE1NmE0NGU2OWRjODc=
        (dont hit send yet)
![alt tag](http://i65.tinypic.com/98bmnm.png)

Step 2.
In Body:
        select: x-www-form-urlencoded
        add:
        Key = grant_type               Value = password
        Key = email                    Value = key006@ucsd.edu
        Key = password                 Value = qwertyjr
        (hit send now)
![alt tag](http://i66.tinypic.com/1676q1x.png)

Step 3.
        Copy accessToken _value
        Use this token to make API calls. Congrats, bro.
![alt tag](http://i64.tinypic.com/i54yvt.png)

Step 4.
        Test your token with a providers call.
        Set to GET, Url = http://127.0.0.1:3001/providers
        Header = Authorization         Value = Bearer(space)(access token)
                                       ex. Bearer 00774359cc9253f553806d0cc90ffc9fcef81092
![alt tag](http://i68.tinypic.com/2wcjmgz.png)


You just made an API call. Now test/make stuff.

