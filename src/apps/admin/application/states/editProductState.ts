import type Product from "@/apps/core/data/models/product";
import EditModelState from "@/common/state/editModelState";
import type ProductForm from "../forms/productForm";
import type InventoryItem from "@/apps/core/data/models/inventoryItem";



export default class EditProductState extends EditModelState<Product, ProductForm>{

    inventoryItems?: InventoryItem[];

}