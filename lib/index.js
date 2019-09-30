"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
exports.setToken = functions.https.onRequest(async (request, response) => {
    const token = request.body.token;
    if (!token) {
        throw new Error('Invalid or empty token');
    }
    await admin.firestore()
        .collection('devices')
        .doc(token)
        .set({ token, settedAt: new Date() });
    response.sendStatus(204);
});
exports.sendNotifications = functions.https.onRequest(async (request, response) => {
    const devicesSnapshot = await admin.firestore()
        .collection('devices')
        .get();
    await Promise.all(devicesSnapshot.docs.map(doc => admin.messaging().send({
        token: doc.get('token'),
        notification: {
            title: 'Seu dinheiro caiu na conta',
            body: 'Agora você já pode usar seu saldo para realizar pagamentos',
        },
    })));
    response.send(204);
});
//# sourceMappingURL=index.js.map