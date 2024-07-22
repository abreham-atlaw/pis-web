<template>
    <div>
      <select
        :class="`${inputClass} color-${textColor} bg-${bg} border border-${borderWidth} border-${borderColor} text-${textColor} rounded-${borderRadius} focus:outline-none font-medium leading-none py-3 w-full pl-3`"
        :value="(field.getValue() === null) ? '' : field.getValue()"
        @change="handleInput"
      >
        <option v-for="choice in choices" :key="choice" :value="choice">
          {{ choice }}
        </option>
      </select>
      <div v-if="field.error != null" class="text-red-500">
        {{ field.error }}
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import Field from "@/common/forms/fields.js";
  
  export default {
    props: {
      value: {
        type: String,
        default: null,
      },
      field: {
        type: Field<string>,
        default: null,
      },
      stateSyncer: {
        type: Function,
        default: null,
      },
      choices: {
        type: Array as () => string[],
        required: true,
      },
      bg: {
        type: String,
        default: "light",
      },
      inputClass: {
        type: String,
        default: "",
      },
      borderRadius: {
        type: String,
        default: "full",
      },
      borderWidth: {
        type: String,
        default: "1",
      },
      borderColor: {
        type: String,
        default: "grey",
      },
      textColor: {
        type: String,
        default: "dark",
      },
      onChange: {
        type: Function,
        default: null,
      },
      prepareInput: {
        type: Function,
        default: null,
      },
    },
    methods: {
      handleInput(event: any) {
        let value = event.target.value;
        if (this.prepareInput != null) {
          value = this.prepareInput(value);
        }
        this.field.setValue(value);
        if (this.stateSyncer != null) {
          this.stateSyncer();
        }
        if (this.onChange != null) {
          this.onChange(value);
        }
      },
    },
  };
  </script>
  