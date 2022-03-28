let video = document.getElementById("video");
let model;

//canvas for styled display
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//spin up camera function
const CameraSpin = () => {
    console.log("running ");
    navigator.mediaDevices.getUserMedia({
        video:{width: 600 , height: 400},
        audio : false,
    }).then(stream=>{
        video.srcObject = stream;
    });
};

const detectFaces = async () => {
    const prediction = await model.estimateFaces(video,false)
    
    //this logs arrays of prediction
    console.log(prediction);

    //displaying styling on html webpage
    ctx.drawImage(video,0,0,600,400);
    prediction.forEach(element => {
        ctx.beginPath();
        ctx.lineWidth="4";
        ctx.strokeStyle = "blue";
        ctx.rect(
            element.topLeft[0],
            element.topLeft[1],
            element.bottomRight[0]-element.topLeft[0],
            element.bottomRight[1]-element.topLeft[1]
        );
        ctx.stroke();
        ctx.fillStyle = "red";
        element.landmarks.forEach((landmark)=> {
            ctx.fillRect(landmark[0],landmark[1],5,5);
        })
    });
}

// this function spins up the camera
CameraSpin();

//async functions awaits till the loading of camera is done
video.addEventListener("loadeddata", async() => {

    //loads blazeface ai model
    model =await blazeface.load();

    //25 fps
    setInterval(detectFaces,40);

    //first spin
    detectFaces();
})