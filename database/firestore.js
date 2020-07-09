const admin = require('firebase-admin');
const initFirestore = async () => {
	const serviceAccount = require('./firestoreKey.json');
	console.log('Firestore Successfully Initialized');
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount)
	});
}
const guildExist = async (guildID) => {
  const ref = admin.firestore().collection('guilds');
	const guildRef = await ref.doc(guildID).get();
  return guildRef.exists;
}
const setupGuild = async (guildID, email) => {
  const ref = admin.firestore().collection('guilds');
	const guildRef = ref.doc(guildID);
  guildRef.set({ 
    paypal: email,
    bal: 0.10
  }, {merge: true})
  return true
}
const getPaypal = async (guildID) => {
  const ref = admin.firestore().collection('guilds');
	const guildRef = await ref.doc(guildID).get();
  return guildRef.data().paypal;
}
const getBal = async (guildID) => {
  const ref = admin.firestore().collection('guilds');
	const guildRef = await ref.doc(guildID).get();
  return guildRef.data().bal;
}
module.exports = { getPaypal, guildExist, setupGuild, initFirestore, getBal };
