import {Ref} from "vue";

export const getFromApi = async (
    data:{
        api:any,
        loadedItems:Ref<Array<any>>
    },
    settings:{
        qty: number,
        offset? : number
    }
) =>
{
    // Check if the request URL is set
    const url = new URL(data.api!.requestUrl!);
    // Check if the request strategy is set and append the query parameters if needed
    if (data.api?.requestStrategy === "query" || !data.api?.requestStrategy) {
        url.searchParams.append(
            data.api?.queryNames?.qty ?? "qty",
            String(settings.qty)
        );
        url.searchParams.append(
            data.api?.queryNames?.offset ?? "offset",
            String(String(settings.offset ?? data.loadedItems.value.length)),
        );
    }
    // Check if the request strategy is set and append the path parameters if needed
    if (data.api?.requestStrategy === "slash") {
        url.pathname += `${settings.qty}/${data.loadedItems.value.length}`;
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
        console.error("Network response was not ok");
        return null;
    }
    // Append the response data to the loadedItems array
    const resData = await response.json();
    data.loadedItems.value.push(...resData);

    return resData;
};