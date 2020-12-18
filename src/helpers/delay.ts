export function delay(timer: number) {
  return new Promise<void>(resolve => {
    timer = timer || 2000
    setTimeout(function() {
      resolve()
    }, timer)
  })
};
