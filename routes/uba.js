import express from 'express';
import {getData, uploadData} from "./firebase.js";
import {z} from 'zod';

const router = express.Router();
router.use(express.json());


const schema = z.object({
    Round :  z.number().min(1).max(3),
    Pool : z.number().min(1).max(10)
})

router.get('/', async function (req,res) {
    const schemaResult = schema.safeParse(req.body);
    if (!schemaResult.success) {
        return res.status(400).json({
            message: "Invalid Round or Pool number",
        });
    }
    
    const {Round,Pool} = schemaResult.data;

    try {
        const data = await getData("uba", Pool, Round);
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

router.put('/', async function(req, res) {
    const schemaResult = schema.safeParse(req.body);
    if (!schemaResult.success) {
        return res.status(400).json({
            message: "Invalid Round or Pool number",
        });
    }
    const {Round,Pool} = schemaResult.data;
    const data = await getData("uba", Pool, Round);
    let scoresData= new Array(Object.keys(data).length).fill(0);
    let smallestunique=0 , highestunique = 0;
    let arr = new Array(31).fill(0);
    for (let i = 0; i < Object.keys(data).length; i++) { // Get the number of keys in the object
        for (let j = 0; j < 3; j++) {
            arr[data[i][j]]++;
        }
    }
    for(let i=1;i<30;i++){
        if(arr[i]==1){
            smallestunique=i;
            break;
        }
    }

    for(let i=30;i>1;i--){
        if(arr[i]==1){
            highestunique=i;
            break;
        }
    }
    for(let i=0;i<Object.keys(data).length;i++){
        for(let j=0;j<3;j++){
            if(data[i][j]==smallestunique) scoresData[i]+=25000 - ((data[i][0]+data[i][1]+data[i][2])*1000)/3;
            if(data[i][j]==highestunique) scoresData[i]+=50000 - ((data[i][0]+data[i][1]+data[i][2])*1000)/3;
        }
    }
    console.log(scoresData);
    await uploadData('uba',Pool,Round,scoresData);
    res.json({
        message:"Uploaded successfully"
    })
});


export default router