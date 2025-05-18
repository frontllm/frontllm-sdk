import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const ts = typescript({
	useTsconfigDeclarationDir: true
});

export default [
	{
		input: './src/index.ts',
		plugins: [ts],
		cache: false,
		output: [
			{
				file: './lib/esm/index.js',
				format: 'es'
			},
			{
				file: './lib/cjs/index.cjs',
				format: 'cjs'
			}
		]
	},
	{
		input: './src/index.umd.ts',
		plugins: [
			ts,
			nodeResolve({ browser: true })
		],
		cache: false,
		output: [
			{
				file: './dist/index.umd.js',
				format: 'umd',
				name: 'frontLLM'
			}
		]
	},
	{
		input: './build/index.d.ts',
		output: [
			{
				file: './lib/index.d.ts',
				format: 'es'
			}
		],
		plugins: [dts()],
	}
];
