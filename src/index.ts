import "sr-console"
import express from "express";
import spdy from "spdy";
import fs from "fs";

const app = express();
const server = spdy.createServer({
        spdy: {
                protocols: ["h2", "spdy/3.1"],
                plain: true,
                "x-forwarded-for": true,
                connection: {
                    windowSize: 1920*1080,
                    autoSpdy31: true
                }
        }
}, app);
const PRINT = console.defaultPrint;

// FASE 1
server.addListener("listening", async () => PRINT.send("S", "> > > STARTING: SPDY SERVER"));
server.addListener("error", err => PRINT.send("E", err));

app.enable("verbose errors");
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])
app.use(express.static(process.cwd() + "/bucket"));

let port: number;
if (process.env.PORT == undefined) {
        PRINT.send("W", "Not specified port, fallback to port 3000");
        port = 3000;
} else {
        port = parseInt(process.env.PORT);
}

server.listen(port, async () => {
        const address = server.address();
        PRINT.send("L","RAM:", console.color("YELLOW") + console.memory.toString() + "MB");
        PRINT.send("L","Using port", !isString(address) ? `${console.color("YELLOW")}${address?.port}`: `${console.color("RED")}<No disponible>`);
        if (!fs.existsSync("bucket")) fs.mkdirSync("bucket");
});

export const isString = (s: any): s is string => {
        return typeof s === "string";
}