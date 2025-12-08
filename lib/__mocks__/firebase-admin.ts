// Mock Firebase Admin SDK for testing
export const adminDb = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  collection: jest.fn((_path: string) => ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    doc: jest.fn((_docId: string) => ({
      get: jest.fn(),
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
    get: jest.fn(),
    where: jest.fn(() => ({
      get: jest.fn(),
      orderBy: jest.fn(() => ({
        get: jest.fn(),
        limit: jest.fn(() => ({
          get: jest.fn(),
        })),
      })),
    })),
    orderBy: jest.fn(() => ({
      get: jest.fn(),
      limit: jest.fn(() => ({
        get: jest.fn(),
      })),
    })),
    limit: jest.fn(() => ({
      get: jest.fn(),
    })),
  })),
  batch: jest.fn(() => ({
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    commit: jest.fn(),
  })),
}

export const adminAuth = {
  verifySessionCookie: jest.fn(),
  createSessionCookie: jest.fn(),
  revokeRefreshTokens: jest.fn(),
}

// Helper to create mock Firestore document data
export function createMockDoc(data: unknown, id: string = 'mock-id') {
  return {
    id,
    data: () => data,
    exists: true,
    ref: {
      id,
      path: `mock/path/${id}`,
    },
  }
}

// Helper to create mock Firestore document snapshot (for .get() calls)
export function createMockDocSnapshot(data: unknown, id: string = 'mock-id') {
  return {
    id,
    data: () => data,
    exists: data !== null && data !== undefined,
    ref: {
      id,
      path: `mock/path/${id}`,
    },
  }
}

// Helper to create mock Firestore query snapshot
export function createMockQuerySnapshot(docs: unknown[]) {
  return {
    docs,
    empty: docs.length === 0,
    size: docs.length,
    forEach: (callback: (doc: unknown) => void) => {
      docs.forEach(callback)
    },
  }
}

