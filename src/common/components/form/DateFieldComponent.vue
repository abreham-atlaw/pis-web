<template>
  <div>
    <input
      :class="`${inputClass} color-${textColor} bg-${bg} border border-${borderWidth} border-${borderColor} text-${textColor} rounded-${borderRadius} focus:outline-none font-medium leading-none py-3 w-full pl-3`"
      type="date"
      :value="formattedValue"
      :placeholder="placeholder"
      @change="handleInput"
    />
    <div v-if="field.error != null" class="text-red-500">
      {{ field.error }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Field from "@/common/forms/fields.js";

export default defineComponent({
  props: {
    value: {
      type: Date,
      default: null,
    },
    field: {
      type: Field<Date>,
      default: null,
    },
    stateSyncer: {
      type: Function,
      default: null,
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
    placeholder: {
      type: String,
      default: "",
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
  computed: {
    formattedValue(): string {
      const value = this.field.getValue();
      return value ? value.toISOString().split('T')[0] : '';
    },
  },
  methods: {
    handleInput(event: any) {
      let value = new Date(event.target.value);
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
});
</script>
