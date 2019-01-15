import { each } from "async-es";

const HTTP_GET async () => {

	let promise = new Promise((resolve, reject) => {
		setTimeout(() => resolve("done!"), 1000)
	});

	let result = await promise; // wait till the promise resolves (*)

	alert(result); // "done!"

}

each(images, (value, key, callback) => {
    const imageElem = new Image();
    imageElem.src = value;
    imageElem.addEventListener("load", () => {
        sizes[key] = {
            width: imageElem.naturalWidth,
            height: imageElem.naturalHeight,
        };
        callback();
    });
    imageElem.addEventListener("error", (e) => {
        callback(e);
    });
}, err => {
    if (err) console.error(err.message);
    // `sizes` is now a map of image sizes
    doSomethingWith(sizes);
});



// working here
export default async () => {

	let promise = new Promise((resolve, reject) => {
		setTimeout(() => resolve("done!"), 1000)
	});

	let result = await promise; // wait till the promise resolves (*)

	alert(result); // "done!"

}