import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

async function getHash(text: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function getCachedContent(type: 'dive' | 'formula' | 'solve', key: string): Promise<string | null> {
  try {
    const id = await getHash(`${type}:${key}`);
    const docRef = doc(db, "ai_cache", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().content as string;
    }
  } catch (error) {
    console.error("Cache read error:", error);
  }
  return null;
}

export async function setCachedContent(type: 'dive' | 'formula' | 'solve', key: string, content: string): Promise<void> {
  try {
    const id = await getHash(`${type}:${key}`);
    const docRef = doc(db, "ai_cache", id);
    await setDoc(docRef, {
      content,
      type,
      key,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Cache write error:", error);
  }
}
