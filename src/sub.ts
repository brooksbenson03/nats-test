import nats from "node-nats-streaming"
import { randomBytes } from "crypto"
import { TicketCreatedListener } from './events/ticket-created-listener';

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

  const sub = new TicketCreatedListener(stan).listen()
})

process.on('SIGINT', () => {
  console.log('SIGINT')
  stan.close()
})

process.on('SIGKILL', () => {
  console.log('SIGKILL')
  stan.close()
})


