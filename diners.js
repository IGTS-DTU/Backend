import express from 'express';
import {getData, uploadData} from "./firebase.js";
import {number, z} from 'zod';

const app = new express();
app.use(express.json());


const schema = z.object({
    Round :  z.number().min(1).max(3),
    Pool : z.number().min(1).max(10)
})

app.get('/diners', async function (req,res) {
    const schemaResult = schema.safeParse(req.body);
    if (!schemaResult.success) {
        return res.status(400).json({
            message: "Invalid Round or Pool number",
        });
    }
    const {Round,Pool} = schemaResult.data;
    try {
        const data = await getData("diners", Pool, Round);
        res.json({
            message: "Data fetched successfully",
            data: data,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
})
app.put('/diners', async function(req, res) {
    const schemaResult = schema.safeParse(req.body);
    if (!schemaResult.success) {
        return res.status(400).json({
            message: "Invalid Round or Pool number",
        });
    }
    const {Round,Pool} = schemaResult.data;
    const data = await getData("diners", Pool, Round);
    let scoresData=[];
    let maxi=0,sum=0;
    for(let i=0;i<data.length;i++){
        if(data[i]>maxi) maxi=data[i];
        sum+=data[i];
    }
    const avg=sum/data.length;
    for(let i=0;i<data.length;i++){
        scoresData[i]=data[i]-avg;
        if(data[i]==maxi) scoresData[i]-=maxi/2;
    }
    await uploadData('diners',Pool,Round,scoresData);
    res.json({
        message:"Uploaded successfully"
    })
});


app.listen(3000,()=>{
    console.log("server is running on port 3000");
});