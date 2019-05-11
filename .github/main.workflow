workflow "Daily Test" {
  on = "schedule(20 0 * * *)"
  resolves = ["Generate Docs"]
}

workflow "Pull Test" {
  resolves = ["Generate Docs"]
  on = "pull_request"
}

workflow "Push Test" {
  on = "push"
  resolves = ["Publish"]
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

action "Generate Docs" {
  uses = "Borales/actions-yarn@master"
  needs = ["Run Tests"]
  args = "generate-doc"
}

action "Tag" {
  needs = "Generate Docs"
  uses = "actions/bin/filter@master"
  args = "tag"
}

action "Update Docs" {
  needs = ["Tag"]
  uses = "maxheld83/ghpages@v0.2.1"
  env = {
    BUILD_DIR = "docs/"
  }
  secrets = ["GH_PAT"]
}

action "Publish" {
  uses = "Borales/actions-yarn@master"
  needs = ["Update Docs"]
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}