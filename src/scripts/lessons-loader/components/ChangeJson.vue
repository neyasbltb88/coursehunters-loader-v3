<template>
    <div class="change-json-wrap">
        <input type="file" id="change-json" class="change-json-input" @change="changeJsonHandler" />
        <label for="change-json" class="change-json-label">
            <strong class="change-json-btn btn">Выберите JSON с уроками курса</strong>
            <span class="change-json-course-name hero-description">{{nameDescription}}</span>
        </label>
    </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import SStorage from '^/sstorage';

export default {
    name: 'ChangeJson',
    data() {
        return {
            nameDescription: ''
        };
    },
    computed: {
        ...mapGetters(['cnt', 'getCourseDisplayName'])
    },
    methods: {
        ...mapMutations(['setStorage', 'setCourseName', 'setCourseDisplayName', 'addItem', 'setContent']),

        changeJsonHandler({ target }) {
            if (target.files.length > 0) {
                let fileReader = new FileReader();
                fileReader.onload = ({ target }) => {
                    this.fileReaderHandler(target.result);
                };

                fileReader.readAsText(target.files[0]);
            }
        },
        fileReaderHandler(result) {
            try {
                let json = JSON.parse(result);
                let storage = new SStorage(json.course_name, {});
                this.setStorage(storage);
                this.setCourseName(json.course_name);
                this.setCourseDisplayName(json.course_display_name);
                json.lesson_items.forEach(item => {
                    let restore_item_loaded = storage.get(item.storage_name);
                    item.total = restore_item_loaded ? +restore_item_loaded : item.total;
                    item.loaded = restore_item_loaded ? +restore_item_loaded : item.loaded;
                    item.percent = restore_item_loaded ? 100 : item.percent;
                    item.is_loaded = restore_item_loaded ? true : item.is_loaded;
                    item.was_loaded = restore_item_loaded ? true : item.was_loaded;

                    this.addItem(item);
                });

                storage.set('cnt', this.cnt);

                this.nameDescription = json.course_display_name;

                this.$emit('loaded');
            } catch (err) {
                this.nameDescription = 'Не правильный JSON';
            }
        }
    }
};
</script>

<style lang="sass">
.change-json
    &-wrap
        margin: 20px 0
    &-input
        width: 0.1px
        height: 0.1px
        opacity: 0
        overflow: hidden
        position: absolute
        z-index: -1
    &-label
        display: inline-flex
        align-items: center
    &-btn
    &-course-name
        padding: 0 20px
        &.hero-description
            margin: 0

</style>