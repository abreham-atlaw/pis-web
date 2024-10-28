<template>
    <div>

        <div class="flex flex-col" v-if="field.getValue() == null">
            <input v-model="searchQuery" class="px-10 py-3 mx-2 my-2 rounded-xl block w-full text-dark" type="text" placeholder="Search...">
            <div class="overflow-y-auto h-[150px]">
                <div v-for="(item, i) in filteredItems.slice(0, 5)" :key="i" class="flex items-center" :class="(selectedItem === item)?'bg-warning text-white':'bg-light text-dark'">
                    <button class="px-10 py-3 mx-2 my-2 rounded-xl" @click.prevent="() => {onSelect(item)}">
                        [ {{item.id}} ]{{ item.name }}
                    </button>
                </div>
            </div>
        </div>

        <div class="flex" v-else>

            <h3 class="font-bold">{{field.getValue().name}}</h3>
            <button class="ml-2 p-2 bg-danger text-white rounded-lg" @click.prevent="() => {field.setValue(null)}"><i class="fa-solid fa-xmark"></i></button>

        </div>
    </div>
    
</template>

<script lang="ts">
import type Item from '@/apps/core/data/models/inventoryItem';
import { defineComponent, ref } from 'vue';
import Field from '@/common/forms/fields';

export default defineComponent({
    props:{
        field: {
            type: Field<Item>,
            required: true
        },
        items: {
            type: Array<Item>,
            required: true
        },
        onItemSelected: {
            type: Function,
            default: null
        }
    },
    data() {
        return {
            selectedItem: null,
            searchQuery: ''
        }
    },
    computed: {
        filteredItems() {
            return this.items.filter(
                item => (
                    item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.id.toLocaleLowerCase().includes(this.searchQuery.toLocaleLowerCase())
                )
            )
        }
    },
    methods: {
        onSelect(item: Item){
            this.field.setValue(item);
            this.selectedItem = item;
            if(this.onItemSelected != null){
                this.onItemSelected!(item);
            }
        }
    },
    watch: {
        selectedItem(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.searchQuery = '';
            }
        }
    }
})
</script>
