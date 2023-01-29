<template>
	<svg width="1.2em" height="1.2em" viewBox="0 0 24 24">
		<path
			:fill="ChangeColor ? props.Color : '#616A72'"
			d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455z"
		></path>
	</svg>
</template>
<script setup lang="ts">

	// 定义传参类型
	const props = defineProps({
		Color: {
			type: String,
		},
		ChangeColor: {
			type: Boolean,
		},
	});
</script>
