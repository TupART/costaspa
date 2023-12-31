import { addDoc, collection } from 'firebase/firestore'

// import { compareDesc, compareAsc, parseISO } from 'date-fns';
// import axios from 'axios';
import { db } from './firebase'

export async function createUser(uid, data) {
  return await addDoc(collection(db, 'users'), {
    uid,
    ...data
  })
    .then((doc) => {
      console.info('User created with id ', doc.id)
    })
    .catch((e) => {
      console.info('Error creating user', e)
    })
}
/*
export async function createSite(data) {
  const site = firestore.collection('ghost_sites').doc(); // returns DocRef
  await site.set(data); // returns Promise<void>, so we need to await
  return site;
}

export async function updateSite(siteId, data) {
  const site = firestore.collection('ghost_sites').doc(siteId);
  await site.set(data, { merge: true }); // returns Promise<void>, so we need to await
  return site;
}

export async function deleteSite(siteId, token) {
  const resp = await axios.delete(`/api/auth/site/${siteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return resp;
}

export async function getSite(siteId) {
  const doc = await firestore.collection('ghost_sites').doc(siteId).get();
  const site = { id: doc.id, ...doc.data() };
  return site;
}
*/
// test to see if this works on the client side
// export async function getUserSites(uid) {
//   const snapshot = await firestore
//     .collection('ghost_sites')
//     .where('authorId', '==', uid)
//     .get();

//   const sites = [];

//   snapshot.forEach((doc) => {
//     sites.push({ id: doc.id, ...doc.data() });
//   });

//   sites.sort((a, b) =>
//     compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
//   );

//   return { sites };
// }
