import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import electron from 'vite-plugin-electron';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Inspect from 'vite-plugin-inspect';
const pathSrc = path.resolve(__dirname, 'src');
// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': './src',
		},
	},
	plugins: [
		vue(),
		electron({
			main: {
				entry: 'electron/index.ts',
			},
		}),
		AutoImport({
			imports: ['vue', 'vue-router'],
			dirs: [path.join(__dirname, '')],
			resolvers: [
				ElementPlusResolver(),
				// Auto import icon components
				// 自动导入图标组件
				IconsResolver({
					prefix: 'Icon',
				}),
			],
			// 支持ts
			dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
		}),
		Components({
			resolvers: [
				// Auto register icon components
				// 自动注册图标组件
				IconsResolver({
					enabledCollections: ['ep'],
				}),
				// Auto register Element Plus components
				// 自动导入 Element Plus 组件
				ElementPlusResolver(),
			],

			dts: path.resolve(pathSrc, 'components.d.ts'),
		}),
		Icons({
			autoInstall: true,
		}),
		Inspect(),
	],
});
