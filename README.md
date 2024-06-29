## Vue Virtual Api Scroller

#### Vue component designed for efficient content rendering and dynamic loading based on various strategies. Below is a detailed overview of its features and usage:

### _API Request & Render_

```js
<VirtualScroller
    :api="{
      requestUrl: 'https://localhost:44336/api/get/',
      requestStrategy: 'slash', // 'slash' | 'query
      queryNames: { qty: 'my-qty', offset: 'my-offset' } // if query strategy has been chosen
    }"
    :settings="{
      loadPerScroll:1, // number (default = 1)
      initialQty:10 // initial objects qunatity to load
    }"
/>
```

If you want to fetch objects from your API in addition to rendering, use the API object. You need to provide a `requestUrl`, for example: `https://yourpage.com/api/list/`. Depending on whether you choose 'slash' or 'query' strategy, your API requests will look like this: `https://yourpage.com/api/list/5/50` or `https://yourpage.com/api/list?qty=5&offset=50`. You can also override the query parameter names by setting `queryNames` in the API object.

To automatically load objects on startup, use the `autoInit` option and specify the number of objects to load initially, for example, `10`. These will be the initial objects loaded automatically on startup.

### _Render-Only_

If your focus is solely on rendering, you can omit the API options and directly pass a full list of objects to items in renderOnly parameter.


```js
<VirtualScroller
      :render-only="{
        items: test  
      }"
      :settings="{ 
        loadStrategy: 'single', 
        initialQty:10 
      }"
/>
```

### Props:

- **renderOnly** (optional):
    - **items**: An optional array of items to display within the component.

- **settings** (optional):
    - **loadPerScroll**: Specifies how items are loaded during scrolling. Can be `"single"` or a number indicating the quantity of items to load per scroll event.
    - **initialQty**: Specifies the initial quantity of items to load.

- **api** (optional):
    - **requestUrl**: The base URL for API requests.
    - **requestStrategy**: Specifies the strategy for API requests, either `"slash"` for URL path parameters or `"query"` for URL query parameters.
    - **queryNames**: Optional object specifying query parameter names for `"qty"` and `"offset"`.
