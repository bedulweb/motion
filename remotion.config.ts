import {Config} from '@remotion/cli/config';

// Render final: H.264, CRF 16, yuv420p.
Config.setVideoImageFormat('png');
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setConcurrency(4);

// Opsional: pakai Chrome lokal (mis. di sandbox tanpa akses unduh).
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
