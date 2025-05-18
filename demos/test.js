/* global document, console, frontLLM */

const result = document.getElementById('result');
const testButton = document.getElementById('testButton');
const testStreamingButton = document.getElementById('testStreamingButton');

const gateway = frontLLM('682273a4244c8e541aa63ffc');

async function onTestButtonClicked() {
	result.innerText = 'Loading...';
	try {
		const response = await gateway.complete('Hello world!');
		result.innerText = response.choices[0].message.content;
		console.log('response', response);
	} catch (e) {
		result.innerText = 'Error: ' + e.message;
	}
}

async function onTestStreamingButtonClicked() {
	result.innerText = 'Loading...';
	try {
		const response = await gateway.completeStreaming('Where is europe?');
		result.innerText = '';
		for (;;) {
			const { finished, chunks } = await response.read();
			console.log('chunks', chunks);
			for (const chunk of chunks) {
				result.innerText += chunk.choices[0].delta.content ?? '';
			}
			if (finished) {
				break;
			}
		}
	} catch (e) {
		result.innerText = 'Error: ' + e.message;
	}
}

testButton.addEventListener('click', onTestButtonClicked, false);
testStreamingButton.addEventListener('click', onTestStreamingButtonClicked, false);
