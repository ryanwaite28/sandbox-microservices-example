

export function wait(time: number = 1000) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(resolve, time);
  });
}