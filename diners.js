import express from 'express';
import {getData, uploadData} from "./firebase.js";

const app = new express();
app.use(express.json());

app.get('/diners',async function(req,res){
    const data = await getData("diners");
    console.log(data);
})

app.put('/diners',async function(req,res){
    const data = await getData("diners");
    let sum=0,cnt=0,maxi=0;
    for(let key in data){
        sum+=data[key];
        cnt++;
        if(data[key]>maxi) maxi=data[key];
    }
    const avg=sum/cnt;
    console.log(avg);
    const scores={...data};
    for(let key in scores){
        if(scores[key]==maxi) scores[key]/=2;
        scores[key]-=avg;
    }
    console.log(scores);
    uploadData(scores,"diners")
})

app.listen(3000,()=>{
    console.log("server is running on port 3000");
});