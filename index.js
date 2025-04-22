import express from "express"
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import mysql from "mysql2"
import cors from "cors"
require("dotenv").config();
const app=express();
const db=mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    port:process.env.PORT,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
});
app.use(cors({
    origin : true,
    credentials : true
}));    
app.use(express.json());
app.listen(8000,()=>{
 console.log("connected to backend");
})
app.get("/",(req,res)=>{
    res.send("hello its backend");
})
app.get("/listSchools",(req,res)=>{
    const values=[
        req.body.latitude,
        req.body.longitude,
        req.body.latitude,
        req.body.latitude,
        req.body.longitude,
        req.body.latitude
    ];
    if(typeof values[0] != 'number' || typeof values[1] != 'number' ){
        return res.status(400).send("Wrong input .. Please check your input , its datatype again");
    }
    const q="SELECT *,(6371 * acos(cos(radians(?)) * cos(radians(latitude) ) * cos(radians(longitude) -radians(?)) + sin(radians(?)) * sin(radians(latitude)))) as distance_in_KM  FROM tuf.educase order by((6371 * acos(cos(radians(?)) * cos(radians(latitude) ) * cos(radians(longitude) -radians(?)) + sin(radians(?)) * sin(radians(latitude)))))asc;"
    db.query(q,values,(err,data)=>{
        if(err){
            res.status(400).send({msg:"Error in query Check Inputs Again"});
        }
        else {
            res.json(data);
        }
    })
})
app.post("/addSchool",(req,res)=>{
    const values=[
        req.body.id,
        req.body.name,
        req.body.address,
        req.body.longitude,
        req.body.latitude,
    ];
    if(typeof values[0] != 'string' || typeof values[1] != 'string' || typeof values[2] != 'string' || typeof values[3] != 'number' || typeof values[4] != 'number'){
        return res.status(400).send({msg:"Wrong Data Type or Duplicate ID"});
    }
    const q="INSERT INTO `tuf`.`educase` (`id`, `name`,`address`,`longitude`,`latitude`) VALUES (?);";
    db.query(q,[values],(err,data)=>{
        if(err)  res.status(400).send({msg:"Wrong Data Type or Duplicate ID"});
        else return res.json("DONE");
    })
})
app.delete("/del",(req,res)=>{
    console.log(req.body)
    const val=[req.body.id];
    const q="DELETE FROM tuf.educase WHERE id=(?)"
    db.query(q,val,(err,data)=>{
        if(err) console.log(err);
        else {console.log("del");return res.json("DONE");}
    })
})
app.put("/update",(req,res)=>{
    const q="UPDATE `tuf`.`educase` SET `id` = ?, `name` = ?,`address` = ?,`latitude` = ?,`longitude` = ? WHERE (`id` = ?)";
    const values=[
        req.body.id,
        req.body.name,
        req.body.address,
        req.body.latitude,
        req.body.longitude,
        req.body.id,
    ];
    console.log(req.body);
    db.query(q,values,(err,data)=>{
        if(err) {res.send(err);console.log(err)}
        else {res.send(data);console.log("updated")};
    })
})