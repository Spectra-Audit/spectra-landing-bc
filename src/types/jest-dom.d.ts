// Wires @testing-library/jest-dom matcher types (e.g. `toBeInTheDocument`,
// `toBeEmptyDOMElement`) into TypeScript for the test suite.
//
// The matchers are registered at runtime by `import '@testing-library/jest-dom'`
// in `jest.setup.js`, but `tsc` does not pick up that side-effect JS import when
// type-checking the `.tsx` test files. This triple-slash reference augments the
// global `jest.Matchers` interface so `tsc --noEmit` recognizes the matchers.
//
// This file is included automatically via the `**/*.ts` glob in tsconfig.json.
/// <reference types="@testing-library/jest-dom" />

export {}
