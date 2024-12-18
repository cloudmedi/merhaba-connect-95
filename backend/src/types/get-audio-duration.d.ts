declare module 'get-audio-duration' {
  export function getAudioDurationInSeconds(input: Buffer | Blob): Promise<number>;
}