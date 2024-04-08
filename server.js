const { Vonage } = require('@vonage/server-sdk')
const express = require("express");
const bodyParser = require('body-parser');
const { MDBconnect, MDBdisconnect } = require("./mongoConn");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.sendFile('./frontend/hospitalLogin.html', { root: __dirname });
});
app.post("/hospitalLogin", async (req, res) => {
    try {
        const db = await MDBconnect();
        const {username, email, password} = req.body;
        var data = await db.collection('hospitals').findOne({username: username, password: password});
        await MDBdisconnect();
        if(data){
            res.json({success:true});
        }else{
            res.json({success:false});
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
app.get("/hospitalSignup", (req, res) => {
    res.sendFile('./frontend/hospitalSignup.html', { root: __dirname });
});
app.post("/hospitalSignup", async (req, res) => {
    try {
        const db = await MDBconnect();
        const {username, email, password} = req.body;
        var data = await db.collection('hospitals').insertOne({username: username, email: email, password: password});
        await MDBdisconnect();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
    }
});
app.get("/patientLogin", (req, res) => {
    res.sendFile('./frontend/patientLogin.html', { root: __dirname });
});
app.get("/patientSignup", (req, res) => {
    res.sendFile('./frontend/patientSignup.html', { root: __dirname });
});
app.post("/patientSignup", async (req, res) => {
    try {
        const db = await MDBconnect();
        const {fullName, mobileNumber} = req.body;
        var check = await db.collection('patients').findOne({patientid:mobileNumber});
        if(check){
            await MDBdisconnect();
            return res.json({success:false, message:"Patient Already Exists"});
        }
        await db.collection('patients').insertOne({fullName: fullName, patientid: mobileNumber,sessions:[]});
        await MDBdisconnect();
        res.json({success:true, message:"Patient Added Successfully"});
    } catch (error) {
        console.error('Error:', error);
    }
});
app.get("/patientdashboard", (req, res) => {
    res.sendFile('./frontend/patientdashboard.html', { root: __dirname });
});
app.post("/patientdata", async (req, res) => {
    console.log('patient data requested');
    try {
        const db = await MDBconnect();
        const {patientid} = req.body;
        var data = await db.collection('patients').findOne({patientid:patientid});
        await MDBdisconnect();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
    }
});
app.post("/postsession", async (req, res) => {
    console.log('patient session upload requested');
    try {
        const db = await MDBconnect();
        const { patientid, session } = req.body;
        const patient = await db.collection('patients').findOne({ patientid: patientid });
        console.log(patient);
        if (patient) {
            const existingSessions = patient.sessions;
            existingSessions.push(session);
            console.log(existingSessions)
            const result = await db.collection('patients').updateOne(
                { patientid: patientid },
                { $set: { sessions: existingSessions } }
            );
            await MDBdisconnect();
            res.json(result);
        } else {
            console.log('Patient not found');
            await MDBdisconnect();
            res.status(404).json({ error: 'Patient not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/otpverify', (req, res) => {
    const vonage = new Vonage({
        apiKey: "85152d9b",
        apiSecret: "7WYY6qowSPPtYQ2Y"
    })

    const from = "Vonage APIs"
    let mobnum = req.query.number;
    mobnum = mobnum.replace(/^0+/, '');

    if (mobnum.length <= 10) {
        mobnum = "91" + mobnum;
    }
    const to = mobnum;
    console.log(to);
    const text = 'Your OTP for login at OpenMRS is: ' + req.query.otp;
    console.log(text)

    async function sendSMS() {
        await vonage.sms.send({ to, from, text })
            .then(resp => {
                console.log('Message sent successfully');
                console.log(resp);
                res.json({ success: true })
            })
            .catch(err => { console.log('There was an error sending the messages.'); console.error(err); res.json({ success: false }) });
    }

    sendSMS();
});

app.listen(process.env.PORT, () => {
    console.log('Server is Running on port ' + process.env.PORT);
});