<template>
    <div class="flex flex-col">
        <input v-model="searchQuery" class="px-10 py-3 mx-2 my-2 rounded-xl block w-full text-dark" type="text" placeholder="Search...">
        <div class="overflow-y-auto h-[150px]">
            <div v-for="(item, i) in filteredItems.slice(0, 5)" :key="i" class="flex items-center" :class="(selectedItem === item)?'bg-warning text-white':'bg-light text-dark'">
                <button class="px-10 py-3 mx-2 my-2 rounded-xl" @click.prevent="() => {onSelect(item)}">
                    {{ item.name }}
                </button>
            </div>
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
            return this.items.filter(item => item.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
        }
    },
    methods: {
        onSelect(item: Item){
            this.field.setValue(item);
            this.selectedItem = item;
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
