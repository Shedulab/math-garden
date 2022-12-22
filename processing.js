var model;

async function loadModel() {
    model = await tf.loadGraphModel('TFJS/model.json');
    
};


function predictImage() {
    //console.log('Processing Image...');
    let image = cv.imread(canvas);
    cv.cvtColor(image, image, cv.COLOR_RGB2GRAY, 0);
    cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);
    image = image.roi(rect)

    var height = image.rows;
    var width = image.cols;

    var scale_factor = 0;
    if (height > width) {
        height = 20;
        scale_factor = image.rows / height;
        width = Math.round(image.cols / scale_factor);
      } else {
        width = 20;
        scale_factor = image.cols / width;
        height = Math.round(image.rows / scale_factor);
      }
    
     // console.log(height, width, scale_factor);
    let dsize = new cv.Size(width, height);
    // You can try more different parameters
    cv.resize(image, image, dsize, 0, 0, cv.INTER_AREA);

    const LEFT = Math.ceil(4 + (20 - width)/2);
    const RIGHT = Math.floor(4 + (20 - width)/2);
    const TOP = Math.ceil(4 + (20 - height)/2);
    const BOTTOM = Math.floor(4 + (20 - height)/2);
    const BLACK = new cv.Scalar(0, 0, 0, 0);
    //console.log(LEFT, RIGHT, TOP, BOTTOM);
    cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, BLACK);

    // Center of Mass
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    const MOMENTS = cv.moments(cnt, false);

    const cx = MOMENTS.m10 / MOMENTS.m00;
    const cy = MOMENTS.m01 / MOMENTS.m00;

    //console.log(cx, cy);

    const X_SHIFT = Math.round(image.cols/2 - cx);
    const Y_SHIFT = Math.round(image.rows/2 - cy);

    let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
    let size = new cv.Size(image.rows, image.cols);
    // You can try more different parameters
    cv.warpAffine(image, image, M, size, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK);


    let pixelValues = Float32Array.from(image.data);
    //console.log(pixelValues);

    pixelValues = pixelValues.map(function(item) {
        return item / 255.0;
    });

    //console.log(pixelValues);


    const X = tf.tensor([pixelValues]);
   //console.log(`Shape of Tensor: ${X.shape}`);
    //console.log(`Shape of Tensor: ${X.dtype}`);

    result = model.predict(X);
    //result.print();


    const output = result.dataSync()[0];

    //console.log(tf.memory());

    // const outputCanvas = document.createElement('CANVAS');
    // cv.imshow(outputCanvas, image);
    // document.body.appendChild(outputCanvas)


    // Cleanup after use
    image.delete();
    contours.delete();
    hierarchy.delete();
    cnt.delete();
    M.delete();
    X.dispose();
    result.dispose();

    return output;

}
