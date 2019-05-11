workflow "Run daily tests" {
  on = "schedule(20 0 * * *)"
  resolves = ["Run Tests"]
}

action "Install" {
  uses = "Borales/actions-yarn@master"
  args = "install"
}

action "Run Tests" {
  uses = "Borales/actions-yarn@master"
  needs = ["Install"]
  args = "test"
  secrets = ["DSBUSERNAME", "PASSWORD"]
}

workflow "Test on Push" {
  on = "push"
  resolves = ["Run Tests"]
}

workflow "Run Test on pull request" {
  resolves = ["Run Tests"]
  on = "pull_request"
}
