// This file fixes the weird issue with importing images from before

declare module '*.png' {
    const value: string;
    export default value;
  }
  