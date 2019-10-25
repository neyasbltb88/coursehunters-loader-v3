<template>
    <li class="lessons-item" @click="toggleChecked" :class="isActive ? 'active' : ''">
        <div class="lessons-head">
            <input class="item_checked" type="checkbox" name="item_checked" 
                v-model="is_checked"
            >    
            <span class="lessons-title" v-if="name_prefix">{{name_prefix}} {{is_loaded ? '(Скачен)': ''}}</span>
            <span class="empty"></span>
            <span class="lessons-duration" v-if="total|is_loaded">
                <span v-if="is_loading">{{Utils.FileSize(loaded)}} /</span>
                <span v-if="total">{{Utils.FileSize(total)}}</span>
                <span v-if="is_loading|is_loaded">({{percent}}%)</span>
            </span>
        </div>
        <div class="lessons-name">{{lesson_name}}</div>
        <progress class="lessons-list__progress" max="100" :value="percent"></progress>
    </li>
</template>

<script>
import { mapMutations } from 'vuex';
import Utils from '../scripts/utils'

export default {
    props: {
        lesson_name: String,
        name_prefix: String,
        total: Number,
        loaded: Number,
        percent: Number,
        is_loading: Boolean,
        is_loaded: Boolean,
        is_checked: Boolean,
        index: Number
    },
    computed: {
        isActive() {
            if(this.is_checked && !this.is_loaded) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        ...mapMutations(['setIsChecked']),

        // Метод, переключающий выделение айтема
        toggleChecked() {
            if (this.is_loaded || this.is_loading) return;

            this.setIsChecked({
                index: this.index,
                is_checked: !this.is_checked
            });
        }
    },
    data() {
        return {
            Utils
        }
    }
}
</script>

<style lang="sass" scoped>
.lessons-item
    opacity: .4
    &.active
        opacity: 1

.lessons-item:last-child
    border-bottom: none

.item_checked
    margin-right: 5px
    margin-top: 1px

.empty
    flex-grow: 1

.lessons-list__progress
    opacity: .3
</style>


