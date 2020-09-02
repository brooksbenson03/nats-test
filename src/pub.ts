import nats from "node-nats-streaming"

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
})

stan.on("connect", () => {
  console.log('pub connected')

  const data = JSON.stringify({
    id: "123",
    title: "Concert",
    price: 20,
  })

  stan.publish("ticket:created", data, () => {
    console.log('ticket published')
  })
})
