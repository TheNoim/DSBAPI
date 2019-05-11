workflow "Run daily tests" {
  on = "schedule(20 0 * * *)"
  resolves = ["Run Tests"]
}

workflow "Test on Push" {
  on = "push"
  resolves = ["Run Tests"]
}

workflow "Run Test on pull request" {
  resolves = ["Run Tests"]
  on = "pull_request"
}

workflow "Release" {
  resolves = ["Publish"]
  on = "release"
}

action "Install" {
  uses = "Borales/actions-yarn@master"
  args = "install"
}

action "Build" {
  uses = "Borales/actions-yarn@master"
  args = "build"
  needs = ["Install"]
}

action "Run Tests" {
  uses = "Borales/actions-yarn@master"
  needs = ["Build"]
  args = "test"
  secrets = ["DSBUSERNAME", "PASSWORD"]
}

action "Publish" {
  uses = "Borales/actions-yarn@master"
  needs = ["Build", "Update Docs"]
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}

action "Generate Docs" {
  uses = "Borales/actions-yarn@master"
  needs = ["Build"]
  args = "generate-doc"
}

action "Update Docs" {
  needs = ["Generate Docs"]
  uses = "maxheld83/ghpages@v0.2.1"
  env = {
    BUILD_DIR = "docs/"
  }
  secrets = ["GH_PAT"]
}
