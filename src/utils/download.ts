import axios from "axios";

export default async function measureDownloadSpeed(url: string)
{
    const startTime = new Date().getTime();
    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
    });

    const responseStream = response.data;

    // Discard the data as it's being received
    responseStream.on('data', () => {});

    return new Promise((resolve, reject) => {
        responseStream.on('end', () => {
            const endTime = new Date().getTime();
            const durationInSeconds = (endTime - startTime) / 1000;
            const fileSizeInBytes = Number(response.headers['content-length']);
            const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
            const downloadSpeedInMBps = fileSizeInMB / durationInSeconds;
            resolve(downloadSpeedInMBps);
        });
        responseStream.on('error', reject);
    });
};