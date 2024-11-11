// This file fixes the weird issue with importing images

declare module '*.png' {
    const value: string;
    export default value;
  }
  