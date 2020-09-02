import nats, { Message } from "node-nats-streaming"
import { randomBytes } from "crypto"

const clientId = randomBytes(4).toString("hex")

const stan = nats.connect("ticketing", clientId, {
  url: "http://localhost:4222",
})

stan.on("connect", () => {
  console.log('sub connected')

  stan.on('close', () => {
    console.log('closing stan')
    process.exit()
  })

  const options = stan
  .subscriptionOptions()
  .setManualAckMode(true)
  
  const sub = stan.subscribe("ticket:created", "queue-group", options)
  
  sub.on("message", (msg: Message) => {
    const sequence = msg.getSequence()
    const data = msg.getData()
    console.log('msg', sequence, data)
    msg.ack()
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT')
  stan.close()
})

process.on('SIGKILL', () => {
  console.log('SIGKILL')
  stan.close()
})