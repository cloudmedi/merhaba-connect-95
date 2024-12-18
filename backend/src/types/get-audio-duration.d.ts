declare module 'get-audio-duration' {
  export function getAudioDurationInSeconds(input: string | Buffer): Promise<number>;
}