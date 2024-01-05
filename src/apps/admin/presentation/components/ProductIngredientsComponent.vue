<script lang="ts">
import InventoryItem from '@/apps/core/data/models/inventoryItem';
import type { IngredientIdItem } from '@/apps/core/data/models/product';
import Product from '@/apps/core/data/models/product';
import BaseButton from '@/common/components/buttons/BaseButton.vue';
import Field from '@/common/forms/fields';
import { defineComponent } from 'vue';


export default defineComponent({
    props: {
        product: {
            type: Product,
            required: true
        },
        field: {
            type: Field<IngredientIdItem[]>,
            required: true
        },
        inventoryItems: {
            type: Array as () => Array<InventoryItem>,
            required: true
        }
    },
    data() {
        return {
            ingredients: this.field.getValue() ?? []
        };
    },
    methods: {
        getItem(id: string): InventoryItem{
            return this.inventoryItems.filter((value: InventoryItem) => {return value.id === id})[0];
        },
        syncWithField(){
            this.field.setValue(this.ingredients);
        },
        newIngredient() {
            this.ingredients.push({
                quantity: 1,
                itemId: this.inventoryItems[0].id as string
            });
            this.syncWithField()
        },
        removeIngredient(idx: number) {
            this.ingredients = this.ingredients.filter((_, i) => i !== idx);
            this.syncWithField()
        },
        perUnit(value: number): number{
            const places = 2;
            return Math.round(1*(10**places)/value)/(10**places);
        }
    },
    components: { BaseButton }
})
</script>
<template>

    <div class="">
        <div class="flex">
            <span class="my-auto">Ingredients</span>
            <div class="ml-auto my-auto">
                <BaseButton @click.prevent="newIngredient">Add Ingredient</BaseButton>
            </div>
        </div>
        <div class="flex flex-wrap">
            <div v-for="ingredientIdItem, i in ingredients" :key="i" class="mr-auto w-1/3 p-2">
    
                <div class="mt-4">
                    <div
                      class="w-full max-w-sm overflow-hidden bg-white border rounded-md shadow-md"
                    >
                        <div
                          class="flex items-center justify-between px-5 py-3 text-gray-700 border-b"
                        >
                          <h3 class="text-sm">
                            {{ getItem(ingredientIdItem.itemId).name }}
                          </h3>
                          <button @click.prevent="() => removeIngredient(i)">
                            <svg
                              class="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        
                        <div class="px-5 py-2 text-gray-700 bg-blue-100 border-b">
                            <label class="text-xs">Ingredient</label>
              
                            <div class="relative mt-2 rounded-md shadow-sm">
                              <span
                                class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600"
                              >
                                <svg
                                  class="w-6 h-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                                  />
                                </svg>
                              </span>
              
                              <select
                              @change="(event: any) => {ingredientIdItem.itemId = inventoryItems[Number.parseInt(event.target.value as string)].id as string; syncWithField()}"
                                type="text"
                                class="w-full bg-gray-100 px-12 py-2 border-transparent rounded-md appearance-none focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                              >
                                <option v-for="item, i in inventoryItems" :key="i" :selected="item.id == ingredientIdItem.itemId" :value="i">
                                    {{ item.name }}
                                </option>
        
                              </select>
                            </div>
                  
        
                          </div>
        
                        <div class="px-5 py-6 text-gray-700 bg-blue-100 border-b">
                          <label class="text-xs">Quantity ({{getItem(ingredientIdItem.itemId).unit}})</label>
            
                          <div class="relative mt-2 rounded-md shadow-sm">
                            <span
                              class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600"
                            >
                              <svg
                                class="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                                />
                              </svg>
                            </span>
            
                            <input
                            @change="syncWithField"
                            v-model="ingredientIdItem.quantity"
                              type="text"
                              class="w-full px-12 py-2 border-transparent rounded-md appearance-none focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                            >
                          </div>
                
        
                        </div>
        
                        <div class="px-5 py-6 text-gray-700 bg-blue-100 border-b">
                            <label class="text-xs">Per Unit ( {{getItem(ingredientIdItem.itemId).unit}})</label>
              
                            <div class="relative mt-2 rounded-md shadow-sm">
                              {{ perUnit(ingredientIdItem.quantity) }} {{ product.name }} per 1 {{ getItem(ingredientIdItem.itemId).unit }} {{ getItem(ingredientIdItem.itemId).name }}
                            </div>
                  
        
                          </div>
                    </div>
                  </div>
        
            </div>
        </div>
    </div>
    

   
</template>