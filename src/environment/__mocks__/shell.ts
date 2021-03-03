export default {
  exec: jest.fn(() => ({ code: 0 })),
  rm: jest.fn(() => ({ code: 0 })),
  ls: jest.fn(() => ({ code: 1 })),
  mkdir: jest.fn(() => ({ code: 0 }))
}
