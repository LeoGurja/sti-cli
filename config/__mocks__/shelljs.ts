export default {
  ls: (dir: string) => {
    if (dir.match('.config/')) {
      return { code: 1 }
    }
    return { code: 0 }
  },
  mkdir: () => ({ code: 0 }),
  config: {}
}
