import Output from "@utils/output";
import axios from "axios";
import measureDownloadSpeed from "@utils/download";

const PING_URL = "https://1.1.1.1";
const DOWNLOAD_URL = "https://raw.githubusercontent.com/mishashto/.github/main/nonsense.txt";

Output.Log(`mnetgraph ${process.env.npm_package_version}`);

(async () => {
    let pingResults: Array<number> = [];
    let jitterResults: Array<number> = [];

    for (var i: number = 0; i < 16; i++)
    {
        Output.Log(`Running ping test ${i + 1}/16...`);
        let tDelta = +new Date();
        let _r = await axios.get(PING_URL);
        let tDeltaDiff = +new Date() - tDelta;
        pingResults.push(tDeltaDiff);

        if (i != 0)
            jitterResults.push(pingResults[i - 1] - tDeltaDiff);
    }
    let pingSum = pingResults.reduce((a, b) => a + b, 0);
    let pingAvg = (pingSum / pingResults.length) || 0;

    let jitterSum = jitterResults.reduce((a, b) => a + b, 0);
    let jitterAvg = (jitterSum / jitterResults.length) || 0;

    let downloadResults: Array<number> = [];

    for (var i: number = 0; i < 16; i++)
    {
        Output.Log(`Running download test ${i + 1}/16...`);
        let measurement = await measureDownloadSpeed(DOWNLOAD_URL);
        downloadResults.push(measurement as number);
    }

    let downloadSum = downloadResults.reduce((a, b) => a + b, 0);
    let downloadAvg = (downloadSum / downloadResults.length) || 0;
    let downloadDiff = Math.max.apply(Math, downloadResults) - Math.min.apply(Math, downloadResults);

    Output.Log(`Average ping value is: ${pingAvg.toFixed(3).toString().green}ms :: ${pingAvg < 50 ? ' GOOD '.white.bgGreen : ' QUESTIONABLE '.white.bgYellow}`);
    Output.Log(`Average jitter value is: ${jitterAvg.toFixed(3).toString().green}ms :: ${jitterAvg < 10 ? ' GOOD '.white.bgGreen : ' QUESTIONABLE '.white.bgYellow}`);
    Output.Log(`Average download value is: ${downloadAvg.toFixed(3).toString().green} MB/s :: ${downloadAvg > 10 ? ' GOOD '.white.bgGreen : ' QUESTIONABLE '.white.bgYellow}`);
    Output.Log(`Download max-min value is: ${downloadDiff.toFixed(3).toString().green} MB/s :: ${downloadDiff < 10 ? ' GOOD '.white.bgGreen : ' QUESTIONABLE '.white.bgYellow}`);
})().catch(Output.Error);