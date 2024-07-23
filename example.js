const { Kafka } = require("kafkajs-custom-debug-logs");


const kafkaConsumerAdmin = new Kafka({
  clientId: "example-consumer-kafka-common",
  brokers: ["localhost:9092"],
});

// Create a Kafka consumer
const consumer = kafkaConsumerAdmin.consumer({ groupId: "example-group" });
const admin = kafkaConsumerAdmin.admin();

const topic = "example-created-batch7";

const runConsumer = async () => {
  // Connect the consumer
  await consumer.connect();

  // Subscribe to the topic
  await consumer.subscribe({ topic, fromBeginning: true });

  console.log(`Connected and subscribed to ${topic}`);

  // Consume messages in batches
  await consumer.run({
    eachBatch: async ({ batch, heartbeat, isRunning, isStale }) => {
      for (let message of batch.messages) {
        if (!isRunning() || isStale()) break;

        // Log the message value
        console.log(`Received message: ${message.value.toString()}`);

        // Wait for 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 2000));

        await consumer.describeGroup();
        // Send a heartbeat
        await heartbeat();
      }
    },
  });
};

const runAdmin = async () => {
  // Connect the admin client
  await admin.connect();

  const logGroupDescription = async () => {
    try {
      const groupDescription = await admin.describeGroups(["example-group"]);
      console.log(`Group description:`, groupDescription);
    } catch (error) {
      console.error(`[example/admin] ${error.message}`, error);
    }
  };

  // Call logGroupDescription every 5 seconds
  setInterval(logGroupDescription, 5000);
};

// Run both consumer and admin clients
Promise.all([runConsumer()]).catch((e) => {
  console.error(`[example] ${e.message}`, e);
  process.exit(1);
});
