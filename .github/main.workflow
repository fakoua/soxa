workflow "CI" {
  on = "push"
  resolves = ["Run test"]
}

action "Run test" {
  uses = "denolib/deno-action@0.20.0"
  args = "run test.ts"
}
