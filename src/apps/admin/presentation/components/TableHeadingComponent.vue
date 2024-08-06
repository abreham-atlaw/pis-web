<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    props: {
        title: {
            type: String,
            required: true
        },
        filterValues: {
            type: Array as () => string[] | null,
            default: null
        },
        filter: {
            type: Function as any as () => (value?: string) => void,
            required: false
        }
    },
    setup(props) {
        const showFilterDropdown = ref(false);

        const toggleFilterDropdown = () => {
            showFilterDropdown.value = !showFilterDropdown.value;
        };

        const handleFilter = (value: string) => {
            if (props.filter) {
                props.filter(value);
            }
            showFilterDropdown.value = false;
        };

        return {
            showFilterDropdown,
            toggleFilterDropdown,
            handleFilter
        };
    }
});
</script>
<template>
    <th class="px-5 py-3 text-sm font-medium text-gray-100 uppercase bg-indigo-800 w-full">
        <span class="flex">
            {{ title }}
            <span v-if="filterValues" class="ml-2 fa-solid fa-filter my-auto" @click="toggleFilterDropdown" ></span>
        </span>
        <div v-if="showFilterDropdown" class="absolute bg-white border mt-1 rounded-md shadow-lg z-10">
            <ul>
                <li class="px-4 py-2 cursor-pointer hover:bg-gray-200 text-dark" @click="handleFilter(null)">
                    All
                </li>
                <li v-for="option in filterValues" :key="option" class="px-4 py-2 cursor-pointer hover:bg-gray-200 text-dark" @click="handleFilter(option)">
                    {{ option }}
                </li>
            </ul>
        </div>
    </th>
</template>