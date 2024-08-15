import { CollectionReference, type DocumentData, QueryDocumentSnapshot, 
	doc, getDocs, query, setDoc, where, 
	deleteDoc} from "firebase/firestore"
import { collection, addDoc } from "firebase/firestore"; 
import type Model from "@/common/models/model";
import { InstanceNotFoundException, MultipleInstancesFoundException, type Repository } from "./repository";
import Serializer from "../serializers/serializer";
import CoreProviders from "@/di/coreProviders";
import SerialPkGenerator from "./serialPkGenerator";


export abstract class FireStoreRepository<P, M extends Model<P>> implements Repository<P, M>{

	protected collection: CollectionReference;
	private collectionName: string;
	private primaryKeyColumn: string;
	private serializer: Serializer<M, DocumentData>;
	private attachMode: boolean = true;
	private cache: Map<P, QueryDocumentSnapshot<DocumentData>> = new Map();
	private caching: boolean = true;
	private primaryKeyGenerator: SerialPkGenerator<Model<string>>;

 	constructor(
		collectionName: string,
		primaryKeyColumn: string,
		serializer: Serializer<M, DocumentData>
	){
		this.collection = collection(CoreProviders.provideFirestoreDB(), collectionName);
		this.collectionName = collectionName;
		this.primaryKeyColumn = primaryKeyColumn;
		this.serializer = serializer;
		this.primaryKeyGenerator = new SerialPkGenerator(this as any);
	}
	
	protected async getFromCache(pk: P): Promise<QueryDocumentSnapshot<DocumentData> | null>{
		if(!this.caching){
			return null;
		}
		return this.cache.get(pk) ?? null
	} 

	protected async storeToCache(pk: P, instance: QueryDocumentSnapshot<DocumentData>){
		if(!this.caching){
			return;
		}
		this.cache.set(pk, instance) 
	}

	protected async resetCache(pk: P){
		this.cache.delete(pk);
	}

	protected async getDocument(pk: P): Promise<QueryDocumentSnapshot<DocumentData>>{
		const cached = await this.getFromCache(pk)
		
		if(cached != null){
			return cached
		}

		const pkQuery = query(this.collection, where(this.primaryKeyColumn, "==", pk));
		const docs = (await getDocs(pkQuery)).docs;
		if(docs.length == 0){
			throw new InstanceNotFoundException(this.collectionName, pk);
		}
		if(docs.length > 1){
			throw new MultipleInstancesFoundException(this.collectionName, pk);
		}
		
		await this.storeToCache(pk, docs[0])
		return docs[0];
	}

	public async getByPrimaryKey(pk: P): Promise<M>{
		const value = await this.firebaseFetch(
			() => {
				return new Promise((resolve, reject) => {
					this.getDocument(pk).then(
						(document) => {
							resolve(document.data())
						}
					).catch((reason) => {
						reject(reason);
					})
				})
			},
			false
		) as M;
		return value
	}

	private async processDocumentData(data: DocumentData): Promise<M>{
		const instance = this.serializer.deserialize(data)
		if(this.attachMode){
			await this.attachForeignKeys(instance)
		}
		return instance;
	}

	protected async firebaseFetch(fetcher: Function, many: boolean = false): Promise<M|M[]>{
			const data: DocumentData | DocumentData[] = await fetcher()
		if(many){
			const instances: M[] = []
			for(const instanceData of (data as DocumentData[])){
				const value = await this.processDocumentData(instanceData);
				instances.push(value);
			}
			return instances;
		}
		if(data === undefined){
			throw new InstanceNotFoundException(this.collectionName, "custom");
		}
		const value = await this.processDocumentData(data);
		return value;

	}

	public async generateNewPK(instance: M): Promise<P>{
		return (await this.primaryKeyGenerator.generateNewPK() as any);
	}

	public async create(instance: M){
		if(instance.getPK() === null){
			instance.setPK(await this.generateNewPK(instance));
		}

		const data: DocumentData = this.serializer.serialize(instance);
		await addDoc(this.collection, data);
	}

	public async update(instance: M){
		const document = await this.getDocument(instance.getPK()!);
		const data = this.serializer.serialize(instance);
		await setDoc(doc(this.collection, document.id), data);
		this.resetCache(instance.getPK());
	}

	public async save(instance: M){
		try{
			await this.update(instance);
		}
		catch(ex: any){
			if(!(ex instanceof InstanceNotFoundException)){
				throw ex;
			}
			await this.create(instance);

		}
	}

	public async delete(instance: M){
		const document = await this.getDocument(instance.getPK()!);
		await deleteDoc(doc(this.collection, document.id));
	}

	public async getAll(): Promise<M[]> {
		const value = await this.firebaseFetch(
			() => {
				return new Promise((resolve, reject) => {
					getDocs(this.collection).then(
						(docs) => {
							const data = docs.docs.map((snapshot: QueryDocumentSnapshot<DocumentData>) => { return snapshot.data() });
							resolve(data);
						}
					).catch((reason) => {
						reject(reason);
					})
				})
			},
			true
		) as M[];
		return value
	}

	public setAttachMode(mode: boolean){
		this.attachMode = mode;
	}

	public setCaching(caching: boolean){
		this.caching = caching;
	}

	public async attachForeignKeys(instance: M): Promise<void>{

	}
}

