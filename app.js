const http = require("http")
const express = require("express")
const path = require("path")
const fs = require("fs")
const cors = require("cors")
const fetch = require("isomorphic-fetch")

const PORT = process.env.PORT || 3000
const FALLBACK_DATA_PATH = path.resolve("data", "fallback.json")

let app = express()
app.use(
  cors({
    // origin: "https://jj-cctv-demo.netlify.app",
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const cctvUrl = page =>
  `http://apis.data.go.kr/6260000/CctvInfoService/getItsCctvInfoList?serviceKey=OJW0MRmGQd9eUmoOVh%2Fdk%2FXyd%2FM53%2FWpZf4b8wUEqR4tUaPNyYGgUBzhu1xJyoZNyHpCsj8r42trJzWAxi9B7Q%3D%3D&pageNo=${page}&numOfRows=100&resultType=json`

app.get("/cctv/:page?", async (req, res) => {
  let page = req.params.page || 1
  let url = cctvUrl(page)
  try {
    let data = await fetch(url).then(d => d.json())
    res.send(data)
  } catch {
    res.sendFile(FALLBACK_DATA_PATH)
  }
})

try {
  fs.access(FALLBACK_DATA_PATH)
} catch {
  fs.existsSync("data") || fs.mkdirSync("data")
}

const server = http.createServer(app)
server.listen(PORT)
