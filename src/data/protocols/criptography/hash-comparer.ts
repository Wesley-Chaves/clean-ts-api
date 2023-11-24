export interface HashComparer {
  compare: (password: string, hashToCompare: string) => Promise<boolean>
}
