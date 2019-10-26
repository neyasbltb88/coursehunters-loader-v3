<template>
    <button class="btn" :disabled="!hasChecked" :title="btnTitle" @click="btnClick">{{btnText}}</button>
</template>

<script>
import { mapGetters } from 'vuex';
import Utils from '^/utils';

export default {
    data() {
        return {
            Utils
        };
    },
    computed: {
        ...mapGetters([
            'isLoading',
            'notWasLoadedCheckedCnt',
            'notLoadedCnt',
            'totalCheckedNotWasLoaded',
            'totalNotWasLoaded',
            'justLoadedCnt'
        ]),

        hasChecked() {
            return this.notWasLoadedCheckedCnt > 0;
        },
        btnTitle() {
            let title = '';

            if (this.hasChecked && !this.isLoading) {
                title = 'Начать скачивание выделенных уроков';
            } else if (this.hasChecked && this.isLoading) {
                title = 'Остановить скачивание';
            } else if (!this.hasChecked) {
                title = 'Нет отмеченных уроков для скачивания';
            }

            return title;
        },
        btnText() {
            let text = '';
            if (this.hasChecked) {
                let total = this.Utils.FileSize(this.totalCheckedNotWasLoaded);
                let loaded = this.Utils.FileSize(this.totalNotWasLoaded);

                if (!this.isLoading) {
                    text = `Скачать: ${this.notWasLoadedCheckedCnt} / ${this.notLoadedCnt} (${total})`;
                } else if (this.isLoading) {
                    text = `Скачено: ${this.justLoadedCnt} / ${this.notWasLoadedCheckedCnt} (${loaded} / ${total})`;
                }
            } else {
                text = 'Выберите уроки для скачивания';
            }

            return text;
        }
    },
    methods: {
        btnClick() {
            this.$emit('btnClick');
        }
    }
};
</script>