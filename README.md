![FrontLLM](.github/cover.png)

# FrontLLM

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Ffrontllm%2Ffrontllm-sdk%2Fbadge%3Fref%3Dmain&style=flat-square)](https://actions-badge.atrox.dev/frontllm/frontllm-sdk/goto?ref=main) [![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](/LICENSE) [![View this project on NPM](https://img.shields.io/npm/v/frontllm.svg?style=flat-square)](https://npmjs.org/package/frontllm)

FrontLLM is your public gateway to LLMs. Request LLM directly from your front-end code. No backend needed.

📝 Check the [documentation](https://frontllm.com/docs/introduction) for more details.

### 👀 Demos

* [Explain This](https://frontllm.com/docs/demos/explain-this)
* [Streaming](https://frontllm.com/docs/demos/streaming)
* [Translator](https://frontllm.com/docs/demos/translator)

## 🚀 Installation

### NPM

To use FrontLLM in your project, you can install it via npm:

```bash
npm install frontllm
```

Now you can import the library and create an instance of the gateway with your specific gateway ID:

```js
import { frontLLM } from 'frontllm';
const gateway = frontLLM('<gateway_id>');
```

### CDN

To use FrontLLM via CDN, you can include the following script tag in your HTML file:

```html
<script src="https://cdn.jsdelivr.net/npm/frontllm@0.1.1/dist/index.umd.js"></script>
```

This will expose the `frontLLM` function globally, which you can use to create an instance of the gateway:

```html
<script>
  const gateway = frontLLM('<gateway_id>');
  // ...
</script>
```

## 🎬 Usage

Chat Completion:

```js
const gateway = frontLLM('<gateway_id>');
const response = await gateway.complete('Hello world!');
console.log(response.choices[0].message.content);
```

Chat Completion with Streaming:

```js
const gateway = frontLLM('<gateway_id>');
const response = await gateway.completeStreaming('Where is europe?');
for (;;) {
  const { finished, chunks } = await response.read();
  for (const chunk of chunks) {
    console.log(chunk.choices[0].delta.content);
  }
  if (finished) {
    break;
  }
}
```

## 💡 License

This project is released under the MIT license.
