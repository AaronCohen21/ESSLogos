const APIURL = 'https://ess-logos.cyclic.app';

/* Mobile Check Function:
 *
 * source: https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
*/
window.mobileCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

//populate logos box
const logos_box = document.getElementById('logos_box');
const logos = ["SENG", "BME", "CIVIL", "COMP", "ELEC", "MECH"];
logos.forEach(logo => {
    const option = new Option(logo);
    logos_box.appendChild(option);
});

//add functionality to display pane
logos_box.addEventListener('change', (event) => {
    const img = document.getElementById('svg_image');
    img.src = `svg/${logos_box.value.toLowerCase()}.svg`;
});

//swap content layout direction if needed (or if on mobile)
const adjustLayout = (event) => {
    //make sure the image preview page is always a square
    const img = document.getElementById('svg_image');
    img.style.height = `${img.parentNode.offsetWidth}px`;

    //other things to keep track of
    const content = document.getElementById("content");
    const options = document.getElementById("img_options");
    const output = document.getElementById("img_output");
    const info = document.getElementById("info");

    //setup
    info.style.width = `${document.getElementById("logos_box").offsetWidth}px`;

    if (window.innerWidth <= 700 || mobileCheck()) {
        content.style.flexDirection = 'column';
        options.style.width = '100%';
        output.style.width = '100%';
        //info wrapping
        info.style.position = 'relative';
        info.style.marginTop = '20px';
        info.style.marginBottom = '20px';
    } else {
        content.style.flexDirection = 'row';
        options.style.width = '50%';
        output.style.width = '50%';
        //info wrapping
        info.style.position = 'absolute';
        info.style.marginTop = '0px';
        info.style.marginBottom = '0px';
    }
};
addEventListener("resize", adjustLayout);
//call the function one more time incase the page is loaded on mobile
adjustLayout();

//when the color is changed update the svg
const color_picker = document.getElementById('color_picker');
const update_color = (event) => {
    const imgs = document.getElementById('svg_image').getSVGDocument().querySelectorAll('svg');
    imgs.forEach((img) => {
        img.setAttribute('fill', color_picker.value);
        img.setAttribute('stroke', color_picker.value);
    });
}

color_picker.addEventListener('change', update_color);
document.getElementById('svg_image').addEventListener('load', update_color);

//hack to make sure that the iframe is alwyas square
document.getElementById("svg_image").onload = () => {
    const img = document.getElementById('svg_image');
    img.style.height = `${img.parentNode.offsetWidth}px`;
};

//download button functionality
document.getElementById('download_button').addEventListener('click', async (event) => {
    //serealize the svg into a string
    const serealizer = new XMLSerializer();
    const xmlString = serealizer.serializeToString(document.getElementById('svg_image').getSVGDocument().querySelector('svg'));
    //now send that string to the REST API
    try {
        const respone = await fetch(APIURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                xml: xmlString,
                logo: logos_box.value,
                color: color_picker.value
            })
        });
        //recieve the file and download it
        respone.blob().then(blob => {
            //prepare the file to be downloaded
            blob.type = 'image/png';
            const png = window.URL.createObjectURL(blob);
            const downloader = document.createElement('a');
            downloader.href = png;
            //set the file name and download
            downloader.download = '' + logos_box.value + color_picker.value + '.png';
            downloader.click();
        });
    } catch (err) {}
});