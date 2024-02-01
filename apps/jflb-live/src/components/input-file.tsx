import { useState } from 'preact/hooks'

// import AWS from 'aws-sdk'

// const S3_BUCKET ='YOUR_BUCKET_NAME_HERE';
// const REGION ='YOUR_DESIRED_REGION_HERE';


// AWS.config.update({
//     accessKeyId: 'YOUR_ACCESS_KEY_HERE',
//     secretAccessKey: 'YOUR_SECRET_ACCESS_KEY_HERE'
// })

// const myBucket = new AWS.S3({
//     params: { Bucket: S3_BUCKET},
//     region: REGION,
// })

const InputFile = () => {

    // const [progress , setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileInput = (event: InputEvent) => {
        console.log(event)
        const target = event.target as HTMLInputElement;
        if (target.files?.length) setSelectedFile(target.files[0]);
    }
    
    console.log(selectedFile)
    // const uploadFile = (file) => {

    //     const params = {
    //         ACL: 'public-read',
    //         Body: file,
    //         Bucket: S3_BUCKET,
    //         Key: file.name
    //     };

    //     myBucket.putObject(params)
    //         .on('httpUploadProgress', (evt) => {
    //             setProgress(Math.round((evt.loaded / evt.total) * 100))
    //         })
    //         .send((err) => {
    //             if (err) console.log(err)
    //         })
    // }


    return <>
        <label for="file-uploader">Choose file to upload</label>
        <input name="file-uploader" id="file-uploader"type="file" onInput={handleFileInput} accept=".xlsx,.xls"/>
    </>
}

export default InputFile;