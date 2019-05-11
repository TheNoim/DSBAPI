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
