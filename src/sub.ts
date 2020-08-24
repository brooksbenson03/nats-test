import nats, { Message } from "node-nats-streaming"
import { randomBytes } from "crypto"

const clientID = randomBytes(4).toString("hex")

const stan = nats.connect("ticketing", clientID, {
  url: "http://localhost:3200",
})

stan.on("connect", () => {
  console.log("sub connected to nats")

  const sub = stan.subscribe("ticket:created")
  sub.on("message", (msg: Message) => {
    const sequence = msg.getSequence()
    const data = msg.getData()
    console.log("sub", "message", sequence, data)
  })
})
