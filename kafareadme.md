KafkaJS-től függetlenül is összeszedtem, hogy milyen requestek hívódnak meg ahhoz, hogy érdemben tudjak fonsumálni adatokat egy kafkáról

1. Metadata request.
Kafka: https://kafka.apache.org/protocol.html#The_Messages_Metadata

KafkaJS: https://github.com/tulios/kafkajs/blob/master/src/broker/index.js#L174

Itt kapunk információt a cluster-ről és az elérhető topicokról és partícióikról.

2. ApiVersions request.
KafkaJS: https://github.com/tulios/kafkajs/blob/master/src/broker/index.js#L129
Kafka: https://kafka.apache.org/protocol.html#The_Messages_ApiVersions

Itt megkapjuk a brokerünk által támogatott api-kat és a hozzájuk tartozó elérhető verziókat.

3. Sasl authentication
* Ez csak akkor hívódik meg, ha a sasl authentikáció be van állítva.

KafkaJS: https://github.com/tulios/kafkajs/blob/master/src/broker/saslAuthenticator/index.js#L27
Kafka leírás: https://kafka.apache.org/protocol.html#sasl_handshake
Protokol doksi: https://kafka.apache.org/protocol.html#The_Messages_SaslAuthenticate

4. Find group coordinator:
Mikor consumer group létrejön, a kafka dinamikusan megjelöl egy brókert, aki a groupCoordinator feladatokat fogja ellátni. A groupCoordinator fő feladata, hogy elossza, hogy egy consumerGrouppon belül ki melyik particiót kapja meg.

KafkaJS: https://github.com/tulios/kafkajs/blob/master/src/broker/index.js#L353
Kafka: https://kafka.apache.org/protocol.html#The_Messages_FindCoordinator

5. Join group
Itt küldjük el azt a request-et, hogy csatlakozni szeretnénk az adott consumerGroup-hoz.
KafkaJS: https://github.com/tulios/kafkajs/blob/master/src/broker/index.js#L373
Kafka: https://kafka.apache.org/protocol.html#The_Messages_JoinGroup

6. Sync group
Sikeres group join után küldünk egy syncGroup request-et.
Ennek lényege, hogy a coordinator-t megkérjük, hogy vizsgálja felül, hogy a consumerGroup-pon belül a legoptimálisabban lettek elosztva a groupMemberek partició szinten.

Vélemény: Nem tudom miért nem tudja ezt a kafka broker megcsinálni a Join group után.
KafkaJS: https://github.com/tulios/kafkajs/blob/master/src/broker/index.js#L373
Kafka: https://kafka.apache.org/protocol.html#The_Messages_SyncGroup

7. HeartBeat
Ahhoz, hogy a groupCoordinator ne távolítson el a consumer group-ból, bizonyos időközönként heartbeat-et kell küldenünk.
KafkaJS: https://github.com/tulios/kafkajs/blob/master/src/broker/index.js#L373
Kafka: https://kafka.apache.org/protocol.html#The_Messages_Heartbeat

8. Fetch
Fetch-el tudjuk lekérni a hozzánk kiosztott message-ket.

KafkaJS: https://github.com/tulios/kafkajs/blob/master/src/broker/index.js#L373
Kafka: https://kafka.apache.org/protocol.html#The_Messages_Fetch