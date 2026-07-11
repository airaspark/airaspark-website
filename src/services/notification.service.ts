import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { COLLECTIONS } from "@/utils/constants";
import { timestampToIso } from "@/services/idGenerator.service";
import type { Notification } from "@/types";

function mapNotification(id: string, data: Record<string, unknown>): Notification {
  return {
    id,
    notificationId: data.notificationId as string,
    userId: data.userId as string,
    title: data.title as string,
    message: data.message as string,
    read: Boolean(data.read),
    type: data.type as string,
    link: (data.link as string) ?? null,
    createdAt: timestampToIso(data.createdAt as never),
    updatedAt: timestampToIso(data.updatedAt as never),
  };
}

export async function getUserNotifications(
  userId: string,
  maxResults = 20
): Promise<Notification[]> {
  const q = query(
    collection(db, COLLECTIONS.notifications),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapNotification(d.id, d.data()));
}

export async function markNotificationRead(
  notificationDocId: string
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.notifications, notificationDocId), {
    read: true,
    updatedAt: serverTimestamp(),
  });
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const notifications = await getUserNotifications(userId, 50);
  await Promise.all(
    notifications
      .filter((n) => !n.read)
      .map((n) => markNotificationRead(n.id))
  );
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type = "info",
  link: string | null = null
): Promise<void> {
  const docRef = await addDoc(collection(db, COLLECTIONS.notifications), {
    notificationId: "",
    userId,
    title,
    message,
    read: false,
    type,
    link,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, COLLECTIONS.notifications, docRef.id), {
    notificationId: docRef.id,
  });
}

export async function getUnreadCount(userId: string): Promise<number> {
  const q = query(
    collection(db, COLLECTIONS.notifications),
    where("userId", "==", userId),
    where("read", "==", false)
  );
  const snap = await getDocs(q);
  return snap.size;
}
