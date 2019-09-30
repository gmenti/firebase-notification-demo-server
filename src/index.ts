import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const setToken = functions.https.onRequest(async (request, response) => {
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

export const sendNotifications = functions.https.onRequest(async (request, response) => {
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
