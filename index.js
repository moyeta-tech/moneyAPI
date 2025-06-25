const express = require("express")
const axios = require("axios")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())

app.get("/dolar", async (req, res) =>{
    res.send("🟢 API del dólar en Argentina. Usá /dolar para ver las cotizaciones.")
    try{
        const { data } = await axios.get("https://dolarapi.com/v1/dolares")

        console.log(JSON.stringify(data, null, 2))

        const oficial = data.find(d => d.casa === "oficial")
        const blue = data.find(d => d.casa === "blue")
        const mep = data.find(d => d.casa === "bolsa") || {}
        const ccl = data.find(d => d.casa === "contadoconliqui") || {}
        
        res.json({
            oficial: {
                compra: oficial.compra || "No disponible",
                venta: oficial.venta || "No disponible"
            },

            blue: {
                compra: blue.compra || "No disponible",
                venta: blue.venta || "No disponible"
            },

            mep: {
                compra: mep.compra || "No disponible",
                venta: mep.venta || "No disponible",
            },

            ccl: {
                compra: ccl.compra || "No disponible",
                venta: ccl.venta || "No disponible",
            },


            fecha: new Date().toLocaleString("es-AR"),
        })
    } catch(e) {
        console.error("ERROR: ", e.message)
        res.status(500).json({error: "No se pudo obtener el valor del dólar"})
    }
})

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))