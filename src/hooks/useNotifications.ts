import { useState, useCallback, useSyncExternalStore } from "react";

export type NotifLevel = "info" | "success" | "warning" | "error";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  level: NotifLevel;
  time: string;
  read: boolean;
  source: string;
}

const initialNotifications: AppNotification[] = [
  { id: "1", title: "Productie target bereikt", message: "Lijn 2 heeft het dagdoel van 380 boeketten behaald. Uitstekend werk!", level: "success", time: "2 min geleden", read: false, source: "Productie" },
  { id: "2", title: "Temperatuurwaarschuwing koelcel 3", message: "Temperatuur is gestegen naar 4.8°C. Grens is 5°C. Controleer de koeling.", level: "warning", time: "12 min geleden", read: false, source: "Koelcel" },
  { id: "3", title: "Nieuwe planning beschikbaar", message: "De weekplanning voor week 10 is klaargezet door HBMaster.", level: "info", time: "45 min geleden", read: false, source: "Planning" },
  { id: "4", title: "Kwaliteitscontrole afgekeurd", message: "Batch 47 van BQ Trend heeft een afkeurpercentage van 4.2%. Actie vereist.", level: "error", time: "1 uur geleden", read: true, source: "QC" },
  { id: "5", title: "Bezetting bijgewerkt", message: "Middag-shift bezetting is bevestigd: 14 medewerkers op 3 lijnen.", level: "success", time: "2 uur geleden", read: true, source: "HR" },
  { id: "6", title: "Leverancier update", message: "Levering rozen Ecuador is onderweg, verwachte aankomst 14:30.", level: "info", time: "3 uur geleden", read: true, source: "Logistiek" },
  { id: "7", title: "KPI update", message: "Productiebeheersing KPI is gestegen naar 94.2%. Boven target!", level: "success", time: "4 uur geleden", read: true, source: "KPI" },
  { id: "8", title: "Storing lijn 1 verholpen", message: "De storing op lijn 1 is verholpen. Productie hervat om 10:15.", level: "info", time: "Gisteren 16:30", read: true, source: "Productie" },
  { id: "9", title: "Voorraad waarschuwing", message: "Verpakkingsmateriaal voor BQ Elegance bijna op. Bestel binnen 2 dagen.", level: "warning", time: "Gisteren 11:00", read: true, source: "Logistiek" },
  { id: "10", title: "Dagrapport verzonden", message: "Het automatische dagrapport is verstuurd naar het management team.", level: "info", time: "Gisteren 17:00", read: true, source: "Systeem" },
];

// Simple external store for shared notification state
let notifications = initialNotifications;
let listeners: Set<() => void> = new Set();

function emitChange() {
  listeners.forEach(l => l());
}

export function useNotifications() {
  const snap = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => notifications,
  );

  const markRead = useCallback((id: string) => {
    notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    emitChange();
  }, []);

  const markAllRead = useCallback(() => {
    notifications = notifications.map(n => ({ ...n, read: true }));
    emitChange();
  }, []);

  const deleteNotif = useCallback((id: string) => {
    notifications = notifications.filter(n => n.id !== id);
    emitChange();
  }, []);

  const unreadCount = snap.filter(n => !n.read).length;

  return { notifications: snap, unreadCount, markRead, markAllRead, deleteNotif };
}
