import express from "express"
import cors from "cors"

const app = express()
const port = 8000

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
  res.send("api eorking")
})

app.listen(port,()=>{
  console.log(`Server started on http://localhost:${port}`)
})