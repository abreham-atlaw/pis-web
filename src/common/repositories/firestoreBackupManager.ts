import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, Timestamp } from "firebase/firestore";

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
        
        console.log("Clearing existing data...");
        // Step 1: Clear existing data
        for (const collectionName of this.collections) {
            const collectionRef = collection(this.db, collectionName);
            const snapshot = await getDocs(collectionRef);

            const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
        }

        console.log("Restoring data...");
        // Step 2: Restore data from content
        for (const [collectionName, documents] of Object.entries(content)) {
            for (const [docId, data] of Object.entries(documents)) {
                console.log(`Restoring ${collectionName}/${docId}`);
                const docRef = doc(this.db, collectionName, docId);
                
                // Convert timestamp-like objects to Firestore Timestamps
                const transformedData = this.transformTimestamps(data);
                await setDoc(docRef, transformedData);
            }
        }

        console.log("Database restored.");
    }

    // Converts objects with "seconds" and "nanoseconds" fields into Firestore Timestamps
    private transformTimestamps(data: any): any {
        if (Array.isArray(data)) {
            return data.map((item) => this.transformTimestamps(item));
        } else if (data && typeof data === "object") {
            const transformed: any = {};
            for (const [key, value] of Object.entries(data)) {
                if (
                    value &&
                    typeof value === "object" &&
                    "seconds" in value &&
                    "nanoseconds" in value
                ) {
                    transformed[key] = new Timestamp((value as any).seconds, (value as any).nanoseconds);
                } else {
                    transformed[key] = this.transformTimestamps(value);
                }
            }
            return transformed;
        } else {
            return data;
        }
    }
}
