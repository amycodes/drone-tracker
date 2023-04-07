# Drone Tracker Manual

To get set up with the manual drone tracker, open up the `index.js` file and replace the `ACCESS_KEY` and `SECRET_KEY` variables with your DigitalOcean Spaces access key and secret key. Additionally, on line 13 and 14 update your region if you deployed your spaces bucket in a location other than `sfo3`. Finally, on line 22, the default bucket name is `drone-tracker-manual`, replace if your bucket is named anything diffrent. 

Run `npm install` to install the dependencies for the application. 

Start the application by running `node index.js`.

Navigate to `http://localhost:3000` and you will upload the `drone.txt` file to your spaces bucket. Each time you hit this endpoint, another file will be uploaded.