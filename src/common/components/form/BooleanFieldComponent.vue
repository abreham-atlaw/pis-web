<template>
    <input type="checkbox" id="checkbox" v-model="checked" @change="handleCheckboxChange">
  </template>
  
  <script lang="ts">
import Field from '@/common/forms/fields';

  export default {
    props:{
        field: {
            type: Field,
            required: true
        }
    },
    data() {
      return {
        checked: this.field.getValue() ?? false,
      };
    },
    methods: {
      handleCheckboxChange(event: any) {
        this.checked = event.target.checked;
        this.field.setValue(this.checked);
      },
    },
  };
  </script>
  