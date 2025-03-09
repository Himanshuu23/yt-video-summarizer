const generateImage = async (req, res) => {
    return res.json({ res: "this is the response from the generate-image route" })
}

module.exports = { generateImage }

// const fs = require('node:fs');
// const { Buffer } = require('node:buffer');

// void async function() {
//     try {
//         response = await fetch('https://api.imagepig.com/', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Api-Key': 'your-api-key'
//             },
//             body: JSON.stringify({"prompt": "adorable pig"})
//         });

//         if (!response.ok) {
//             throw new Error(`Response status: ${response.status}`);
//         }

//         json = await response.json();
//         const buffer = Buffer.from(json.image_data, 'base64');

//         fs.writeFile(
//             'adorable-pig.jpeg',
//             buffer,
//             (error) => {
//                 if (error) {
//                     throw error;
//                 }
//             }
//         );
//     } catch (error) {
//         console.error(error);
//     }
// }();