const DB_NAME = 'FrontendTeamDB';
const DB_VERSION = 3;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('tasks')) {
        const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
        taskStore.createIndex('status', 'status');
        taskStore.createIndex('assignee_id', 'assignee_id');
      }

      if (!db.objectStoreNames.contains('summaries')) {
        const summaryStore = db.createObjectStore('summaries', { keyPath: 'id' });
        summaryStore.createIndex('week', ['year', 'week_number']);
      }

      if (!db.objectStoreNames.contains('teamMembers')) {
        db.createObjectStore('teamMembers', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('priorities')) {
        const priorityStore = db.createObjectStore('priorities', { keyPath: 'id' });
        priorityStore.createIndex('level', 'level');
      }
    };
  });
};

export const dbOperation = async <T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest
): Promise<T> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const request = operation(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
