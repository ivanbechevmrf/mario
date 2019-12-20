export const loadImage = path => {
    return new Promise(resolve => {
        let img = new Image();
        img.src = path;
        img.onload = () => resolve(img);
    });
};
