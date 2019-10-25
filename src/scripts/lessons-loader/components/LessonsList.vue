<template>
    <ul class="lessons-list course-wrap">
        <ListItem v-for="item in lesson_items" v-bind="item"
        :key="item.name_prefix + '_' + item.lesson_name" >
        </ListItem>
    </ul>
</template>

<script>
import ListItem from './ListItem.vue';
import { mapState } from 'vuex';

export default {
    components: {
        ListItem
    },
    computed: {
        ...mapState(['lesson_items']),
    },
}
</script>

<style scoped lang="sass">
.course-wrap
    display: block
</style>

