<template>
    <label class="label-master-checkbox">
        <input type="checkbox" name="master-checkbox" class="master-checkbox" 
            :checked="allChecked" 
            @change="toggleAllCheck"
        >
        <span>{{chxText}}</span>
    </label>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters(['allChecked']),

        chxText() {
            return this.allChecked ? 'Снять выделение со всех' : 'Выделить все уроки';
        }
    },
    methods: {
        ...mapMutations(['masterCheck']),

        toggleAllCheck() {
            this.masterCheck(!this.allChecked);
        }
    }
}
</script>
