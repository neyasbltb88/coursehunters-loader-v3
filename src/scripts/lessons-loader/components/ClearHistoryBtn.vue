<template>
    <a href="#" @click.prevent="handlerClearHistory">Очистить историю скачиваний</a>
</template>

<script>
export default {
    methods: {
        handlerClearHistory() {
            this.$emit('clearHistory');
        }
    }
};
</script>
