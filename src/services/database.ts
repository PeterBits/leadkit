const DB_NAME = 'FrontendTeamDB';
const DB_VERSION = 5;

export const STORE_NAMES = {
  TEAM_MEMBERS: 'team_members',
  PRIORITIES: 'priorities',
  CATEGORIES: 'categories',
  PERSONAL_TASKS: 'personal_tasks',
  TEAM_TASKS: 'team_tasks',
  SUBTASKS: 'subtasks',
  TASK_COMMENTS: 'task_comments',
  TIMELINE_EVENTS: 'timeline_events',
  MEETINGS: 'meetings',
  MEETING_TOPICS: 'meeting_topics',
  MEETING_SNAPSHOTS: 'meeting_snapshots',
} as const;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Delete old stores from previous versions
      const oldStores = ['tasks', 'summaries', 'teamMembers'];
      for (const name of oldStores) {
        if (db.objectStoreNames.contains(name)) {
          db.deleteObjectStore(name);
        }
      }

      // Keep priorities (already exists from v2)

      if (!db.objectStoreNames.contains('team_members')) {
        db.createObjectStore('team_members', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('personal_tasks')) {
        const ptStore = db.createObjectStore('personal_tasks', { keyPath: 'id' });
        ptStore.createIndex('status', 'status');
        ptStore.createIndex('category_id', 'category_id');
      }

      if (!db.objectStoreNames.contains('team_tasks')) {
        const ttStore = db.createObjectStore('team_tasks', { keyPath: 'id' });
        ttStore.createIndex('assignee_id', 'assignee_id');
        ttStore.createIndex('status', 'status');
      }

      if (!db.objectStoreNames.contains('subtasks')) {
        const stStore = db.createObjectStore('subtasks', { keyPath: 'id' });
        stStore.createIndex('team_task_id', 'team_task_id');
      }

      if (!db.objectStoreNames.contains('task_comments')) {
        const tcStore = db.createObjectStore('task_comments', { keyPath: 'id' });
        tcStore.createIndex('team_task_id', 'team_task_id');
      }

      if (!db.objectStoreNames.contains('timeline_events')) {
        const teStore = db.createObjectStore('timeline_events', { keyPath: 'id' });
        teStore.createIndex('team_task_id', 'team_task_id');
      }

      if (!db.objectStoreNames.contains('meetings')) {
        const mStore = db.createObjectStore('meetings', { keyPath: 'id' });
        mStore.createIndex('date', 'date');
      }

      if (!db.objectStoreNames.contains('meeting_topics')) {
        const mtStore = db.createObjectStore('meeting_topics', { keyPath: 'id' });
        mtStore.createIndex('meeting_id', 'meeting_id');
        mtStore.createIndex('resolved', 'resolved');
      }

      if (!db.objectStoreNames.contains('meeting_snapshots')) {
        const msStore = db.createObjectStore('meeting_snapshots', { keyPath: 'id' });
        msStore.createIndex('meeting_id', 'meeting_id');
      }
    };
  });
};

export const dbOperation = async <T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest,
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
