import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import app from './app';

const storage = getStorage(app);

async function firebaseUploadBlob(blob, path) {
  const uuid = uuidv4();
  const fileName = `${path}/${uuid}`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

export { firebaseUploadBlob };
