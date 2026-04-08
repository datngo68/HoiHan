import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  updateDoc,
  getCountFromServer,
} from 'firebase/firestore'
import { db } from './firebase'
import { encodeConfigToURL } from '../utils/urlConfig'
import type { UserConfig } from '../types'

export interface LinkDoc {
  id: string
  uid: string
  senderName: string
  receiverName: string
  themeColor: string
  language: 'vi' | 'en'
  encodedUrl: string
  isPaid: boolean
  paidAmount: number
  createdAt: Date
  views: number
}

/** Get all links belonging to a user */
export async function getUserLinks(uid: string): Promise<LinkDoc[]> {
  const q = query(
    collection(db, 'links'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<LinkDoc, 'id' | 'createdAt'>),
    createdAt: d.data().createdAt?.toDate() ?? new Date(),
  }))
}

/** Count how many links a user has */
export async function getUserLinkCount(uid: string): Promise<number> {
  const q = query(collection(db, 'links'), where('uid', '==', uid))
  const snap = await getCountFromServer(q)
  return snap.data().count
}

/** Check if user is eligible for a free link (first link only) */
export async function canCreateFreeLink(uid: string): Promise<boolean> {
  const count = await getUserLinkCount(uid)
  return count === 0
}

/** Create a new link in Firestore */
export async function createLink(
  uid: string,
  config: UserConfig,
  isPaid: boolean,
): Promise<string> {
  const encodedUrl = encodeConfigToURL(config)
  const ref = await addDoc(collection(db, 'links'), {
    uid,
    senderName: config.senderName,
    receiverName: config.receiverName,
    themeColor: config.themeColor,
    language: config.language,
    encodedUrl,
    isPaid,
    paidAmount: isPaid ? 19999 : 0,
    views: 0,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

/** Delete a link (only owner should call this — enforced by Firestore rules) */
export async function deleteLink(linkId: string): Promise<void> {
  await deleteDoc(doc(db, 'links', linkId))
}

/** Increment view counter for a link */
export async function incrementLinkViews(linkId: string): Promise<void> {
  await updateDoc(doc(db, 'links', linkId), { views: increment(1) })
}
