<template>
    <div class="change-json-wrap">
        <input type="file" id="change-json" class="change-json-input" @change="changeJsonHandler" />
        <label for="change-json" class="change-json-label">
            <strong class="change-json-btn btn">Выберите JSON с уроками курса</strong>
            <span class="change-json-course-name hero-description">{{getCourseDisplayName}}</span>
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
            storage: null
        };
    },
    computed: {
        ...mapGetters(['cnt', 'getCourseDisplayName'])
    },
    methods: {
        ...mapMutations(['setCourseName', 'setCourseDisplayName', 'addItem', 'setContent']),

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
                // this.setCourseName(json.course_name);
                // this.setCourseDisplayName(json.course_display_name);
                // json.lesson_items.forEach(item => this.addItem(item));

                this.$emit('loaded', json);
            } catch (err) {
                console.log(err);
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