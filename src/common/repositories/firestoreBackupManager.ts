import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

export default class FirestoreBackupManager {
    private db = getFirestore();
    private collections: string[];

    constructor(collections: string[]) {
        this.collections = collections;
    }

    // Backs up the entire Firestore database into a JSON object
    public async backup(): Promise<Record<string, Record<string, any>>> {
        console.log("Backing up database...");

        const backupData: Record<string, Record<string, any>> = {};

        for (const collectionName of this.collections) {
            const collectionRef = collection(this.db, collectionName);
            const snapshot = await getDocs(collectionRef);
            backupData[collectionName] = {};

            snapshot.forEach((doc) => {
                backupData[collectionName][doc.id] = doc.data();
            });
        }

        console.log("Backed up database.");

        return backupData;
    }

    // Restores the database to the state represented by the provided JSON object
    public async restore(content: Record<string, Record<string, any>>): Promise<void> {
        console.log("Restoring database...");

        // Step 1: Clear existing data
        for (const collectionName of this.collections) {
            const collectionRef = collection(this.db, collectionName);
            const snapshot = await getDocs(collectionRef);

            const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
        }

        // Step 2: Restore data from content
        for (const [collectionName, documents] of Object.entries(content)) {
            for (const [docId, data] of Object.entries(documents)) {
                const docRef = doc(this.db, collectionName, docId);
                await setDoc(docRef, data);
            }
        }

        console.log("Database restored.");
    }

}
