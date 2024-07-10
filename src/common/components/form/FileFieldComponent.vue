<template>
  <div>
    <input type="file" @change="handleFileInput">
  </div>
</template>

<script lang="ts">
import Field from '@/common/forms/fields';

export default {
  props: {
    onFileSelected: {
      type: Function,
      default: null
    },
    field: {
        type: Field<File>,
        required: true
    },
  },
  methods: {
    handleFileInput(event) {
      const file = event.target.files[0];
      this.field.setValue(file);
      if(this.onFileSelected != null){
        this.onFileSelected(file);
      }
    }
  }
};
</script>