/**
 * Represents metadata for a Google Document.
 */
export interface GoogleDocument {
  /**
   * The ID of the Google Document.
   */
documentId: string;
  /**
   * The title of the Google Document.
   */
title: string;
}

/**
 * Represents a change in a Google Document, including the number of words added and removed.
 */
export interface GoogleDocumentChange {
  /**
   * The number of words added in the change.
   */
  wordsAdded: number;
  /**
   * The number of words removed in the change.
   */
  wordsRemoved: number;
  /**
   * The content added in the change.
   */
  contentAdded: string;
  /**
   * The content removed in the change.
   */
  contentRemoved: string;
}

/**
 * Asynchronously retrieves a list of Google Documents for a user.
 *
 * @returns A promise that resolves to an array of GoogleDocument objects.
 */
export async function listGoogleDocuments(): Promise<GoogleDocument[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      documentId: '1',
      title: 'My First Document',
    },
    {
      documentId: '2',
      title: 'Another Document',
    },
  ];
}

/**
 * Asynchronously retrieves the version history of a Google Document and identifies changes.
 *
 * @param documentId The ID of the Google Document.
 * @returns A promise that resolves to an array of GoogleDocumentChange objects.
 */
export async function getGoogleDocumentChanges(
  documentId: string
): Promise<GoogleDocumentChange[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      wordsAdded: 100,
      wordsRemoved: 10,
      contentAdded: 'Added some new content.',
      contentRemoved: 'Removed some old content.',
    },
    {
      wordsAdded: 50,
      wordsRemoved: 5,
      contentAdded: 'Added more content.',
      contentRemoved: 'Removed some content again.',
    },
  ];
}
