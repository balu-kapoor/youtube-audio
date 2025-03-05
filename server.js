const express = require("express");
const ytdl = require("ytdl-core");
const youtubedl = require("youtube-dl-exec");

const app = express();
const port = 3000;

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/audio/:videoId", async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    // Validate video ID
    // if (!ytdl.validateID(videoId)) {
    //   return res.status(400).send("Invalid YouTube video ID");
    // }

    // // Get video info with updated options
    // const info = await ytdl.getInfo(url, {
    //   requestOptions: {
    //     headers: {
    //       "User-Agent":
    //         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
    //       "Accept-Language": "en-US,en;q=0.9",
    //     },
    //   },
    // });

    // // Find the best audio format
    // const format = ytdl.chooseFormat(info.formats, {
    //   filter: "audioonly",
    //   quality: "highestaudio",
    // });

    // if (!format) {
    //   return res.status(404).send("No audio formats found");
    // }

    // // Set headers for streaming
    // res.header({
    //   "Content-Type": format.mimeType,
    //   "Content-Length": format.contentLength,
    //   "Accept-Ranges": "bytes",
    // });

    const result = await youtubedl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
      extractAudio: true,
      audioFormat: "mp3",
    });
    console.log(result);

    // Return the audio URL
    const audioUrl = result.url; // Assuming 'url' contains the audio URL
    res.json({ audioUrl }); // Send the audio URL as a JSON response

    // Stream the audio
    // ytdl(url, {
    //   format: format,
    //   highWaterMark: 1 << 25, // 32MB buffer
    // }).pipe(res);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
